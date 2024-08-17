from langchain.pydantic_v1 import BaseModel, Field
from langchain.tools import BaseTool
from typing import Optional, Type
from langchain.callbacks.manager import (
    AsyncCallbackManagerForToolRun,
    CallbackManagerForToolRun,
)
from datetime import datetime
import pytz
import os
from assistant_module.tools.datanode_package.datanode import generate_datanode_from_model_with_tools
from assistant_module.tools.datanode_package.load_nodes_tool import GetAllNodesTool
from .daily_update_models import DailyUpdate
from assistant_module.tools.misc_tools.web_search_tool import WebSearchTool
from assistant_module.tools.calendar_package.list_calendar_events import ListEventsTool
import asyncio

def get_current_time_and_timezone(timezone_config):
    if not timezone_config:
        raise ValueError("Timezone configuration is not defined.")

    try:
        my_timezone = pytz.timezone(timezone_config)
    except pytz.UnknownTimeZoneError:
        raise ValueError(f"The provided timezone '{timezone_config}' is not recognized.")

    my_time = datetime.now(my_timezone).strftime('%Y-%m-%d')
    return my_time, my_timezone

DEFAULT_PROMPT = """
Based on my personal information, create a personalized daily update for me that includes:
- weather report (actual weather, forecast, and alerts)
- my schedule today (get this from the calendar tool)
- household task suggestions
- finance updates (bills coming due, payday alerts, stock market suggestions)
- daily article, movie, podcast suggestions
- birthday, anniversary reminders 
- inspirational quote
- daily learning path suggestions
- menu ideas 
Ground everything in reality and do not make up appointments, dates, etc.
Always use the web search tool to find articles, movies, podcasts, and financial insights that will help you achieve your goals.

Any time a node is referenced in the response display the node name as a link in the following format: <a href="#" onclick="handleNavigateToNode('$${{nodeId}}')">$${{nodeName}}</a>

"""

DEFAULT_PARENT_NODE_ID = "SG91c2Vob2xkTm9kZPqr"

class DailyUpdateParams(BaseModel):
    prompt: Optional[str] = Field(default=DEFAULT_PROMPT, description="The prompt to send to the language model for generating the datanode.")
    parent_node_id: Optional[str] = Field(default=DEFAULT_PARENT_NODE_ID, description="The ID of the parent target node that contains the children array where the datanode will be added.")

class DailyUpdateTool(BaseTool):
    name = "daily_update_tool"
    description = "This tool generates a new daily update datanode based on the user's prompt and adds it under the specified parent node in the nodes.json file."
    args_schema: Type[BaseModel] = DailyUpdateParams

    def _run(
            self, prompt: Optional[str] = DEFAULT_PROMPT, parent_node_id: Optional[str] = DEFAULT_PARENT_NODE_ID, run_manager: Optional[CallbackManagerForToolRun] = None
    ) -> dict:
        """Use the tool."""
        return self.generate_datanode(prompt, parent_node_id)

    async def _arun(
            self, prompt: Optional[str] = DEFAULT_PROMPT, parent_node_id: Optional[str] = DEFAULT_PARENT_NODE_ID, run_manager: Optional[AsyncCallbackManagerForToolRun] = None
    ) -> dict:
        """Use the tool asynchronously."""
        return await asyncio.to_thread(self.generate_datanode, prompt, parent_node_id)

    def generate_datanode(self, prompt: str, parent_node_id: str) -> dict:
        """
        Generates a datanode using the provided prompt and adds it to the children array of the specified node in the nodes.json file.
        """
        my_time, my_timezone = get_current_time_and_timezone(os.environ['TIMEZONE'])
        system_instructions = f"""
        You are a personal AI assistant designed to create daily updates. It's {my_time} in the {my_timezone} timezone.
        
        The daily update should help with upcoming tasks and dates vs. dates and tasks that have passed. 
        
        Respond with the data in a JSON object format without enclosing it in a string. 
        Only provide the JSON object.
        """

        return generate_datanode_from_model_with_tools(
            prompt=prompt,
            model_name="gpt-4o",
            pydantic_model=DailyUpdate,
            tools=[GetAllNodesTool(),WebSearchTool(), ListEventsTool()],  # Add appropriate tools if needed
            node_id=parent_node_id,
            node_type="DailyUpdateModalContent",
            system_instructions=system_instructions
        )

# Example usage
if __name__ == "__main__":
    tool = DailyUpdateTool()
    result = tool._run()
    print("Generated datanode:", result)
