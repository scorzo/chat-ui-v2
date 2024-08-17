import os
import logging
import requests
from typing import Optional, Type, Dict, Any, Tuple
from langchain.pydantic_v1 import BaseModel, Field
from langchain.tools import BaseTool
from langchain.callbacks.manager import CallbackManagerForToolRun, AsyncCallbackManagerForToolRun
from bs4 import BeautifulSoup
import asyncio

class UrlParams(BaseModel):
    url: str = Field(description="The URL to scrape the HTML content from.")
    css_class: Optional[str] = Field(None, description="A CSS class to limit the scope of the returned data. Only content within elements matching this class will be returned.")

class HtmlScraperTool(BaseTool):
    name = "html_scraper_tool"
    description = "Scrapes the HTML content from the provided URL. Optionally limits the scope to elements matching the specified CSS class."
    args_schema: Type[BaseModel] = UrlParams

    def _run(
            self, url: str, css_class: Optional[str] = None, **kwargs: Any
    ) -> Tuple[Dict[str, Any], int]:
        """Use the tool."""
        return self.scrape_html(url, css_class)

    async def _arun(
            self, url: str, css_class: Optional[str] = None, **kwargs: Any
    ) -> Tuple[Dict[str, Any], int]:
        """Use the tool asynchronously."""
        return await asyncio.to_thread(self.scrape_html, url, css_class)

    def scrape_html(self, url: str, css_class: Optional[str] = None) -> Tuple[Dict[str, Any], int]:
        logging.info(f"Scraping HTML content from URL: {url}")

        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
        }

        try:
            response = requests.get(url, headers=headers)
            logging.debug(f"Response status code: {response.status_code}")
            response.raise_for_status()
            html_content = response.text
            logging.debug("HTML content retrieved successfully.")

            # Hardcoded CSS classes
            css_classes = ['house-info', 'top-stats', 'schools', 'propertyDetails']

            soup = BeautifulSoup(html_content, 'html.parser')
            limited_content = []
            for cls in css_classes:
                elements = soup.find_all(class_=cls)
                limited_content.extend(elements)

            limited_html_content = ''.join(str(element) for element in limited_content)
            logging.debug("Limited HTML content retrieved successfully.")

            return {"html": limited_html_content}, 200
        except requests.exceptions.HTTPError as http_err:
            logging.error(f"HTTP error occurred: {http_err}")
            return {"error": f"HTTP error: {http_err}"}, response.status_code
        except requests.exceptions.RequestException as req_err:
            logging.exception("Request exception occurred.")
            return {"error": str(req_err)}, 500

# Example usage
if __name__ == "__main__":
    tool = HtmlScraperTool()
    result, status = tool._run(url="https://www.example.com", css_class="example-class")
    if status == 200:
        print("HTML Content:", result["html"])
    else:
        print("Error:", result["error"])
