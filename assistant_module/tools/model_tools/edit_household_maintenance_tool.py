from langchain.pydantic_v1 import BaseModel, Field
from langchain.tools import BaseTool
from typing import Optional, Type
from langchain.callbacks.manager import (
    AsyncCallbackManagerForToolRun,
    CallbackManagerForToolRun,
)
from assistant_module.tools.datanode_package.datanode import edit_datanode_from_model_with_tools
from .household_maintenance_models import HouseholdMaintenance
import os
from datetime import datetime
import pytz
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

class EditHouseholdMaintenanceParams(BaseModel):
    prompt: str = Field(description="The prompt to send to the language model for generating the datanode.")
    node_id: str = Field(description="The ID of the target node to be edited.")

class EditHouseholdMaintenanceTool(BaseTool):
    name = "edit_household_maintenance_tool"
    description = "This tool edits an existing household maintenance list datanode based on the user's prompt and updates it in the nodes.json file. Use this tool to add tasks to or remove tasks from existing household maintenance lists."
    args_schema: Type[BaseModel] = EditHouseholdMaintenanceParams

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
        """

        return edit_datanode_from_model_with_tools(
            prompt=prompt,
            model_name="gpt-4o",
            pydantic_model=HouseholdMaintenance,
            #tools=[],  # Add appropriate tools if needed
            node_id=node_id,
            node_type="HouseholdMaintenanceModalContent",
            system_instructions=system_instructions
        )

# Example usage
if __name__ == "__main__":
    tool = EditHouseholdMaintenanceTool()
    result = tool._run(prompt="Update the maintenance schedule for the house", node_id="target_node_id")
    print("Edited datanode:", result)
