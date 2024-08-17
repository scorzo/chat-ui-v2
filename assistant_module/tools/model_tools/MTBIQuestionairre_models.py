from langchain_core.pydantic_v1 import BaseModel, Field
from typing import List, Optional

class MBTIScore(BaseModel):
    extraversion: int
    introversion: int
    sensing: int
    intuition: int
    thinking: int
    feeling: int
    judging: int
    perceiving: int

class MBTIAssessment(BaseModel):
    personality_type: str
    description: str

class FamilyMember(BaseModel):
    id: str
    name: str
    age: int
    gender: str
    score: Optional[MBTIScore] = None
    assessment: Optional[MBTIAssessment] = None

class Family(BaseModel):
    family_name: str
    name: Optional[str] = None
    description: Optional[str] = None
    members: List[FamilyMember]
