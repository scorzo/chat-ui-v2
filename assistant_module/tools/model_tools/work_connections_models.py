from langchain_core.pydantic_v1 import BaseModel, Field
from typing import List

class DatedNote(BaseModel):
    date: str = Field(description="Date of the note in ISO 8601 format")
    note: str

class Contact(BaseModel):
    name: str
    company: str
    phone: str
    role: str = Field(description="Role of the contact within the company")
    dated_notes: List[DatedNote] = Field(description="List of dated notes associated with the contact")
    keywords: List[str] = Field(description="List of keywords related to the contact")

class WorkConnections(BaseModel):
    name: str
    description: str
    contacts: List[Contact] = Field(description="List of contacts with their details")
    keywords: List[str] = Field(description="List of keywords related to work connections")
