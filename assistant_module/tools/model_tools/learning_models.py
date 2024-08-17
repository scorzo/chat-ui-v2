from langchain_core.pydantic_v1 import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import date

class TeacherContact(BaseModel):
    name: str
    email: EmailStr
    phone: str

class Exam(BaseModel):
    date: date
    topic: str
    description: Optional[str] = None
    score: Optional[float] = None

class Topic(BaseModel):
    subject: str
    class_hours: Optional[float] = None
    teacher_contact: TeacherContact
    homework: Optional[str] = None
    notes: Optional[str] = None
    start_date: date
    end_date: date
    exams: List[Exam]

class InstitutionAttending(BaseModel):
    name: str
    hours: Optional[float] = None
    holidays: Optional[List[str]] = None
    grade_level: Optional[str] = None
    topics: List[Topic]

class Person(BaseModel):
    name: str
    institutions_attending: List[InstitutionAttending]

class Learning(BaseModel):
    people: List[Person]
    name: str
    description: str
