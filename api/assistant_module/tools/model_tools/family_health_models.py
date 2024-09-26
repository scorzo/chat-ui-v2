from langchain_core.pydantic_v1 import BaseModel, Field
from typing import List, Optional
from datetime import date

class PhysicalHealth(BaseModel):
    condition: Optional[str] = Field(None, description="Physical health condition")
    medications: Optional[List[str]] = Field(None, description="List of medications")
    last_checkup_date: Optional[date] = Field(None, description="Date of the last physical checkup")
    notes: Optional[str] = Field(None, description="Additional notes about physical health")

class MentalHealth(BaseModel):
    condition: Optional[str] = Field(None, description="Mental health condition")
    medications: Optional[List[str]] = Field(None, description="List of medications")
    last_checkup_date: Optional[date] = Field(None, description="Date of the last mental health checkup")
    notes: Optional[str] = Field(None, description="Additional notes about mental health")

class PreventiveCare(BaseModel):
    immunizations: Optional[List[str]] = Field(None, description="List of immunizations")
    regular_screenings: Optional[List[str]] = Field(None, description="List of regular screenings")
    last_screening_date: Optional[date] = Field(None, description="Date of the last preventive screening")
    notes: Optional[str] = Field(None, description="Additional notes about preventive care")

class EmergencyCare(BaseModel):
    emergency_contact: Optional[str] = Field(None, description="Emergency contact name")
    emergency_contact_phone: Optional[str] = Field(None, description="Emergency contact phone number")
    allergies: Optional[List[str]] = Field(None, description="List of allergies")
    emergency_instructions: Optional[str] = Field(None, description="Instructions in case of an emergency")
    notes: Optional[str] = Field(None, description="Additional notes about emergency care")

class FamilyMember(BaseModel):
    name: str = Field(..., description="Name of the family member")
    date_of_birth: Optional[date] = Field(None, description="Date of birth")
    physical_health: Optional[PhysicalHealth] = Field(None, description="Physical health details")
    mental_health: Optional[MentalHealth] = Field(None, description="Mental health details")
    preventive_care: Optional[PreventiveCare] = Field(None, description="Preventive care details")
    emergency_care: Optional[EmergencyCare] = Field(None, description="Emergency care details")

class FamilyHealth(BaseModel):
    name: str = Field(..., description="Name of the family health record")
    description: str = Field(..., description="Description of the family health record")
    family_members: List[FamilyMember] = Field(..., description="List of family members and their health details")
