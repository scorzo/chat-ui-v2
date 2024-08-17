import os
import logging
import json
from typing import Optional, Type, Dict, Any, Tuple
from langchain.pydantic_v1 import BaseModel, Field
from langchain.tools import BaseTool
from langchain.callbacks.manager import CallbackManagerForToolRun, AsyncCallbackManagerForToolRun
import requests
import asyncio

class SearchParams(BaseModel):
    query: str = Field(description="The search query to send to the web search engine.")

class WebSearchTool(BaseTool):
    name = "web_search_tool"
    description = "Search the web and return relevant results based on the provided query."
    args_schema: Type[BaseModel] = SearchParams

    def _run(
            self, query: str, **kwargs: Any
    ) -> Tuple[Dict[str, Any], int]:
        """Use the tool."""
        return self.search_web(query)

    async def _arun(
            self, query: str, **kwargs: Any
    ) -> Tuple[Dict[str, Any], int]:
        """Use the tool asynchronously."""
        return await asyncio.to_thread(self.search_web, query)

    def search_web(self, query: str) -> Tuple[Dict[str, Any], int]:
        logging.info(f"Received search query: {query}")
        api_key = os.getenv('SERPER_API_KEY')

        if not api_key:
            logging.error("Serper API key is not set.")
            return {"error": "Serper API key is not set."}, 500

        search_url = 'https://google.serper.dev/search'
        headers = {
            'X-API-KEY': api_key,
            'Content-Type': 'application/json'
        }
        payload = json.dumps({"q": query})

        try:
            response = requests.post(search_url, headers=headers, data=payload)
            logging.debug(f"Response status code: {response.status_code}")
            response.raise_for_status()
            results = response.json()
            logging.debug("Search results retrieved successfully.")
            return results, 200
        except requests.exceptions.HTTPError as http_err:
            logging.error(f"HTTP error occurred: {http_err}")
            return {"error": f"HTTP error: {http_err}"}, response.status_code
        except requests.exceptions.RequestException as req_err:
            logging.exception("Request exception occurred.")
            return {"error": str(req_err)}, 500
        except ValueError as json_err:
            logging.exception("JSON decoding failed.")
            return {"error": "JSON decoding error"}, 500

