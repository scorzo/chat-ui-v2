from langchain_core.pydantic_v1 import BaseModel, Field, EmailStr, HttpUrl
from typing import List, Optional

class ProjectAccomplishment(BaseModel):
    name: str = Field(description="Name of the project or accomplishment")
    description: Optional[str] = Field(description="Description of the project or accomplishment")
    skills_tags: List[str] = Field(description="List of skills tags associated with this project or accomplishment")

class Role(BaseModel):
    role_title: str
    projects_accomplishments: List[ProjectAccomplishment] = Field(description="List of projects and accomplishments associated with this role")

class Experience(BaseModel):
    company: str
    location: Optional[str] = Field(description="Location of the company")
    duration: str = Field(description="Duration of the job role")
    roles: List[Role] = Field(description="List of roles associated with this experience")

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

class KnowledgeBaseItem(BaseModel):
    skill_name: str = Field(description="Name of the skill or knowledge area")
    notes: Optional[str] = Field(description="Additional notes or context about this skill or knowledge area")

class AdditionalSkills(BaseModel):
    skills: List[KnowledgeBaseItem] = Field(description="List of skills or knowledge areas that weren't directly used in any specific project")

class CareerDevelopment(BaseModel):
    name: str
    description: str
    contact_information: ContactInformation = Field(description="Contact information for the individual")
    experience: List[Experience] = Field(description="A list of experiences, each containing roles and associated projects/accomplishments")
    education: List[Education] = Field(description="Educational background, including degrees, certifications, and internships")
    additional_skills: AdditionalSkills = Field(description="A section for knowledge and skills not tied to specific projects")
