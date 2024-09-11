from langchain_core.pydantic_v1 import BaseModel, Field
from typing import List, Optional

class ContactInformation(BaseModel):
    name: str = Field(description="Full name of the applicant")
    job_title: Optional[str] = Field(None, description="Job title for the application")
    city: Optional[str] = Field(None, description="City where the applicant is located")
    state_zip: Optional[str] = Field(None, description="State and ZIP code where the applicant is located")
    phone_number: str = Field(description="Applicant's phone number")
    email: str = Field(description="Applicant's email address")
    linkedin_url: Optional[str] = Field(None, description="Applicant's LinkedIn profile URL")

class ResumeSummary(BaseModel):
    summary: str = Field(description="A strong resume summary highlighting the applicant's experience, specializations, and strengths")

class WorkExperienceItem(BaseModel):
    company: str = Field(description="Name of the company where the applicant worked")
    location: Optional[str] = Field(None, description="Location of the company")
    job_title: str = Field(description="Job title held at the company")
    start_date: str = Field(description="Start date of the job in MM/YYYY format")
    end_date: Optional[str] = Field(None, description="End date of the job in MM/YYYY format or 'Present' if currently employed")
    work_experience_summary: str = Field(description="A summary paragraph describing the applicant's work experience, key responsibilities, and accomplishments at this job")

class EducationItem(BaseModel):
    degree: str = Field(description="Degree obtained")
    graduation_year: str = Field(description="Year of graduation in YYYY format")
    college_name: str = Field(description="Name of the college or university")
    location: Optional[str] = Field(None, description="Location of the college or university")

class ResumeTemplate(BaseModel):
    name: str = Field(description="Name of the resume instance")
    description: str = Field(description="Description of the resume instance")
    contact_information: ContactInformation = Field(description="Applicant's contact information including name, job title, and contact details")
    resume_summary: Optional[ResumeSummary] = Field(None, description="A summary section highlighting the applicant's key qualifications")
    work_experience: List[WorkExperienceItem] = Field(description="List of the applicant's work experiences, detailing job titles, companies, and a summary of responsibilities")
    education: List[EducationItem] = Field(description="List of the applicant's educational background, including degrees and institutions")
