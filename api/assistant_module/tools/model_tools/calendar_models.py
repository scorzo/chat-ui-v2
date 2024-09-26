from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class CalendarEvent(BaseModel):
    event_id: str = Field(description="Unique identifier for the event")
    title: str = Field(description="Title of the event")
    description: Optional[str] = Field(default='', description="Description of the event")
    start_time: datetime = Field(description="Start time of the event")
    end_time: datetime = Field(description="End time of the event")
    location: Optional[str] = Field(default='', description="Location of the event")
    all_day: bool = Field(default=False, description="Whether the event lasts all day")
    recurring: Optional[str] = Field(default=None, description="Recurrence rule in iCalendar format")
    attendees: Optional[List[str]] = Field(default=[], description="List of attendees")
    url: Optional[str] = Field(default='', description="URL for event details or joining link")
    notes: Optional[str] = Field(default='', description="Additional notes for the event")

class Calendar(BaseModel):
    calendar_id: str = Field(description="Unique identifier for the calendar")
    name: str = Field(description="Name of the calendar")
    description: Optional[str] = Field(default='', description="Description of the calendar")
    events: List[CalendarEvent] = Field(description="List of events in the calendar")
    owner: str = Field(description="Owner of the calendar")
    shared_with: Optional[List[str]] = Field(default=[], description="List of users the calendar is shared with")
    timezone: str = Field(description="Timezone of the calendar")
    notes: Optional[str] = Field(default='', description="Additional notes for the calendar")
