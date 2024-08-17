import os
import json
import base64
import uuid
import logging
from .load_nodes_tool import GetNodeByIdTool
from assistant_module.generic_agent import GenericAgent
from pydantic import BaseModel

from termcolor import colored

def generate_base64_id():
    """
    Generates a random base64 string to be used as an ID.
    """
    random_uuid = uuid.uuid4()
    return base64.urlsafe_b64encode(random_uuid.bytes).rstrip(b'=').decode('utf-8')

def add_datanode_to_nodes(datanode, node_id, node_type="DatanodeModalContent"):
    """
    Adds a datanode to the nodes.json file under the specified node_id.

    Args:
        datanode (dict): The datanode data to be added as a node.
        node_id (str): The ID of the target node.
        node_type (str): The type of node to be added, defaults to "DatanodeModalContent".

    Returns:
        str: The new node_id of the added datanode.
    """
    nodes_file_path = os.path.join(os.path.dirname(__file__), '../../../nodes', 'nodes.json')

    try:
        # Load existing nodes data
        with open(nodes_file_path, 'r') as file:
            nodes_data = json.load(file)

        # Helper function to find a node by ID
        def find_node_by_id(node, target_id):
            if node['node_id'] == target_id:
                return node
            if 'children' in node:
                for child in node['children']:
                    found_node = find_node_by_id(child, target_id)
                    if found_node:
                        return found_node
            return None

        # Find the target node by ID
        target_node = find_node_by_id(nodes_data, node_id)
        if not target_node:
            raise Exception("Target node ID not found")

        # Create new datanode with a random base64 ID
        new_node_id = generate_base64_id()
        new_node = {
            "node_id": new_node_id,
            "name": datanode['name'],
            "description": datanode.get('description', ''),
            "value": datanode.get('value', 1),
            "modalContentComponent": node_type,
            "details": datanode
        }

        # Append new datanode to target node's children
        if 'children' not in target_node:
            target_node['children'] = []

        target_node['children'].append(new_node)

        # Save updated nodes data back to file
        with open(nodes_file_path, 'w') as file:
            json.dump(nodes_data, file, indent=2)

        return new_node_id

    except Exception as e:
        print(f"Error updating nodes.json: {e}")
        return None

def edit_datanode_in_nodes(node_id, datanode):
    """
    Edits a datanode in the nodes.json file with the specified node_id.

    Args:
        node_id (str): The ID of the node to be edited.
        datanode (dict): The new datanode data to replace the existing node data.
    """
    nodes_file_path = os.path.join(os.path.dirname(__file__), '../../../nodes', 'nodes.json')

    print(colored(f"edit_datanode_in_nodes got node_id: {node_id}", "red"))
    print(colored(f"edit_datanode_in_nodes got datanode: {datanode}", "red"))

    try:
        # Load existing nodes data
        print(colored(f"Loading nodes data from: {nodes_file_path}", "blue"))
        with open(nodes_file_path, 'r') as file:
            nodes_data = json.load(file)
        print(colored("Nodes data loaded successfully", "blue"))

        # Helper function to find and update a node by ID
        def find_and_update_node_by_id(node, target_id, new_data):
            print(colored(f"Checking node: {node.get('node_id', 'unknown')} against target_id: {target_id}", "yellow"))
            if node['node_id'] == target_id:
                print(colored(f"Target node found. Updating node with new data: {new_data}", "green"))
                node['name'] = new_data['name']
                node['description'] = new_data.get('description', '')
                node['value'] = new_data.get('value', 1)
                node['details'] = new_data
                return True
            if 'children' in node:
                for child in node['children']:
                    if find_and_update_node_by_id(child, target_id, new_data):
                        return True
            return False

        # Update the target node by ID
        print(colored("Starting to find and update the target node", "blue"))
        if not find_and_update_node_by_id(nodes_data, node_id, datanode):
            raise Exception("Target node ID not found")

        # Save updated nodes data back to file
        print(colored(f"Saving updated nodes data to: {nodes_file_path}", "blue"))
        with open(nodes_file_path, 'w') as file:
            json.dump(nodes_data, file, indent=2)
        print(colored("Nodes data saved successfully", "blue"))

    except Exception as e:
        print(colored(f"Error updating nodes.json: {e}", "red"))

def generate_datanode_from_model_with_tools(prompt, model_name="gpt-4o", pydantic_model=BaseModel, tools=[], node_id="target_node_id", node_type="DatanodeModalContent", system_instructions="You are a helpful assistant"):
    """
    Generates a datanode based on a user-provided prompt using a specified language model.

    Args:
        prompt (str): The prompt to send to the language model.
        model_name (str): The name of the model to use, defaults to 'gpt-4o'.
        pydantic_model (Pydantic Model): The Pydantic model to use for structured output.
        tools (list): A list of functions to use for post-processing.
        node_id (str): The ID of the target node where the datanode will be added.
        node_type (str): The type of node to be added, defaults to "DatanodeModalContent".
        system_instructions (str): Instructions for the system, defaults to "You are a helpful assistant".

    Returns:
        dict: A dictionary containing the new node_id and the generated datanode.
    """

    # Create an instance of GenericAgent
    generic_agent = GenericAgent(model_name=model_name, pydantic_model=pydantic_model, tools=tools)

    model_name_str = pydantic_model.__name__
    append_this = f" Respond with final answer using a single instance of the {model_name_str} output format and only the {model_name_str} output format."

    # Append the string
    prompt += append_this

    # Generate the response using the agent
    result = generic_agent.generate_response(prompt, system_instructions)

    # Add the generated datanode to nodes.json
    new_node_id = add_datanode_to_nodes(result, node_id=node_id, node_type=node_type)

    return json.dumps({
        "new_node_id": new_node_id,
        "result": result
    })

def edit_datanode_from_model_with_tools(prompt, model_name="gpt-4o", pydantic_model=BaseModel, tools=[GetNodeByIdTool()], node_id="target_node_id", node_type="DatanodeModalContent", system_instructions="You are a helpful assistant"):
    """
    Edits a datanode based on a user-provided prompt using a specified language model.

    Args:
        prompt (str): The prompt to send to the language model.
        model_name (str): The name of the model to use, defaults to 'gpt-4o'.
        pydantic_model (Pydantic Model): The Pydantic model to use for structured output.
        tools (list): A list of functions to use for post-processing.
        node_id (str): The ID of the target node to be edited.
        node_type (str): The type of node to be added, defaults to "DatanodeModalContent".
        system_instructions (str): Instructions for the system, defaults to "You are a helpful assistant".

    Returns:
        dict: A dictionary representation of the edited datanode.

    Example:
        >>> details = edit_datanode_from_model_with_tools("Update travel plan for a summer vacation in Hawaii")
        >>> print(details)
    """

    # Create an instance of GenericAgent
    generic_agent = GenericAgent(model_name=model_name, pydantic_model=pydantic_model, tools=tools)

    model_name_str = pydantic_model.__name__
    append_this = f"Use get_node_by_id tool to retrieve original node contents using node_id {node_id}.  Do not make any changes to the referenced node other than the requested edits.  Respond with final answer using a single instance of the {model_name_str} output format and only the {model_name_str} output format."

    # Append the string
    prompt += append_this

    logging.debug(f"edit_datanode_from_model_with_tools called with prompt: {prompt}, model_name: {model_name}, node_id: {node_id}")

    # Generate the response using the agent - result is a Dict
    result = generic_agent.generate_response(prompt, system_instructions)

    logging.debug(f"edit_datanode_from_model_with_tools called with result: {result}")
    # Edit the datanode in nodes.json - datanode is a Dict
    edit_datanode_in_nodes(node_id=node_id, datanode=result)

    return result

def replace_datanode_from_model_with_tools(prompt, model_name="gpt-4o", pydantic_model=BaseModel, tools=[GetNodeByIdTool()], node_id="target_node_id", node_type="DatanodeModalContent", system_instructions="You are a helpful assistant"):
    """
    Replaces a datanode based on a user-provided prompt using a specified language model.

    Args:
        prompt (str): The prompt to send to the language model.
        model_name (str): The name of the model to use, defaults to 'gpt-4o'.
        pydantic_model (Pydantic Model): The Pydantic model to use for structured output.
        tools (list): A list of functions to use for post-processing.
        node_id (str): The ID of the target node to be replaced.
        node_type (str): The type of node to be added, defaults to "DatanodeModalContent".
        system_instructions (str): Instructions for the system, defaults to "You are a helpful assistant".

    Returns:
        dict: A dictionary representation of the replaced datanode.

    Example:
        >>> details = replace_datanode_from_model_with_tools("Update travel plan for a summer vacation in Hawaii")
        >>> print(details)
    """

    logging.debug(f"replace_datanode_from_model_with_tools called with prompt: {prompt}, model_name: {model_name}, node_id: {node_id}")

    # Create an instance of GenericAgent
    generic_agent = GenericAgent(model_name=model_name, pydantic_model=pydantic_model, tools=tools)

    model_name_str = pydantic_model.__name__
    append_this = f"Respond with final answer using a single instance of the {model_name_str} output format and only the {model_name_str} output format."

    # Append the string
    prompt += append_this

    logging.debug(f"Final prompt: {prompt}")

    # Generate the response using the agent
    result = generic_agent.generate_response(prompt, system_instructions)

    logging.debug(f"Generated response: {result}")

    # Replace the datanode in nodes.json
    logging.debug(f"Calling edit_datanode_in_nodes with node_id: {node_id}, datanode: {result}")
    edit_datanode_in_nodes(node_id=node_id, datanode=result)

    logging.debug("replace_datanode_in_nodes executed successfully.")

    return result

__all__ = [
    "generate_datanode_from_model_with_tools",
    "edit_datanode_from_model_with_tools",
    "replace_datanode_from_model_with_tools"
]
