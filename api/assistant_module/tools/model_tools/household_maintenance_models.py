from langchain_core.pydantic_v1 import BaseModel, Field
from typing import List, Optional

class ContractorDetails(BaseModel):
    name: str = Field(description="Name of the contractor or company")
    contact_number: str = Field(description="Contact number of the contractor")
    email: Optional[str] = Field(description="Email address of the contractor")
    company_url: Optional[str] = Field(description="Website URL of the contractor's company")

class MaintenanceTask(BaseModel):
    task_id: str = Field(description="Unique identifier for the maintenance task")
    name: str = Field(description="Name of the maintenance task")
    description: Optional[str] = Field(description="Detailed description of the maintenance task")
    scheduled_date: str = Field(description="Scheduled date for the maintenance task in ISO 8601 format")
    completion_date: Optional[str] = Field(description="Actual completion date of the maintenance task in ISO 8601 format")
    projected_cost: float = Field(description="Projected cost for the maintenance task")
    actual_cost: Optional[float] = Field(description="Actual cost incurred for the maintenance task")
    tools_required: List[str] = Field(description="List of tools required for the maintenance task")
    contractor_details: Optional[ContractorDetails] = Field(description="Details of the contractor or handyman if applicable")

class HouseholdMaintenance(BaseModel):
    household_id: str = Field(description="Unique identifier for the household")
    user_id: str = Field(description="Unique identifier for the user")
    name: str = Field(description="Name of the household maintenance plan")
    description: Optional[str] = Field(description="Description of the household maintenance plan")
    start_date: str = Field(description="Start date of the maintenance plan in ISO 8601 format")
    end_date: str = Field(description="End date of the maintenance plan in ISO 8601 format")
    tasks: List[MaintenanceTask] = Field(description="List of maintenance tasks")
    notes: Optional[str] = Field(description="Additional notes for the maintenance plan")

# Example usage
