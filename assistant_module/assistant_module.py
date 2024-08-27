from openai.types.beta import Assistant, Thread
from assistant_module.thread_store import store_thread, check_if_thread_exists, get_all_threads
import os
import asyncio
import json
import logging
from openai import AsyncOpenAI, OpenAI
from openai.types.beta.threads import Run, RequiredActionFunctionToolCall
from openai.types.beta.assistant_stream_event import (
    ThreadRunRequiresAction, ThreadMessageDelta, ThreadRunCompleted,
    ThreadRunFailed, ThreadRunCancelling, ThreadRunCancelled, ThreadRunExpired, ThreadRunStepFailed,
    ThreadRunStepCancelled
)

api_key = os.environ['OPENAI_API_KEY']
async_client = AsyncOpenAI(api_key=api_key)

list_tools=[
    # {"type": "function",
    #  "function":{
    #      "name": "get_nodes",
    #      "description": "Return a data structure containing comprehensive details related to the digital twin schedule, including life events, activities, dates, values, and associated information.",
    #      "parameters": {
    #          "type": "object",
    #          "properties": {}
    #      }
    #  }
    #  },
    {
        "type": "function",
        "function": {
            "name": "get_pruned_nodes",
            "description": "Return a data structure containing comprehensive details related to the digital twin schedule, including life events, activities, dates, values, and associated information that has been pruned according to the passed-in prompt.",
            "parameters": {
                "type": "object",
                "properties": {
                    "prompt": {
                        "type": "string",
                        "description": "The prompt to base the pruning of the JSON node structure upon."
                    }
                },
                "required": ["prompt"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "list_events",
            "description": "List events from Google Calendar within a specified time range and timezone",
            "parameters": {
                "type": "object",
                "properties": {
                    "calendar_id": {"type": "string", "default": "primary", "description": "ID of the calendar to list events from"},
                    "max_results": {"type": "integer", "default": 10, "description": "Maximum number of events to list"},
                    "start_time": {"type": "string", "default": None, "description": "Start time in ISO 8601 format"},
                    "end_time": {"type": "string", "default": None, "description": "End time in ISO 8601 format"},
                    "timezone": {"type": "string", "default": "UTC", "description": "Timezone for the events"}
                },
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "add_calendar_event",
            "description": "Add an event to Google Calendar",
            "parameters": {
                "type": "object",
                "properties": {
                    "event_summary": {"type": "string", "description": "Summary of the event"},
                    "event_location": {"type": "string", "description": "Location of the event"},
                    "event_description": {"type": "string", "description": "Description of the event"},
                    "start_time": {"type": "string", "description": "Start time of the event in ISO 8601 format"},
                    "end_time": {"type": "string", "description": "End time of the event in ISO 8601 format"},
                    "start_time_zone": {"type": "string", "description": "Time zone of the start time"},
                    "end_time_zone": {"type": "string", "description": "Time zone of the end time"}
                },
                "required": ["event_summary", "event_location", "event_description", "start_time", "end_time", "start_time_zone", "end_time_zone"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "update_or_cancel_event",
            "description": "Update or cancel an event in Google Calendar",
            "parameters": {
                "type": "object",
                "properties": {
                    "calendar_id": {"type": "string", "default": "primary", "description": "ID of the calendar"},
                    "event_id": {"type": "string", "description": "ID of the event to update or cancel"},
                    "update_body": {"type": "object", "description": "Body of the event update"}
                },
                "required": ["calendar_id", "event_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "free_busy",
            "description": "Check free/busy times from Google Calendar within a specified time range and timezone",
            "parameters": {
                "type": "object",
                "properties": {
                    "calendar_id": {"type": "string", "default": "primary", "description": "ID of the calendar to check for free/busy times"},
                    "start_time": {"type": "string", "default": None, "description": "Start time in ISO 8601 format"},
                    "end_time": {"type": "string", "default": None, "description": "End time in ISO 8601 format"},
                    "timezone": {"type": "string", "default": "UTC", "description": "Timezone for the query"}
                },
                "required": []
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "household_maintenance_tool",
            "description": "This tool generates a new household maintenance datanode based on the user's prompt and adds it under the Household Maintenance node in the nodes.json file. Use this tool only for creating new datanodes. For modifying existing datanodes, including adding or removing tasks, use the edit_household_maintenance_tool.",
            "parameters": {
                "type": "object",
                "properties": {
                    "prompt": {"type": "string", "description": "The prompt to send to the language model for generating the datanode."},
                    "parent_node_id": {"type": "string", "description": "The node_id of the Household Maintenance datanode retrieved using the get_pruned_nodes function.  It contains the children[] array within which the new datanode will be added."}
                },
                "required": ["prompt", "parent_node_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "edit_household_maintenance_tool",
            "description": "This tool edits an existing household maintenance list datanode based on the user's prompt and updates it in the nodes.json file. Use this tool to add tasks to or remove tasks from existing household maintenance lists.",
            "parameters": {
                "type": "object",
                "properties": {
                    "prompt": {"type": "string", "description": "The prompt to send to the language model for updating the datanode."},
                    "node_id": {"type": "string", "description": "The ID of the target datanode to be edited."}
                },
                "required": ["prompt", "node_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "edit_finance_management_tool",
            "description": "This tool edits an existing finance management datanode based on the user's prompt and updates it in the nodes.json file. Use this tool to add or remove items from the finance management node.",
            "parameters": {
                "type": "object",
                "properties": {
                    "prompt": {"type": "string", "description": "The prompt to send to the language model for updating the datanode."},
                    "node_id": {"type": "string", "description": "The ID of the target datanode to be edited."}
                },
                "required": ["prompt", "node_id"]
            }
        }
     },
    {
        "type": "function",
        "function": {
            "name": "meal_planning_tool",
            "description": "This tool generates a daily meal plan for the family based on the user's prompt and adds it under the specified parent node in the nodes.json file.",
            "parameters": {
                "type": "object",
                "properties": {
                    "prompt": {"type": "string", "description": "The prompt to send to the language model for generating the daily menu datanode."},
                    "parent_node_id": {"type": "string", "description": "The ID of the parent target node that contains the children array where the datanode will be added."}
                },
                "required": ["prompt", "parent_node_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "itinerary_tool",
            "description": "This tool generates a new itinerary datanode based on the user's prompt and adds it under the Family Outings and Vacations node in the nodes.json file. Use this tool only for creating itinerary new datanodes. For modifying existing itinerary datanodes, use the edit_itinerary_tool.",
            "parameters": {
                "type": "object",
                "properties": {
                    "prompt": {"type": "string", "description": "The prompt to send to the language model for generating the datanode."},
                    "parent_node_id": {"type": "string", "description": "The node_id of the Family Outings and Vacations datanode retrieved using the get_pruned_nodes function.  It contains the children[] array within which the new datanode will be added."}
                },
                "required": ["prompt", "parent_node_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "edit_itinerary_tool",
            "description": "This tool edits an existing itinerary list datanode based on the user's prompt and updates it in the nodes.json file. Use this tool to add, remove, and edit destinations, activities, transportation and/or other details including transportation on existing itinerary nodes.",
            "parameters": {
                "type": "object",
                "properties": {
                    "prompt": {"type": "string", "description": "The prompt to send to the language model for updating the datanode."},
                    "node_id": {"type": "string", "description": "The ID of the target datanode to be edited."}
                },
                "required": ["prompt", "node_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "daily_update_tool",
            "description": "Creates a new daily update and adds it to the nodes.json file",
            "parameters": {
                "type": "object",
                "properties": {}
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "special_dates_tool",
            "description": "This tool edits an existing special dates datanode based on the user's prompt and updates it in the nodes.json file. Use this tool to add, remove, and edit special dates such as anniversaries, birthdays, holidays, and other important calendar events.",
            "parameters": {
                "type": "object",
                "properties": {
                    "prompt": {"type": "string", "description": "The prompt to send to the language model for generating the datanode."},
                    "node_id": {"type": "string", "description": "The ID of the target node to be edited."}
                },
                "required": ["prompt", "node_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "edit_goals_coaching_tool",
            "description": "This tool edits an existing goals/coaching entry based on the user's prompt and updates it in the corresponding data structure. Use this tool to add, remove, and edit goals, milestones, progress, and coaching notes on existing nodes.",
            "parameters": {
                "type": "object",
                "properties": {
                    "prompt": {
                        "type": "string",
                        "description": "The prompt to send to the language model for updating the goals/coaching datanode."
                    },
                    "node_id": {
                        "type": "string",
                        "description": "The ID of the target datanode to be edited."
                    }
                },
                "required": ["prompt", "node_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "edit_work_connections_tool",
            "description": "This tool edits an existing work connections entry based on the user's prompt and updates it in the corresponding data structure. Use this tool to add, remove, and edit contacts, roles, notes, and keywords on existing nodes.",
            "parameters": {
                "type": "object",
                "properties": {
                    "prompt": {
                        "type": "string",
                        "description": "The prompt to send to the language model for updating the work connections datanode."
                    },
                    "node_id": {
                        "type": "string",
                        "description": "The ID of the target datanode to be edited."
                    }
                },
                "required": ["prompt", "node_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "edit_career_development_tool",
            "description": "This tool edits an existing career development entry based on the user's prompt and updates it in the corresponding data structure. Use this tool to add, remove, and edit skills, experiences, and educational background on existing nodes.",
            "parameters": {
                "type": "object",
                "properties": {
                    "prompt": {
                        "type": "string",
                        "description": "The prompt to send to the language model for updating the career development datanode."
                    },
                    "node_id": {
                        "type": "string",
                        "description": "The ID of the target datanode to be edited."
                    }
                },
                "required": ["prompt", "node_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "edit_career_goals_coaching_tool",
            "description": "This tool edits an existing career goals and coaching entry based on the user's prompt and updates it in the corresponding data structure. Use this tool to add, remove, and edit career goals, progress tracking, and coaching resources on existing nodes.",
            "parameters": {
                "type": "object",
                "properties": {
                    "prompt": {
                        "type": "string",
                        "description": "The prompt to send to the language model for updating the career goals and coaching datanode."
                    },
                    "node_id": {
                        "type": "string",
                        "description": "The ID of the target datanode to be edited."
                    }
                },
                "required": ["prompt", "node_id"]
            }
        }
    }




]

from assistant_module.tools.calendar_package.list_calendar_events import ListEventsTool
from assistant_module.tools.calendar_package.add_calendar_events import AddCalendarEventTool
from assistant_module.tools.calendar_package.update_or_cancel_calendar_events import UpdateOrCancelEventTool
from assistant_module.tools.calendar_package.free_busy import FreeBusyTool
from assistant_module.tools.model_tools.household_maintenance_tool import HouseholdMaintenanceTool
from assistant_module.tools.model_tools.edit_household_maintenance_tool import EditHouseholdMaintenanceTool
from assistant_module.tools.model_tools.daily_update_tool import DailyUpdateTool
from assistant_module.tools.model_tools.bills_management_update_tool import EditFinanceManagementTool
from assistant_module.tools.model_tools.itinerary_tool import ItineraryTool
from assistant_module.tools.model_tools.edit_itinerary_tool import EditItineraryTool
from assistant_module.time_module.time_utils import get_current_time_and_timezone
#from assistant_module.tools.datanode_package.load_nodes_tool import GetAllNodesTool
from assistant_module.tools.datanode_package.prune_node_tool import PruneNodeTool
from assistant_module.tools.model_tools.meal_planning_tool import MealPlanningTool
from assistant_module.tools.model_tools.special_dates_tool import EditSpecialDatesTool
from assistant_module.tools.model_tools.goals_coaching_tool import EditGoalsCoachingTool
from assistant_module.tools.model_tools.work_connections_tool import EditWorkConnectionsTool
from assistant_module.tools.model_tools.career_development_tool import EditCareerDevelopmentTool
from assistant_module.tools.model_tools.career_goals_coaching_tool import EditCareerGoalsCoachingTool



# define dispatch table
function_dispatch_table = {
    # "get_nodes": lambda **kwargs: GetAllNodesTool()._arun(**kwargs),
    "get_pruned_nodes": lambda **kwargs: PruneNodeTool()._arun(**kwargs),
    "list_events": lambda **kwargs: ListEventsTool()._arun(**kwargs),
    "add_calendar_event": lambda **kwargs: AddCalendarEventTool()._arun(**kwargs),
    "update_or_cancel_event": lambda **kwargs: UpdateOrCancelEventTool()._arun(**kwargs),
    "free_busy": lambda **kwargs: FreeBusyTool()._arun(**kwargs),
    "household_maintenance_tool": lambda **kwargs: HouseholdMaintenanceTool()._arun(**kwargs),
    "edit_household_maintenance_tool": lambda **kwargs: EditHouseholdMaintenanceTool()._arun(**kwargs),
    "itinerary_tool": lambda **kwargs: ItineraryTool()._arun(**kwargs),
    "edit_itinerary_tool": lambda **kwargs: EditItineraryTool()._arun(**kwargs),
    "daily_update_tool": lambda **kwargs: DailyUpdateTool()._arun(**kwargs),
    "edit_finance_management_tool": lambda **kwargs: EditFinanceManagementTool()._arun(**kwargs),
    "meal_planning_tool": lambda **kwargs: MealPlanningTool()._arun(**kwargs),
    "special_dates_tool": lambda **kwargs: EditSpecialDatesTool()._arun(**kwargs),
    "edit_goals_coaching_tool": lambda **kwargs: EditGoalsCoachingTool()._arun(**kwargs),
    "edit_work_connections_tool": lambda **kwargs: EditWorkConnectionsTool()._arun(**kwargs),
    "edit_career_development_tool": lambda **kwargs: EditCareerDevelopmentTool()._arun(**kwargs),
    "edit_career_goals_coaching_tool": lambda **kwargs: EditCareerGoalsCoachingTool()._arun(**kwarg)
}


async def retrieve_or_create_assistant(assistant_id, llm_instructions, list_tools=[]):
    # only upload files if it's a new assistant

    if assistant_id:
        print(f"create_or_retrieve_assistant: retrieving assistant with id: {assistant_id}")
        return await async_client.beta.assistants.retrieve(assistant_id)
    else:
        # print(f"create_or_retrieve_assistant: creating assistant with id: {assistant_id} and llm_instructions: {llm_instructions}")
        print(f"create_or_retrieve_assistant: creating assistant")
        return await async_client.beta.assistants.create(
            name="ParallelFunction",
            instructions=llm_instructions,
            model=os.environ['MODEL'],
            tools=list_tools
        )

async def create_or_retrieve_thread(lookup_id):
    """
    Creates a new thread or retrieves an existing one based on the lookup ID.
    Adds the user's input as a message to the thread.

    :param lookup_id: The lookup identifier for the thread.
    :return: The lookup_id, thread_info dictionary, and thread object.
    """

    thread_info = check_if_thread_exists(lookup_id)
    thread = None

    if thread_info is None:
        lookup_id, thread_info, thread = await create_new_thread()
        print(f"Created new Lookup ID {lookup_id} with Thread Name '{thread_info['thread_name']}' and Thread ID {thread_info['thread_id']}")
    else:
        thread = await retrieve_existing_thread(thread_info['thread_id'])
        print(f"Using existing Lookup ID {lookup_id} with Thread Name '{thread_info['thread_name']}' and Thread ID {thread_info['thread_id']}")

    return lookup_id, thread_info, thread


async def create_new_thread():
    try:
        thread = await async_client.beta.threads.create()
        lookup_id, thread_info = store_thread(None, thread.id)  # Store and get back the lookup_id and thread_info
        return lookup_id, thread_info, thread
    except Exception as e:
        print(f"Failed to create new thread: {e}")
        return None, None, None  # Return None for all on failure



async def retrieve_existing_thread(thread_id):

    try:
        return await async_client.beta.threads.retrieve(thread_id)
    except Exception as e:
        print(f"Failed to retrieve existing thread ({thread_id}): {e}")
        return None

async def create_message(thread_id: str, user_input: str, role: str):
    message = await async_client.beta.threads.messages.create(thread_id=thread_id, role=role, content=user_input)
    return message

### with logging - not working

async def handle_function_call(tool_call: RequiredActionFunctionToolCall, run_id: str, thread_id: str):
    if tool_call.type != "function":
        return None, None
    function = tool_call.function
    function_name = function.name
    tool_call_id = tool_call.id

    def truncate_argument(arg):
        return arg[:20] + "..." if isinstance(arg, str) and len(arg) > 20 else arg

    truncated_args = {}
    if isinstance(function.arguments, str):
        try:
            arguments_dict = json.loads(function.arguments)
            truncated_args = {k: truncate_argument(str(v)) for k, v in arguments_dict.items()}
        except json.JSONDecodeError:
            truncated_args = function.arguments[:20] + "..." if len(function.arguments) > 20 else function.arguments
    else:
        truncated_args = function.arguments[:20] + "..." if len(function.arguments) > 20 else function.arguments

    log_data = {
        "run_id": run_id,
        "thread_id": thread_id,
        "tool_call_id": tool_call_id,
        "function_name": function_name,
        "function_args": truncated_args,
        "status": "start"
    }

    print(json.dumps(log_data))


    try:
        function_args = json.loads(function.arguments)
    except json.JSONDecodeError as e:
        logging.error(f"JSONDecodeError: {e.msg} at line {e.lineno} column {e.colno} (char {e.pos})")

    try:
        function_result = await function_dispatch_table[function_name](**function_args)
        log_data["status"] = "success"
    except Exception as e:
        function_result = str(e)
        log_data["status"] = "error"
        log_data["error"] = str(e)

    log_data["result"] = function_result[:25] + "..." if isinstance(function_result, str) and len(function_result) > 25 else function_result
    print(json.dumps(log_data))

    return tool_call_id, function_result

async def handle_function_calls(run_obj: Run, thread_id: str):
    run_obj_id = run_obj.id
    required_action = run_obj.required_action

    if required_action.type != "submit_tool_outputs":
        return {}

    tool_calls = required_action.submit_tool_outputs.tool_calls

    for tool_call in tool_calls:
        if tool_call.type == "function":
            function_name = tool_call.function.name
            log_data = {
                "run_id": run_obj_id,
                "thread_id": thread_id,
                "function_name": function_name,
                "status": "queued"
            }
            print(json.dumps(log_data))

    results = await asyncio.gather(
        *(handle_function_call(tool_call, run_obj_id, thread_id) for tool_call in tool_calls)
    )
    return {tool_id: result for tool_id, result in results if tool_id is not None}

async def submit_tool_outputs(thread_id: str, run_id: str, function_ids_to_result_map):
    tool_outputs = [{"tool_call_id": tool_id, "output": result if result is not None else ""} for tool_id, result in function_ids_to_result_map.items()]

    truncated_tool_outputs = [
        {
            "tool_call_id": output["tool_call_id"],
            "output": output["output"][:25] + "..." if isinstance(output["output"], str) and len(output["output"]) > 25 else output["output"]
        }
        for output in tool_outputs
    ]


    log_data = {
        "run_id": run_id,
        "thread_id": thread_id,
        "status": "submitting_tool_outputs",
        "tool_outputs": truncated_tool_outputs
    }
    print(json.dumps(log_data))

    run = await async_client.beta.threads.runs.submit_tool_outputs(thread_id=thread_id, run_id=run_id, tool_outputs=tool_outputs, stream=True)
    return run

async def process_event(event, thread):
    run_obj = event.data
    run_obj_id = run_obj.id
    thread_id = thread.id

    if isinstance(event, ThreadMessageDelta):
        log_data = {
            "run_id": run_obj_id,
            "thread_id": thread_id,
            "status": "message_delta"
        }
        # print(json.dumps(log_data))

        data = event.data.delta.content
        for text in data:
            yield text.text.value

    elif isinstance(event, ThreadRunRequiresAction):
        log_data = {
            "run_id": run_obj_id,
            "thread_id": thread_id,
            "status": "requires_action"
        }
        print(json.dumps(log_data))

        function_ids_to_result_map = await handle_function_calls(run_obj, thread_id)

        tool_output_run = await submit_tool_outputs(thread_id, run_obj.id, function_ids_to_result_map)

        async for token in chat_with_assistant_event_processing(tool_output_run, thread):
            yield token

    elif isinstance(event, ThreadRunCompleted):
        log_data = {
            "run_id": run_obj_id,
            "thread_id": thread_id,
            "status": "completed"
        }
        print(json.dumps(log_data))

    elif any(isinstance(event, cls) for cls in [ThreadRunFailed, ThreadRunCancelling, ThreadRunCancelled,
                                                ThreadRunExpired, ThreadRunStepFailed, ThreadRunStepCancelled]):
        log_data = {
            "run_id": run_obj_id,
            "thread_id": thread_id,
            "status": "failed"
        }
        print(json.dumps(log_data))

    else:
        log_data = {
            "run_id": run_obj_id,
            "thread_id": thread_id,
            "status": "in_progress"
        }
        # print(json.dumps(log_data))

async def chat_with_assistant_event_processing(run, thread):
    async for event in run:
        async for token in process_event(event, thread):
            yield token

async def chat_with_assistant(assistant: Assistant, thread: Thread, user_query: str, role: str):
    await create_message(thread.id, user_query, role)

    stream = await async_client.beta.threads.runs.create(
        thread_id=thread.id,
        assistant_id=assistant.id,
        stream=True
    )

    async for event in stream:
        async for token in process_event(event, thread):
            yield token

async def generate(user_query: str, lookup_id: str = None, assistant_id: str = None, role: str = 'user', llm_instructions: str = None):
    if llm_instructions is None:
        my_time, my_timezone = get_current_time_and_timezone(os.environ['TIMEZONE'])
        llm_instructions = f"""
        You are Sean Corgi's personal AI assistant. You support Sean's calendar through calendar function calls and access other life details through the get_pruned_nodes function, which provides information in a nodegraph format. Currently, it is {my_time} in the {my_timezone} timezone. Your responsibilities include managing Sean's calendar and schedule, addressing Sean's health and organizational needs, maintaining Sean's social connections, and engaging in casual conversations about Sean's daily experiences.
        
        
        Final output formatting instructions:
        1) When answering questions, progressive disclosure is preferred over verbosity, but always let the user know that there are more details available when doing so.
        2) Any time a node is referenced in the response, display the node name as a node link in the following format: <a href="#" onclick="handleNavigateToNode('{{node_id}}')">{{name}}</a>
        3) Always pair the correct nodeId with the matching NodeName when creating node links.
        4) All calendar events should be displayed in HTML format as follows: <a target="_" href="{{calendar_link}}">{{calendar_link_description}}</a>
        5) Please do not highlight words in output with asterisks.
        6) When presenting schedules, format the output in an informal summary form rather than verbose lists.  The user can always ask for more details if needed.
        
        Instructions for Daily updates:
        1) When returning daily updates, just show a link to the relevant node in the node structure.
        
        Instructions regarding order of steps:
        1) Do not create calendar entries without first asking.
        2) When adding and removing important dates to and from the calendar, prompt the user to also add or remove the dates from "Special Dates" node in the node structure.
        3) When planning an outing, you do not need to ask first before adding the information to the node structure.
        """

    assistant = await retrieve_or_create_assistant(assistant_id, llm_instructions, list_tools)
    lookup_id, thread_info, thread = await create_or_retrieve_thread(lookup_id)
    # receives and iterates over the asynchronous iterable
    async for token in chat_with_assistant(assistant, thread, user_query, role):
        yield token



