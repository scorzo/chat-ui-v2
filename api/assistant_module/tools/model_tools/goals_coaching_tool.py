from langchain.pydantic_v1 import BaseModel, Field
from langchain.tools import BaseTool
from typing import Optional, Type
from langchain.callbacks.manager import (
    AsyncCallbackManagerForToolRun,
    CallbackManagerForToolRun,
)
from api.assistant_module.tools.datanode_package.datanode import edit_datanode_from_model_with_tools
from .goals_coaching_models import GoalsCoaching
import os
from datetime import datetime
import pytz
import asyncio
import logging
import json

def get_current_time_and_timezone(timezone_config):
    if not timezone_config:
        raise ValueError("Timezone configuration is not defined.")

    try:
        my_timezone = pytz.timezone(timezone_config)
    except pytz.UnknownTimeZoneError:
        raise ValueError(f"The provided timezone '{timezone_config}' is not recognized.")

    my_time = datetime.now(my_timezone).strftime('%Y-%m-%d')
    return my_time, my_timezone

class EditGoalsCoachingParams(BaseModel):
    prompt: str = Field(description="The prompt to send to the language model for generating the datanode.")
    node_id: str = Field(description="The ID of the target node to be edited.")

class EditGoalsCoachingTool(BaseTool):
    name = "edit_goals_coaching_tool"
    description = "This tool edits an existing goals/coaching entry based on the user's prompt and updates it in the corresponding data structure. Use this tool to add, remove, and edit goals, milestones, progress, and coaching notes on existing nodes."
    args_schema: Type[BaseModel] = EditGoalsCoachingParams

    def _run(
            self, prompt: str, node_id: str, run_manager: Optional[CallbackManagerForToolRun] = None
    ) -> dict:
        """Use the tool."""
        return self.edit_datanode(prompt, node_id)

    async def _arun(
            self, prompt: str, node_id: str, run_manager: Optional[AsyncCallbackManagerForToolRun] = None
    ) -> dict:
        """Use the tool asynchronously."""
        return await asyncio.to_thread(self.edit_datanode, prompt, node_id)

    def edit_datanode(self, prompt: str, node_id: str) -> dict:
        """
        Edits a datanode using the provided prompt and updates it in the appropriate data structure.
        """
        my_time, my_timezone = get_current_time_and_timezone(os.environ['TIMEZONE'])
        system_instructions = f"""
        You are a helpful assistant. It's {my_time} in the {my_timezone} timezone.
        Respond with the data as a JSON object based on the GoalsCoaching Pydantic model format.
        Do not enclose the JSON object in a string or any other text. 
        Only provide the JSON object itself.
        """

        result = edit_datanode_from_model_with_tools(
            prompt=prompt,
            model_name="gpt-4o",
            pydantic_model=GoalsCoaching,
            #tools=[],  # Add appropriate tools if needed
            node_id=node_id,
            node_type="GoalsCoachingModalContent",
            system_instructions=system_instructions
        )

        # Check if the result is an object and return it as a JSON-formatted string
        if isinstance(result, dict):  # Assuming the object is a dictionary
            logging.info("Result is a dictionary. Converting to JSON string.")
            return json.dumps(result, indent=4)
        elif hasattr(result, '__dict__'):  # For objects that can be represented as dictionaries
            logging.info("Result is an object with __dict__. Converting to JSON string.")
            return json.dumps(result.__dict__, indent=4)
        else:
            logging.warning("Result is neither a dictionary nor an object with __dict__. Returning result as is.")
            return result

# Example usage
if __name__ == "__main__":
    tool = EditGoalsCoachingTool()
    result = tool._run(prompt="Update the goals for the family financial plan", node_id="target_node_id")
    print("Edited datanode:", result)
