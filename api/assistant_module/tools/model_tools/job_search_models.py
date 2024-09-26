from langchain_core.pydantic_v1 import BaseModel, Field
from typing import List, Optional

class JobPosting(BaseModel):
    title: str = Field(description="Title of the job position")
    company: str = Field(description="Company offering the job")
    location: str = Field(description="Location of the job")
    salary_range: Optional[str] = Field(None, description="Salary range offered for the position")
    description: str = Field(description="Detailed description of the job position")
    requirements: List[str] = Field(description="List of job requirements and qualifications")
    application_url: str = Field(description="URL where the user can apply for the job")

class JobApplication(BaseModel):
    job_posting: JobPosting = Field(description="Details of the job posting applied to")
    application_date: str = Field(description="Date when the application was submitted")
    status: str = Field(description="Current status of the job application (e.g., applied, interviewing, rejected)")
    follow_up_date: Optional[str] = Field(None, description="Date to follow up on the application")

class JobSearchCriteria(BaseModel):
    keywords: List[str] = Field(description="Keywords used in the job search")
    location: Optional[str] = Field(None, description="Preferred job location")
    job_type: Optional[str] = Field(None, description="Type of job (e.g., full-time, part-time, contract)")
    experience_level: Optional[str] = Field(None, description="Experience level required (e.g., entry, mid, senior)")
    salary_range: Optional[str] = Field(None, description="Preferred salary range")

class JobSearchResults(BaseModel):
    criteria: JobSearchCriteria = Field(description="Criteria used for the job search")
    postings: List[JobPosting] = Field(description="List of job postings that match the search criteria")

class JobSearchUtility(BaseModel):
    name: str = Field(description="Name of the job search utility")
    description: str = Field(description="Description of the job search utility")
    current_search_results: JobSearchResults = Field(description="Results of the current job search based on user criteria")
    applications: List[JobApplication] = Field(default_factory=list, description="List of job applications submitted by the user")
    insights: str = Field(description="Insights and suggestions for the user's job search and applications")
