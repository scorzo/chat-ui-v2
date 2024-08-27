from langchain_core.pydantic_v1 import BaseModel, Field
from typing import List
from enum import Enum

class CareerGoalCategoryEnum(str, Enum):
    SKILLS = "Skills Development"
    EXPERIENCE = "Professional Experience"
    EDUCATION = "Education and Certifications"
    NETWORKING = "Networking and Connections"

class ProgressTracking(BaseModel):
    goal: str
    progress_update: str
    date: str = Field(description="Date of progress update in ISO 8601 format")
    progress: int = Field(description="Progress percentage as an integer from 0 to 100")

class CoachingResource(BaseModel):
    resource: str
    description: str
    url: str = Field(description="URL of the coaching resource")

class CareerGoal(BaseModel):
    goal: str
    description: str
    target_date: str = Field(description="Target date for goal completion in ISO 8601 format")
    priority: str
    status: str

class CareerGoalCategory(BaseModel):
    category: CareerGoalCategoryEnum = Field(description="The category of the career goal, which must be one of the predefined categories: Skills Development, Professional Experience, Education and Certifications, or Networking and Connections.")
    related_areas: List[str] = Field(
        default=[],
        description="Areas related to the career goal category, such as 'Technical Skills, Soft Skills' for Skills Development, 'Project Management, Team Leadership' for Professional Experience, 'Degrees, Certifications' for Education and Certifications, and 'LinkedIn Connections, Industry Events' for Networking and Connections."
    )
    goals: List[CareerGoal] = Field(description="List of career goals associated with this category.")
    progress_tracking: List[ProgressTracking] = Field(description="List of progress tracking entries related to the goals in this category.")
    coaching_resources: List[CoachingResource] = Field(description="List of coaching resources to support the goals in this category.")

class CareerGoalsCoaching(BaseModel):
    name: str
    description: str
    goal_categories: List[CareerGoalCategory] = Field(description="A list of career goal categories, each containing goals, progress tracking, and coaching resources. Categories include Skills Development, Professional Experience, Education and Certifications, and Networking and Connections.")
