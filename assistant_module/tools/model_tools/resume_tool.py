from langchain.pydantic_v1 import BaseModel, Field
from langchain.tools import BaseTool
from typing import Optional, Type
from langchain.callbacks.manager import (
    AsyncCallbackManagerForToolRun,
    CallbackManagerForToolRun,
)
from datetime import datetime
import pytz
import os
from assistant_module.tools.datanode_package.datanode import generate_datanode_from_model_with_tools
from assistant_module.tools.datanode_package.prune_node_tool import PruneNodeTool
from .resume_template_models import ResumeTemplate  # Assuming this model is defined as per your previous request
import asyncio

def get_current_time_and_timezone(timezone_config):
    if not timezone_config:
        raise ValueError("Timezone configuration is not defined.")

    try:
        my_timezone = pytz.timezone(timezone_config)
    except pytz.UnknownTimeZoneError:
        raise ValueError(f"The provided timezone '{timezone_config}' is not recognized.")

    my_time = datetime.now(my_timezone).strftime('%Y-%m-%d')
    return my_time, my_timezone

DEFAULT_PROMPT = """
Based on my personal information, create an ATS-compliant resume that includes:
- Contact information (name, job title, location, phone, email, LinkedIn)
- A strong resume summary highlighting my experience, specializations, and strengths.
- Work experience (job titles, companies, dates of employment, and responsibilities)
- Education (degrees, graduation years, institutions, and locations)
Tailor the content to highlight relevant skills and accomplishments that align with the target job description.
Use the PruneNodeTool to retrieve the necessary resume details.

Ensure that the resume is well-structured, concise, and uses appropriate formatting for ATS systems.

Respond with the data in a JSON object format based on the ResumeTemplate Pydantic model.
"""

DEFAULT_PARENT_NODE_ID = "SG91c2Vob2xkTmurmlispG"

class ResumeGenerationParams(BaseModel):
    prompt: Optional[str] = Field(default=DEFAULT_PROMPT, description="The prompt to send to the language model for generating the resume.")

class ResumeGenerationTool(BaseTool):
    name = "resume_generation_tool"
    description = "This tool generates an ATS-compliant resume based on the user's prompt."
    args_schema: Type[BaseModel] = ResumeGenerationParams

    def _run(
            self, prompt: Optional[str] = DEFAULT_PROMPT, run_manager: Optional[CallbackManagerForToolRun] = None
    ) -> dict:
        """Use the tool."""
        return self.generate_resume(prompt)

    async def _arun(
            self, prompt: Optional[str] = DEFAULT_PROMPT, run_manager: Optional[AsyncCallbackManagerForToolRun] = None
    ) -> dict:
        """Use the tool asynchronously."""
        return await asyncio.to_thread(self.generate_resume, prompt)

    def generate_resume(self, prompt: str) -> dict:
        """
        Generates a resume using the provided prompt and adds it to the specified node.
        """
        my_time, my_timezone = get_current_time_and_timezone(os.environ['TIMEZONE'])
        system_instructions = f"""
        You are a personal AI assistant designed to create ATS-compliant resumes. It's {my_time} in the {my_timezone} timezone.

        Use the PruneNodeTool to retrieve the necessary skill and work experience details for the user.
        
        Work-related details for the user are stored under Career Details in the node structure returned by the PruneNodeTool."""

        prompt += f"""
        Customize the resume to highlight relevant skills and accomplishments that align with the target job description based on the resume structure rules below:

        Resume Structure:
        - Contact Information: Customize the job title according to the job description.
        - Resume Summary: A summary highlighting the applicant's key qualifications, experience levels, specializations, and strengths completely customized according to the job description.  
        
        - Work Experience: 
        
            Tailor your experience sections to the job description. Don’t use up too much of your space detailing daily duties that aren’t relevant to the job for which you’re applying. Study the job listing to figure out what’s most important to the hiring manager. Use important resume keywords and accomplishments that speak to your ability to execute.

            Work the hard skills and keywords found in the job description right into your resume. That said, simply listing the keywords isn’t enough. Provide as much context as your can in this limited space to prove that you really do know your stuff. For example, if you mention a piece of software like Microsoft Excel, Adobe Photoshop, or AutoCAD, mention the types of projects it was used for.

            Recruiters like to be able to get an idea of why you move from company to company. Demonstrating your increasing impact and responsibility from job to job shows the recruiter that you’re capable of taking on more and more and gives them an idea of where your career is heading.
            
            You don’t need to include every job you’ve ever had on your resume. Stick to the jobs that are most relevant and demonstrate your career trajectory. For example, if you are a Project Manager, you probably don’t need to mention the supermarket job you had as a teenager or the bartending job your maintain on the weekends.
        
        - Education: Include educational background, degrees, graduation years, and institution names.

        The resume should be concise, well-structured, and tailored to highlight skills and accomplishments relevant to the target job description.

        Respond with the data in a JSON object format based on the ResumeTemplate Pydantic model without enclosing it in a string. Only provide the JSON object.
        """

        return generate_datanode_from_model_with_tools(
            prompt=prompt,
            model_name="gpt-4o",
            pydantic_model=ResumeTemplate,
            tools=[PruneNodeTool()],  # Add other tools if needed
            node_id=DEFAULT_PARENT_NODE_ID,
            node_type="ResumeModalContent",
            system_instructions=system_instructions
        )

# Example usage
if __name__ == "__main__":
    tool = ResumeGenerationTool()
    result = tool._run()
    print("Generated resume datanode:", result)
