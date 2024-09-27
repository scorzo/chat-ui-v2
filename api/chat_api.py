import os
import sys
from datetime import datetime, timedelta
from openai import OpenAI
from google.auth.transport import requests
from google.oauth2 import id_token
import jwt
import argparse
from typing import Dict, Any
import logging
from quart import Quart, request, jsonify, Response
from quart_cors import cors

from dotenv import load_dotenv

# Determine the environment and load the corresponding .env file
environment = os.getenv('ENVIRONMENT', 'local')

if environment == 'local':
    load_dotenv('.env.local')

# Add the parent directory of assistant_module to the Python path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from api.assistant_module.nodes import load_nodes, save_nodes
from api.assistant_module.assistant_module import check_if_thread_exists
from api.assistant_module.thread_store import get_all_threads
from api.assistant_module.assistant_module import generate, create_new_thread, retrieve_existing_thread
from api.assistant_module.tools.model_tools.home_tool import RedfinScraperTool
from api.assistant_module.tools.model_tools.bills_management_sheet_replace_tool import FinanceManagementTool
from api.assistant_module.tools.model_tools.bills_management_sheet_merge_tool import FinanceManagementMergeTool

from api.assistant_module.auth import get_jwt_payload



app = Quart(__name__)
app = cors(app, allow_origin="http://localhost:3000",
           allow_methods=["GET", "POST", "OPTIONS"],
           allow_headers=["Authorization", "Content-Type"])

JWT_SECRET = os.environ.get('JWT_SECRET', 'your_secret_key')
JWT_ALGORITHM = 'HS256'  # Algorithm used to sign the JWT


sync_client = OpenAI(api_key=os.environ['OPENAI_API_KEY'])




### configure logging ###
logger = logging.getLogger()
logger.setLevel(logging.DEBUG)


#### start session stuff ###


def verify_google_token(token):
    """
    Verifies the Google ID token with Google and returns user information if valid.
    """
    try:
        print("Starting verification of Google ID token...")

        # Verify the token and extract the user's information
        print(f"Verifying token: {token[:10]}... (truncated for security)")
        client_id = os.environ['GOOGLE_CLIENT_ID']
        print(f"Using Google Client ID: {client_id}")

        id_info = id_token.verify_oauth2_token(token, requests.Request(), client_id)

        print("Token verified successfully. Extracted user information:")
        print(f"User ID: {id_info['sub']}")
        print(f"Email: {id_info['email']}")
        print(f"Name: {id_info.get('name')}")

        # The ID token is valid; you can trust this user's identity
        return {
            "user_id": id_info['sub'],
            "email": id_info['email'],
            "name": id_info.get('name')
        }
    except ValueError as e:
        # Invalid token
        print(f"Token verification failed: {e}")
        return None
    except KeyError as e:
        # Missing expected data in the token
        print(f"KeyError during token verification: {e}")
        return None
    except Exception as e:
        # General error handling
        print(f"An unexpected error occurred during token verification: {e}")
        return None

def generate_jwt(user_info):
    """
    Generates a JWT for the authenticated user.
    """
    payload = {
        'user_id': user_info['user_id'],
        'email': user_info['email'],
        'name': user_info.get('name'),
        'exp': datetime.utcnow() + timedelta(hours=1)  # Set token expiration time
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

@app.route('/api/login', methods=['POST'])
async def login():
    """
    Handle user login by validating Google token and generating JWT.
    """

    data = await request.get_json()
    google_token = data.get('id_token')

    if not google_token:
        return jsonify({"error": "Missing id_token"}), 400

    user_info = verify_google_token(google_token)
    if not user_info:
        return jsonify({"error": "Invalid token"}), 401

    # Generate and return the JWT
    jwt_token = generate_jwt(user_info)
    return jsonify({"token": jwt_token})




@app.before_request
async def authenticate():
    # Skip authentication for OPTIONS requests
    if request.method == "OPTIONS":
        return  # No need to authenticate OPTIONS requests

    open_routes = ['/api/login', '/api/signup']

    if request.path in open_routes:
        return  # Skip authentication for open routes

    # Use the JWT authentication utility
    payload = get_jwt_payload()
    if payload is None:
        return jsonify({"error": "Authentication failed"}), 401


### end session stuff ###


#### start misc API endpoints ###

@app.route('/api/scrape_redfin', methods=['POST'])
async def scrape_redfin():
    try:
        data = await request.json
        url = data.get('url')
        css_class = data.get('css_class')  # Get the css_class from the request data

        if not url:
            return jsonify({"success": False, "message": "URL is required"}), 400

        tool = RedfinScraperTool()
        result, status = tool._run(url=url, css_class=css_class)

        if status == 200:
            # Convert result to a dictionary
            return jsonify({"success": True, "message": "Scraping successful", "data": result}), 200
        else:
            return jsonify({"success": False, "message": result["error"]}), status

    except Exception as e:
        logging.exception("An error occurred while updating data.")
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/sheet_replace_finance_data', methods=['POST'])
async def read_finance_data():
    try:
        data = await request.json
        spreadsheet_id = data.get('spreadsheet_id')
        range = data.get('range')

        if not spreadsheet_id or range is None:
            return jsonify({"success": False, "message": "Spreadsheet ID and range are required"}), 400

        tool = FinanceManagementTool()
        result, status = tool._run(spreadsheet_id=spreadsheet_id, range=range)

        if status == 200:
            return jsonify({"success": True, "message": "Data retrieval successful", "data": result}), 200
        else:
            return jsonify({"success": False, "message": result["error"]}), status

    except Exception as e:
        logging.exception("An error occurred while retrieving finance data.")
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/api/merge_finance_data', methods=['POST'])
async def merge_finance_data():
    try:
        data = await request.json
        spreadsheet_id = data.get('spreadsheet_id')
        range = data.get('range')

        if not spreadsheet_id or range is None:
            return jsonify({"success": False, "message": "Spreadsheet ID and range are required"}), 400

        tool = FinanceManagementMergeTool()
        result, status = tool._run(spreadsheet_id=spreadsheet_id, range=range)

        if status == 200:
            return jsonify({"success": True, "message": "Data merge successful", "data": result}), 200
        else:
            return jsonify({"success": False, "message": result["error"]}), status

    except Exception as e:
        logging.exception("An error occurred while merging finance data.")
        return jsonify({"success": False, "message": str(e)}), 500


#### end misc API endpoints ###


### begin nodes management api

def find_node_by_id(node, node_id):
    if node.get('node_id') == node_id:
        return node
    if 'children' in node:
        for child in node['children']:
            result = find_node_by_id(child, node_id)
            if result:
                return result
    return None





def get_nodes_for_tool() -> Dict[str, Any]:
    nodes, status_code = load_nodes()
    if status_code != 200:
        logging.error("Error loading nodes: %s", nodes["error"])
        return nodes
    else:
        logging.debug("Nodes loaded successfully.")
    return nodes

@app.route('/api/nodes', methods=['GET'])
async def get_nodes():
    logging.info("Received request for /nodes endpoint.")
    nodes, status_code = load_nodes()
    if status_code != 200:
        logging.error("Error loading nodes: %s", nodes["error"])
    else:
        logging.debug("Nodes loaded successfully.")
    return jsonify(nodes), status_code

@app.route('/api/nodes/<node_id>', methods=['GET'])
async def get_node(node_id):
    nodes, status_code = load_nodes()
    node = find_node_by_id(nodes, node_id)
    if not node:
        return jsonify({'error': 'Node not found'}), 404
    return jsonify(node), status_code

@app.route('/api/nodes', methods=['POST'])
async def create_node():
    nodes, status_code = load_nodes()
    if status_code != 200:
        return jsonify(nodes), status_code

    new_node = await request.json
    parent_id = new_node.pop('parent_id', None)
    if parent_id:
        parent_node = find_node_by_id(nodes, parent_id)
        if not parent_node:
            return jsonify({'error': 'Parent node not found'}), 404
        if 'children' not in parent_node:
            parent_node['children'] = []
        new_node['node_id'] = base64.urlsafe_b64encode(os.urandom(12)).decode('utf-8')
        parent_node['children'].append(new_node)
    else:
        new_node['node_id'] = base64.urlsafe_b64encode(os.urandom(12)).decode('utf-8')
        nodes['children'].append(new_node)
    save_nodes(nodes)
    return jsonify(new_node), 201

@app.route('/api/nodes/<node_id>', methods=['PUT'])
async def update_node(node_id):
    nodes, status_code = load_nodes()
    if status_code != 200:
        return jsonify(nodes), status_code

    node = find_node_by_id(nodes, node_id)
    if not node:
        return jsonify({'error': 'Node not found'}), 404
    data = await request.json
    for key, value in data.items():
        if key != 'node_id':
            node[key] = value
    save_nodes(nodes)
    return jsonify(node)

@app.route('/api/nodes/<node_id>', methods=['DELETE'])
async def delete_node(node_id):
    nodes, status_code = load_nodes()
    if status_code != 200:
        return jsonify(nodes), status_code

    def delete_node_recursive(parent, node_id):
        for child in parent.get('children', []):
            if child.get('node_id') == node_id:
                parent['children'].remove(child)
                return True
            if delete_node_recursive(child, node_id):
                return True
        return False

    if not delete_node_recursive(nodes, node_id):
        return jsonify({'error': 'Node not found'}), 404

    save_nodes(nodes)
    return jsonify({'message': 'Node deleted'})

# modal household management endpoints
@app.route('/api/nodes/<node_id>/tasks', methods=['POST'])
async def add_task(node_id):
    nodes, status_code = load_nodes()
    if status_code != 200:
        return jsonify(nodes), status_code

    node = find_node_by_id(nodes, node_id)
    if not node or 'details' not in node:
        return jsonify({'error': 'Node or details not found'}), 404

    new_task = await request.json
    new_task['task_id'] = base64.urlsafe_b64encode(os.urandom(12)).decode('utf-8')
    if 'tasks' not in node['details']:
        node['details']['tasks'] = []
    node['details']['tasks'].append(new_task)
    save_nodes(nodes)
    return jsonify(new_task), 201

@app.route('/api/nodes/<node_id>/tasks/<task_id>', methods=['PUT'])
async def update_task(node_id, task_id):
    nodes, status_code = load_nodes()
    if status_code != 200:
        return jsonify(nodes), status_code

    node = find_node_by_id(nodes, node_id)
    if not node or 'details' not in node:
        return jsonify({'error': 'Node or details not found'}), 404

    tasks = node['details'].get('tasks', [])
    task = next((t for t in tasks if t['task_id'] == task_id), None)
    if not task:
        return jsonify({'error': 'Task not found'}), 404

    data = await request.json
    for key, value in data.items():
        if key != 'task_id':
            task[key] = value

    save_nodes(nodes)
    return jsonify(task)

@app.route('/api/nodes/<node_id>/tasks/<task_id>', methods=['DELETE'])
async def delete_task(node_id, task_id):
    nodes, status_code = load_nodes()
    if status_code != 200:
        return jsonify(nodes), status_code

    node = find_node_by_id(nodes, node_id)
    if not node or 'details' not in node:
        return jsonify({'error': 'Node or details not found'}), 404
    tasks = node['details'].get('tasks', [])
    task = next((t for t in tasks if t['task_id'] == task_id), None)
    if not task:
        return jsonify({'error': 'Task not found'}), 404
    tasks.remove(task)
    save_nodes(nodes)
    return jsonify({'message': 'Task deleted'})

### end nodes management api

# API ENDPOINTS - THREADS BEGIN

async def print_thread_messages(lookup_id):
    """
    Prints a thread's messages in a human-readable format with date and time information.

    Args:
       lookup_id (int): The unique identifier for the thread.

    Raises:
       ValueError: If the lookup_id is not a valid integer.

    Prints:
       - Each message in the thread, formatted as "[timestamp] role: message content".
       - Error messages if the thread is not found or cannot be retrieved.
    """

    thread_info = check_if_thread_exists(lookup_id)

    if thread_info is None:
        print(f"Thread with lookupId {lookup_id} not found.")
        return

    thread_id = thread_info['thread_id']
    thread = await retrieve_existing_thread(thread_id)


    if thread is None:
        print(f"Failed to retrieve thread with lookupId {lookup_id}.")
        return

    messages = sync_client.beta.threads.messages.list(thread_id=thread.id)

    color_blue = "\033[94m"
    color_yellow = "\033[93m"
    color_reset = "\033[0m"

    message_list = []
    for message in reversed(messages.data):
        timestamp = message.created_at

        # Check the type of timestamp and convert accordingly
        if isinstance(timestamp, str):
            # If it's a string, assume it's in ISO format and convert
            formatted_time = datetime.fromisoformat(timestamp).strftime("%Y-%m-%d %H:%M:%S")
        elif isinstance(timestamp, int) or isinstance(timestamp, float):
            # If it's an int or float, assume it's a Unix timestamp and convert
            formatted_time = datetime.fromtimestamp(timestamp).strftime("%Y-%m-%d %H:%M:%S")
        else:
            # If it's already a datetime object, format it directly
            formatted_time = timestamp.strftime("%Y-%m-%d %H:%M:%S")

        # Set the color based on the role of the message
        color = color_yellow if message.role == 'user' else color_blue

        formatted_message = f"{color}[{formatted_time}] {message.role}: {message.content[0].text.value}{color_reset}"
        message_list.append(formatted_message)

    return message_list

async def print_thread_messages_no_formatting(lookup_id):
    """
    """

    thread_info = check_if_thread_exists(lookup_id)

    if thread_info is None:
        print(f"Thread with lookupId {lookup_id} not found.")
        return

    thread_id = thread_info['thread_id']
    thread = await retrieve_existing_thread(thread_id)

    if thread is None:
        print(f"Failed to retrieve thread with lookupId {lookup_id}.")
        return

    messages = sync_client.beta.threads.messages.list(thread_id=thread.id)

    message_list = []
    for message in reversed(messages.data):
        timestamp = message.created_at

        # Check the type of timestamp and convert accordingly
        if isinstance(timestamp, str):
            # If it's a string, assume it's in ISO format and convert
            formatted_time = datetime.fromisoformat(timestamp).strftime("%Y-%m-%d %H:%M:%S")
        elif isinstance(timestamp, int) or isinstance(timestamp, float):
            # If it's an int or float, assume it's a Unix timestamp and convert
            formatted_time = datetime.fromtimestamp(timestamp).strftime("%Y-%m-%d %H:%M:%S")
        else:
            # If it's already a datetime object, format it directly
            formatted_time = timestamp.strftime("%Y-%m-%d %H:%M:%S")


        # Remove terminal color formatting since it's irrelevant for JSON output
        message_list.append({
            "type": "text",
            "text": message.content[0].text.value,
            "date": formatted_time,
            "role": message.role  # Include the role directly
        })

    return message_list

@app.route('/api/threads_get_all', methods=['GET'])
async def threads_get_all():
    try:
        all_threads = get_all_threads()
        return jsonify(all_threads), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/thread_create', methods=['POST'])
async def thread_create_api():
    lookup_id, thread_info, thread = await create_new_thread()
    if lookup_id is None or thread_info is None or thread.id is None:
        return jsonify({"error": "Failed to create new thread"}), 500

    return jsonify({
        "message": "Thread created successfully",
        "lookup_id": lookup_id,
        "thread_id": thread_info['thread_id'],
        "thread_name": thread_info['thread_name']
    })

@app.route('/api/thread_rename', methods=['POST'])
async def thread_rename():
    try:
        data = await request.json
        lookup_id = data.get('lookup_id')

        if not lookup_id:
            return jsonify({"error": "lookup_id is required"}), 400

        thread_info = check_if_thread_exists(lookup_id)
        if thread_info is None:
            return jsonify({"error": f"Thread with lookup_id {lookup_id} not found"}), 404

        thread_id = thread_info['thread_id']
        thread = await retrieve_existing_thread(thread_id)
        if thread is None:
            return jsonify({"error": f"Failed to retrieve thread with lookup_id {lookup_id}"}), 500

        # Fetch the first message from the thread
        messages = sync_client.beta.threads.messages.list(thread_id=thread.id)
        if not messages.data:
            return jsonify({"error": "No messages found in the thread"}), 404

        first_message = messages.data[0].content[0].text.value

        # Use OpenAI API to summarize the first message
        prompt = f"Title this text in 25 chars or less: {first_message}"
        response = sync_client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="gpt-3.5-turbo",
        )
        new_thread_name = response.choices[0].message.content.strip()

        # Set the new thread name using name_thread function
        from api.assistant_module import name_thread
        name_thread(lookup_id, new_thread_name)

        return jsonify({
            "message": "Thread renamed successfully",
            "lookup_id": lookup_id,
            "new_thread_name": new_thread_name
        })

    except Exception as e:
        logging.exception("An error occurred while renaming the thread.")
        return jsonify({"error": str(e)}), 500



@app.route('/api/thread_messages_get', methods=['GET'])
async def thread_messages_get():
    lookup_id = request.args.get('lookup_id')
    messages = await print_thread_messages_no_formatting(lookup_id)
    return jsonify(messages)

# API ENDPOINTS - THREADS END


@app.route('/api/chat', methods=['POST'])
async def chat():
    data = await request.json
    user_query = data.get("query", "")
    lookup_id = data.get("lookup_id", None)
    assistant_id = data.get("assistant_id", None)

    # generate receives an asynchronous iterable
    # quart natively supports async generators
    return Response(generate(user_query, lookup_id, assistant_id), content_type='text/event-stream')






# Utility Function to list all routes from command line
def list_routes():
    import urllib
    output = []
    for rule in app.url_map.iter_rules():
        options = {}
        for arg in rule.arguments:
            options[arg] = f"[{arg}]"

        methods = ','.join(rule.methods)
        url = urllib.parse.unquote(str(rule))
        line = urllib.parse.unquote(f"{rule.endpoint:50s} {methods:20s} {url}")
        output.append(line)

    for line in sorted(output):
        print(line)


def exit_program():
    print("Exiting the program.")
    exit()

async def main():
    while True:
        user_input = input("Please enter your request (or type 'exit' or 'print thread'): ").lower()

        if user_input == 'exit':
            exit_program()
        elif user_input.startswith('print thread'):
            # Extract lookup_id from the user input
            parts = user_input.split()
            if len(parts) == 3 and parts[1] == 'thread':
                try:
                    lookup_id = int(parts[2])
                    formatted_messages = await print_thread_messages(lookup_id)  # Call the print_thread function
                    for formatted_message in formatted_messages:
                        print(formatted_message)
                    break  # Exit the program after printing the thread
                except ValueError:
                    print("Invalid lookup_id. Please enter a numeric lookup_id.")
            else:
                print("Invalid command. Use 'print thread [lookup_id]' to print a thread.")
        else:
            chat_data = {
                "query": user_input,
                "lookup_id": None,
                "assistant_id": None,
                "llm_instructions": None,
                "role": "user"
            }
            ### TODO call the chat function and print the streaming output
            async for response in generate(chat_data["query"], chat_data["lookup_id"], chat_data["assistant_id"], chat_data["role"], chat_data["llm_instructions"]):
                print(response, end='')
            print()  # Print a newline after the entire response is complete


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run the script in CLI, API mode or list routes.")
    parser.add_argument("--mode", choices=["cli", "api", "list_routes"], default="api",
                        help="Run mode: 'cli' for command line interface, 'api' for API, 'list_routes' to display routes. Default is 'api'.")

    args = parser.parse_args()

    host = os.getenv("HOST", "0.0.0.0")
    port = int(os.getenv("PORT", 5001))

    if args.mode == "cli":
        import asyncio
        asyncio.run(main())
    elif args.mode == "api":
        app.run(host=host, port=port, debug=True)
    elif args.mode == "list_routes":
        list_routes()