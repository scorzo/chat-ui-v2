import logging
from typing import Optional, Type, Dict, Any, Tuple
from langchain.pydantic_v1 import BaseModel, Field
from langchain.tools import BaseTool
from langchain.callbacks.manager import CallbackManagerForToolRun, AsyncCallbackManagerForToolRun

from assistant_module.tools.datanode_package.datanode import replace_datanode_from_model_with_tools
from assistant_module.tools.model_tools.bills_management_models import FinanceManagement
from assistant_module.tools.google_sheets.google_sheets import ReadSheetTool
import asyncio

class FinanceManagementParams(BaseModel):
    spreadsheet_id: str = Field(description="ID of the Google Sheet to read")
    range: str = Field(description="Range of cells to read from the Google Sheet")

class FinanceManagementTool(BaseTool):
    name = "finance_management_tool"
    description = "This tool reads a specified range from a Google Sheet and outputs the information into a FinanceManagement Pydantic model format."
    args_schema: Type[BaseModel] = FinanceManagementParams

    def _run(
            self, spreadsheet_id: str, range: str, run_manager: Optional[CallbackManagerForToolRun] = None
    ) -> Tuple[Dict[str, Any], int]:
        """Use the tool."""
        finance_data = self.read_finance_data(spreadsheet_id, range)
        # Directly return finance_data as a dictionary
        try:
            logging.debug(f"Serialized finance data: {finance_data}")
            return finance_data, 200
        except Exception as e:
            logging.error(f"Serialization error: {e}")
            logging.error(f"FinanceManagement type: {type(finance_data)}")
            logging.error(f"FinanceManagement content: {finance_data}")
            raise

    async def _arun(
            self, spreadsheet_id: str, range: str, run_manager: Optional[AsyncCallbackManagerForToolRun] = None
    ) -> Tuple[Dict[str, Any], int]:
        """Use the tool asynchronously."""
        return await asyncio.to_thread(self.read_finance_data, spreadsheet_id, range)

    def read_finance_data(self, spreadsheet_id: str, range: str) -> Dict[str, Any]:
        """
        Read the Google Sheet data and populate the Pydantic model using ReadSheetTool.
        """
        try:
            read_sheet_tool = ReadSheetTool()
            sheet_data_json = read_sheet_tool._run(spreadsheet_id=spreadsheet_id, range=range)

            prompt = f"""
            Process the following JSON data from a Google Sheet:
            {sheet_data_json}
            and convert it into a FinanceManagement Pydantic model format.
            """

            system_instructions = """
            You are an AI assistant designed to convert financial data from Google Sheets into a structured FinanceManagement Pydantic model.
            Respond with the data in a JSON object format without enclosing it in a string. 
            Only provide the JSON object.
            """

            finance_data = replace_datanode_from_model_with_tools(
                prompt=prompt,
                model_name="gpt-4o",
                pydantic_model=FinanceManagement,
                #tools=[],
                node_id="RmluYW5jZU5vZGUx",  # Node ID not used in this context
                node_type="FinanceManagementModalContent",  # Node type not used in this context
                system_instructions=system_instructions
            )

            return finance_data

        except Exception as e:
            logging.error(f"An error occurred: {str(e)}")
            return {
                "budget_id": "",
                "description": f"Data could not be retrieved due to an error: {e}"
            }

# Example usage
if __name__ == "__main__":
    tool = FinanceManagementTool()
    result, status = tool._run(spreadsheet_id='your_spreadsheet_id_here', range='Sheet1!A1:D10')
    print("Finance Data:", result)
