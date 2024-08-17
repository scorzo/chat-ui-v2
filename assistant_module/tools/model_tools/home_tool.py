import logging
import requests
from typing import Optional, Type, Dict, Any, Tuple
from langchain.pydantic_v1 import BaseModel, Field
from langchain.tools import BaseTool
from langchain.callbacks.manager import CallbackManagerForToolRun, AsyncCallbackManagerForToolRun
from assistant_module.tools.datanode_package.datanode import replace_datanode_from_model_with_tools
from assistant_module.tools.misc_tools.html_scraper_tool import HtmlScraperTool
from assistant_module.tools.model_tools.home_models import HomeData
import asyncio

class RedfinScraperParams(BaseModel):
    url: str = Field(description="The Redfin address URL to scrape.")
    css_class: Optional[str] = Field(None, description="A CSS class to limit the scope of the returned data. Only content within elements matching this class will be returned.")

class RedfinScraperTool(BaseTool):
    name = "redfin_scraper_tool"
    description = "This tool scrapes a Redfin address URL and outputs the information into a Pydantic model format. Optionally limits the scope to elements matching the specified CSS class."
    args_schema: Type[BaseModel] = RedfinScraperParams

    def _run(
            self, url: str, css_class: Optional[str] = None, run_manager: Optional[CallbackManagerForToolRun] = None
    ) -> Tuple[Dict[str, Any], int]:
        """Use the tool."""
        home_data = self.scrape_redfin(url, css_class)
        # Directly return home_data as a dictionary
        try:
            logging.debug(f"Serialized home data: {home_data}")
            return home_data, 200
        except Exception as e:
            logging.error(f"Serialization error: {e}")
            logging.error(f"HomeData type: {type(home_data)}")
            logging.error(f"HomeData content: {home_data}")
            raise

    async def _arun(
            self, url: str, css_class: Optional[str] = None, run_manager: Optional[AsyncCallbackManagerForToolRun] = None
    ) -> Tuple[Dict[str, Any], int]:
        """Use the tool asynchronously."""
        return await asyncio.to_thread(self.scrape_redfin, url, css_class)

    def scrape_redfin(self, url: str, css_class: Optional[str] = None) -> Dict[str, Any]:
        """
        Scrape the Redfin URL and populate the Pydantic model using generate_datanode_from_model_with_tools.
        """
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
        }

        try:

            prompt = f"""
            Scrape the data from the Redfin URL: {url} using the content within the element with a css class of {css_class}.
            Respond with the data in a JSON object format without enclosing it in a string. 
            Only provide the JSON object.
            """

            system_instructions = """
            You are an AI assistant designed to extract real estate data from Redfin and format it into a HomeData Pydantic model.
            """

            home_data = replace_datanode_from_model_with_tools(
                prompt=prompt,
                model_name="gpt-4o",
                pydantic_model=HomeData,
                tools=[HtmlScraperTool()],  # Add appropriate tools if needed
                node_id="SG9tZU5vZGU1To",  # Node ID not used in this context
                node_type="HomeModalContent",  # Node type not used in this context
                system_instructions=system_instructions
            )

            return home_data

        except requests.exceptions.HTTPError as http_err:
            logging.error(f"HTTP error occurred: {http_err}")
            return {
                "home_id": "",
                "name": "",
                "description": f"Data could not be retrieved due to a {http_err.response.status_code} error."
            }
        except requests.exceptions.RequestException as req_err:
            logging.exception("Request exception occurred.")
            return {
                "home_id": "",
                "name": "",
                "description": f"Data could not be retrieved due to a request error: {req_err}"
            }


# Example usage
if __name__ == "__main__":
    tool = RedfinScraperTool()
    result, status = tool._run(url="https://www.redfin.com/CA/Santa-Clarita/23808-Bayview-Ct-91355/home/54945867", css_class="some-css-class")
    print("Scraped Home Data:", result)
