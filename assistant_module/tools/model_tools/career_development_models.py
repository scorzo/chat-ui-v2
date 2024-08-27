from langchain_core.pydantic_v1 import BaseModel, Field, EmailStr, HttpUrl
from typing import List, Optional
from enum import Enum

class Skill(BaseModel):
    skill_name: str
    proficiency_level: Optional[str] = Field(description="Proficiency level, if applicable")
    last_updated_date: Optional[str] = Field(description="Date when the skill was last updated in ISO 8601 format")
    related_projects: Optional[List[str]] = Field(default=[], description="List of related projects/experiences")
    keywords: Optional[List[str]] = Field(default=[], description="Keywords associated with this skill")

class Experience(BaseModel):
    job_title: str
    company: str
    location: Optional[str] = Field(description="Location of the company")
    duration: str = Field(description="Duration of the job role")
    responsibilities: List[str] = Field(description="List of responsibilities in this role")
    achievements: Optional[List[str]] = Field(default=[], description="Achievements in this role")
    skills_used: Optional[List[str]] = Field(default=[], description="List of skills used in this role, linking to the Skills section")
    keywords: Optional[List[str]] = Field(default=[], description="Keywords associated with this experience")

class Education(BaseModel):
    degree: str
    institution: str
    location: Optional[str] = Field(description="Location of the institution")
    graduation_date: Optional[str] = Field(description="Graduation date in ISO 8601 format")
    certifications: Optional[List[str]] = Field(default=[], description="List of certifications")
    internships: Optional[List[str]] = Field(default=[], description="Internships associated with this education")
    related_projects: Optional[List[str]] = Field(default=[], description="List of related projects/experiences linked to this education")
    keywords: Optional[List[str]] = Field(default=[], description="Keywords associated with this education")

class ContactInformation(BaseModel):
    name: str
    job_title: str
    location: str
    linkedin: Optional[HttpUrl] = Field(description="LinkedIn profile URL")
    email: EmailStr
    phone: str
    github: Optional[HttpUrl] = Field(description="GitHub profile URL")
    articles: Optional[HttpUrl] = Field(description="URL to articles or blog posts")

class CareerDevelopment(BaseModel):
    name: str
    description: str
    contact_information: ContactInformation = Field(description="Contact information for the individual")
    skills: List[Skill] = Field(description="A list of skills")
    experience: List[Experience] = Field(description="A list of job experiences")
    education: List[Education] = Field(description="Educational background, including degrees, certifications, and internships")
