from langchain.pydantic_v1 import BaseModel, Field
from langchain.tools import BaseTool
from typing import Optional, Type
from langchain.callbacks.manager import (
    AsyncCallbackManagerForToolRun,
    CallbackManagerForToolRun,
)
from assistant_module.tools.datanode_package.datanode import edit_datanode_from_model_with_tools
from datetime import datetime
import pytz
import os
import asyncio
import json

import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_current_time_and_timezone(timezone_config):
    if not timezone_config:
        raise ValueError("Timezone configuration is not defined.")

    try:
        my_timezone = pytz.timezone(timezone_config)
    except pytz.UnknownTimeZoneError:
        raise ValueError(f"The provided timezone '{timezone_config}' is not recognized.")

    my_time = datetime.now(my_timezone).strftime('%Y-%m-%d')
    return my_time, my_timezone

class SpecialDate(BaseModel):
    event_type: str = Field(description="Type of the event (e.g., Birthday, Anniversary)")
    event_name: str = Field(description="Name of the event")
    date: str = Field(description="Date of the event in ISO 8601 format")
    notes: Optional[str] = Field(description="Additional notes for the event")

class SpecialDates(BaseModel):
    name: str = Field(description="Name of the special dates list")
    description: str = Field(description="Description of the special dates list")
    dates: list[SpecialDate] = Field(description="List of special dates")

class EditSpecialDatesParams(BaseModel):
    prompt: str = Field(description="The prompt to send to the language model for generating the datanode.")
    node_id: str = Field(description="The ID of the target node to be edited.")

class EditSpecialDatesTool(BaseTool):
    name = "edit_special_dates_tool"
    description = "This tool edits an existing special dates datanode based on the user's prompt and updates it in the nodes.json file. Use this tool to add, remove, and edit special dates such as anniversaries, birthdays, holidays and other important family related calendar events."
    args_schema: Type[BaseModel] = EditSpecialDatesParams

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
        Edits a datanode using the provided prompt and updates it in the nodes.json file.
        """
        my_time, my_timezone = get_current_time_and_timezone(os.environ['TIMEZONE'])
        system_instructions = f"""
        You are a helpful assistant. It's {my_time} in the {my_timezone} timezone.
        Respond with the data as a JSON object based on the FinanceManagement Pydantic model format.
        Do not enclose the JSON object in a string or any other text. 
        Only provide the JSON object itself.
        """

        prompt += f"""
        Do not modify node name and description fields.
        """

        logger.info("Starting edit_datanode with prompt: %s and node_id: %s", prompt, node_id)

        result = edit_datanode_from_model_with_tools(
            prompt=prompt,
            model_name="gpt-4o",
            pydantic_model=SpecialDates,
            #tools=[],  # Add appropriate tools if needed
            node_id=node_id,
            node_type="SpecialDatesModalContent",
            system_instructions=system_instructions
        )

        # Check if the result is an object and return it as a JSON-formatted string
        if isinstance(result, dict):  # Assuming the object is a dictionary
            return json.dumps(result, indent=4)
        elif hasattr(result, '__dict__'):  # For objects that can be represented as dictionaries
            return json.dumps(result.__dict__, indent=4)
        else:
            return result

# Example usage
if __name__ == "__main__":
    tool = EditSpecialDatesTool()
    result = tool._run(prompt="Update the special dates for the family events", node_id="target_node_id")
    print("Edited datanode:", result)
