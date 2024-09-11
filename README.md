# A talk-to-your data assistant

## Overview:
Closed source model-based chatbot that can be used to talk to your data.  

## Setup

Install Required Libraries:

    pip install -r requirements.txt

Install React libs 

    cd chat-app/
    npm install

## Backend Usage
Backend script can be run in either CLI or API mode.

### CLI Mode
To run the script in CLI mode, use the following command:

    python api/chat_api.py --mode cli

In CLI mode, the script will execute the functionality defined in the main() function.

### API Mode
To run the script as a web API, you can use the following command:

    python api/chat_api.py --mode api

### List API Endpoints Mode
To run the script as a web API, you can use the following command:

    python api/chat_api.py --mode list_routes

Alternatively, since API mode is the default, you can also start the API by simply running:

    python api/chat_api.py

When running in API mode, the Flask server will start, and the API will be accessible at the default address:

    http://127.0.0.1:5000/

Visit this URL in your web browser or use a tool like curl or Postman to interact with the API.

    curl -X POST http://127.0.0.1:5000/process_request \
     -H "Content-Type: application/json" \
     -d '{
           "user_input": "What is the capital of France?",
           "llm_instructions": "Please provide detailed information",
           "assistant_id": "asst_1Jta4nfQ9g9PHPTNSHAu213g",
           "file_ids": ["file-aWJB3NOKHiJnfKgTyKrWgjo8"],
           "thread_lookup_id": "129"
         }'

    # create new assistant and new thread with no files
    curl -X POST http://127.0.0.1:5000/process_request \
     -H "Content-Type: application/json" \
     -d '{
           "user_input": "What is the capital of France?",
           "llm_instructions": "Please provide detailed information"
         }'

    curl -X POST http://127.0.0.1:5000/get_file_ids \
     -H "Content-Type: application/json" \
     -d '{"upload_files": ["./character_Alexandra_Hamilton_2024_04_17_v1.json"]}'

### Chat App (Frontend)

To run a React browser-based app on port 3000:

    cd chat-app
    npm start

The script interactively prompts for event scheduling commands (e.g., "Schedule a meeting with John on January 10 at 10 am") and processes these requests to add events to your Google Calendar.  The script considers information gathered from a personalized profile to provide more personalized responses.

Note: Ensure that you have the necessary permissions and correct calendar ID before running the script.

### Docker Compose

Navigate to the root directory (where the docker-compose.yml file is located).

Run Docker Compose to build and start the front-end and back-end containers:

    docker-compose up --build