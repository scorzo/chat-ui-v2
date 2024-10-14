from langchain.pydantic_v1 import BaseModel, Field
from langchain.tools import BaseTool
from typing import Optional, Type, Dict, Any
import asyncio

from langchain.callbacks.manager import (
    AsyncCallbackManagerForToolRun,
    CallbackManagerForToolRun,
)

CALENDAR_ID = 'primary'

from api.assistant_module.google_service import get_google_service


class UpdateOrCancelEventInput(BaseModel):
    calendar_id: str = Field(default='primary', description="ID of the calendar")
    event_id: str = Field(description="ID of the event to update or cancel")
    update_body: Optional[Dict[str, Any]] = Field(default=None, description="Body of the event update")

class UpdateOrCancelEventTool(BaseTool):
    name = "update_or_cancel_event"
    description = "Update or cancel an event in Google Calendar"
    args_schema: Type[BaseModel] = UpdateOrCancelEventInput

    def _run(
            self, calendar_id: str = 'primary', event_id: str = None, update_body: Optional[Dict[str, Any]] = None, run_manager: Optional[CallbackManagerForToolRun] = None
    ) -> str:
        """Use the tool."""
        return self.update_or_cancel_event(calendar_id, event_id, update_body)

    async def _arun(
            self, calendar_id: str = 'primary', event_id: str = None, update_body: Optional[Dict[str, Any]] = None, run_manager: Optional[AsyncCallbackManagerForToolRun] = None
    ) -> str:
        """Use the tool asynchronously."""
        return await asyncio.to_thread(self.update_or_cancel_event, calendar_id, event_id, update_body)

    def update_or_cancel_event(self, calendar_id: str, event_id: str, update_body: Optional[Dict[str, Any]]) -> str:
        try:
            service = get_google_service('calendar','v3')
            if update_body:
                updated_event = service.events().update(calendarId=calendar_id, eventId=event_id, body=update_body).execute()
                return f"Event updated: {updated_event.get('htmlLink')}"
            else:
                service.events().delete(calendarId=calendar_id, eventId=event_id).execute()
                return 'Event deleted.'
        except Exception as e:
            return f"An error occurred: {e}"


# Example usage
if __name__ == "__main__":
    tool = UpdateOrCancelEventTool()
    print(tool._run(calendar_id="primary", event_id="EVENT_ID", update_body={"summary": "Updated Event"}))
