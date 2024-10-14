from langchain.pydantic_v1 import BaseModel, Field
from langchain.tools import BaseTool
from typing import Optional, Type
import traceback
import json
import asyncio

from langchain.callbacks.manager import (
    AsyncCallbackManagerForToolRun,
    CallbackManagerForToolRun,
)


from api.assistant_module.google_service import get_google_service

class ReadSheetInput(BaseModel):
    spreadsheet_id: str = Field(description="ID of the Google Sheet to read")
    range: str = Field(description="Range of cells to read from the Google Sheet")

class ReadSheetTool(BaseTool):
    name = "read_sheet"
    description = "Read a specified range from a Google Sheet and return a JSON formatted version of the document"
    args_schema: Type[BaseModel] = ReadSheetInput

    def _run(
            self, spreadsheet_id: str, range: str, run_manager: Optional[CallbackManagerForToolRun] = None
    ) -> str:
        """Use the tool."""
        return self.read_sheet(spreadsheet_id, range)

    async def _arun(
            self, spreadsheet_id: str, range: str, run_manager: Optional[AsyncCallbackManagerForToolRun] = None
    ) -> str:
        """Use the tool asynchronously."""
        return await asyncio.to_thread(self.read_sheet, spreadsheet_id, range)

    def read_sheet(self, spreadsheet_id: str, range: str) -> str:
        try:
            service = get_google_service('sheets','v4')
            sheet = service.spreadsheets()
            result = sheet.values().get(spreadsheetId=spreadsheet_id, range=range).execute()
            values = result.get('values', [])

            if not values:
                return json.dumps({'error': 'No data found.'})

            return json.dumps(values)

        except Exception as e:
            print(f"An error occurred: {str(e)}")
            traceback.print_exc()
            return json.dumps({'error': str(e)})

# Example usage
if __name__ == "__main__":
    tool = ReadSheetTool()
    print(tool._run(spreadsheet_id='your_spreadsheet_id_here', range='Sheet1!A1:D10'))
