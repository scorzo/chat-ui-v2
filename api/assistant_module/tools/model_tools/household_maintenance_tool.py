from langchain.pydantic_v1 import BaseModel, Field
from langchain.tools import BaseTool
from typing import Optional, Type
from langchain.callbacks.manager import (
    AsyncCallbackManagerForToolRun,
    CallbackManagerForToolRun,
)
from api.assistant_module.tools.datanode_package.datanode import generate_datanode_from_model_with_tools
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

class HouseholdMaintenanceParams(BaseModel):
    prompt: str = Field(description="The prompt to send to the language model for generating the datanode.")
    parent_node_id: str = Field(description="The ID of the parent target node that contains the children array where the datanode will be added.")

class HouseholdMaintenanceTool(BaseTool):
    name = "household_maintenance_tool"
    description = "This tool generates a new home maintenance datanode based on the user's prompt and adds it under the Home Maintenance node in the nodes.json file. Use this tool only for creating new datanodes. For modifying existing datanodes, including adding or removing tasks, use the edit_household_maintenance_tool."
    args_schema: Type[BaseModel] = HouseholdMaintenanceParams

    def _run(
            self, prompt: str, parent_node_id: str, run_manager: Optional[CallbackManagerForToolRun] = None
    ) -> dict:
        """Use the tool."""
        return self.generate_datanode(prompt, parent_node_id)

    async def _arun(
            self, prompt: str, parent_node_id: str, run_manager: Optional[AsyncCallbackManagerForToolRun] = None
    ) -> dict:
        """Use the tool asynchronously."""
        return await asyncio.to_thread(self.generate_datanode, prompt, parent_node_id)

    def generate_datanode(self, prompt: str, parent_node_id: str) -> dict:
        """
        Generates a datanode using the provided prompt and adds it to the children array of the specified node in the nodes.json file.
        """
        my_time, my_timezone = get_current_time_and_timezone(os.environ['TIMEZONE'])
        system_instructions = f"""
        You are a personal AI assistant designed to create task lists. It's {my_time} in the {my_timezone} timezone.
        """

        return generate_datanode_from_model_with_tools(
            prompt=prompt,
            model_name="gpt-4o",
            pydantic_model=HouseholdMaintenance,
            tools=[],  # Add appropriate tools if needed
            node_id=parent_node_id,
            node_type="HouseholdMaintenanceModalContent",
            system_instructions=system_instructions
        )

# Example usage
if __name__ == "__main__":
    tool = HouseholdMaintenanceTool()
    result = tool._run(prompt="Create a maintenance schedule for the house", node_id="target_node_id")
    print("Generated datanode:", result)
