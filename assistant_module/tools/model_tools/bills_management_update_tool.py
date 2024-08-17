from langchain.pydantic_v1 import BaseModel, Field
from langchain.tools import BaseTool
from typing import Optional, Type
from langchain.callbacks.manager import (
    AsyncCallbackManagerForToolRun,
    CallbackManagerForToolRun,
)
from assistant_module.tools.datanode_package.datanode import edit_datanode_from_model_with_tools
from assistant_module.tools.model_tools.bills_management_models import FinanceManagement
import os
from datetime import datetime
import pytz
import asyncio
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

class EditFinanceManagementParams(BaseModel):
    prompt: str = Field(description="The prompt to send to the language model for generating the datanode.")
    node_id: str = Field(description="The ID of the target node to be edited.")

class EditFinanceManagementTool(BaseTool):
    name = "edit_finance_management_tool"
    description = "This tool edits an existing finance management list datanode based on the user's prompt and updates it in the nodes.json file. Use this tool to add, remove and modify existing finance management node content."
    args_schema: Type[BaseModel] = EditFinanceManagementParams

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
        You are an AI assistant designed to make updates to the existing finance management datanode based on user instructions and return the result as a structured FinanceManagement Pydantic model.  If the user instructions do not apply or do not make sense, return the original node data unmodified in Pydantic model format.
        
        Complete modification requests in a single pass rather than using multiple steps.
        
        Respond with the data as a JSON object based on the FinanceManagement Pydantic model format.
        Do not enclose the JSON object in a string or any other text. 
        Only provide the JSON object itself.
        """

        result = edit_datanode_from_model_with_tools(
            prompt=prompt,
            model_name="gpt-4o",
            pydantic_model=FinanceManagement,
            # tools=[],  # Add appropriate tools if needed
            node_id=node_id,
            node_type="FinanceManagementModalContent",
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
    tool = EditFinanceManagementTool()
    result = tool._run(prompt="Update the finance management details for the user", node_id="target_node_id")
    print("Edited datanode:", result)
