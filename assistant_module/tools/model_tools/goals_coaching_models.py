from langchain_core.pydantic_v1 import BaseModel, Field
from typing import List
from enum import Enum

class GoalCategoryEnum(str, Enum):
    HEALTH = "Health Goals"
    FAMILY = "Family Goals"
    ORGANIZING_PLANNING = "Organizing/Planning Goals"
    ACTIVITIES = "Activities Goals"

class ProgressTracking(BaseModel):
    goal: str
    progress_update: str
    date: str = Field(description="Date of progress update in ISO 8601 format")
    progress: int = Field(description="Progress percentage as an integer from 0 to 100")

class CoachingResource(BaseModel):
    resource: str
    description: str
    url: str = Field(description="URL of the coaching resource")

class Goal(BaseModel):
    goal: str
    description: str
    target_date: str = Field(description="Target date for goal completion in ISO 8601 format")
    priority: str
    status: str

class GoalCategory(BaseModel):
    category: GoalCategoryEnum = Field(description="The category of the goal, which must be one of the predefined categories: Health Goals, Family Goals, Organizing/Planning Goals, or Activities Goals.")
    related_areas: List[str] = Field(
        default=[],
        description="Areas related to the goal category, such as 'Physical Health, Mental Health, Preventive Care, Emergency Care' for Health Goals, 'Family Members, Family Outings' for Family Goals, 'Household, Finance' for Organizing/Planning Goals, and 'Hobbies, Educational Activities, Vacation Planning' for Activities Goals."
    )
    goals: List[Goal] = Field(description="List of goals associated with this category, such as those related to health, family, organizing/planning, or activities.")
    progress_tracking: List[ProgressTracking] = Field(description="List of progress tracking entries related to the goals in this category.")
    coaching_resources: List[CoachingResource] = Field(description="List of coaching resources to support the goals in this category.")

class GoalsCoaching(BaseModel):
    name: str
    description: str
    goal_categories: List[GoalCategory] = Field(description="A list of goal categories, each containing goals, progress tracking, and coaching resources. Categories include Health Goals, Family Goals, Organizing/Planning Goals, and Activities Goals.")
