from typing import Tuple, Dict, Any
from langchain.pydantic_v1 import BaseModel, Field
from langchain.tools import BaseTool
from typing import Optional, Type
from langchain.callbacks.manager import (
    AsyncCallbackManagerForToolRun,
    CallbackManagerForToolRun,
)
import requests
import json
import os
import logging
import asyncio
from PIL import Image
from io import BytesIO

# Configure logging
# logging.basicConfig(level=logging.DEBUG, format='%(asctime)s - IMAGE_SEARCH_TOOL - %(levelname)s - %(message)s')

# Hard-coded variable to check resolution
CHECK_RESOLUTION = False

class ImageSearchParams(BaseModel):
    search_term: str = Field(description="The search term for querying images.")

class ImageSearchTool(BaseTool):
    name = "image_search_tool"
    description = "This tool returns a real JPG or JPEG image URL for a given search term."
    args_schema: Type[BaseModel] = ImageSearchParams

    def _run(
            self, search_term: str, run_manager: Optional[CallbackManagerForToolRun] = None
    ) -> str:
        """Use the tool."""
        return self.search_image(search_term)

    async def _arun(
            self, search_term: str, run_manager: Optional[AsyncCallbackManagerForToolRun] = None
    ) -> str:
        """Use the tool asynchronously."""
        return await asyncio.to_thread(self.search_image, search_term)

    def search_image(self, search_term: str) -> str:
        logging.info(f"IMAGE_SEARCH_TOOL - Starting image search for term: {search_term}")
        result, status = self.search_web(search_term)
        logging.debug(f"IMAGE_SEARCH_TOOL - Search results: {result}")
        if status == 200:
            image_url = self.extract_image_url(result)
            if image_url:
                logging.info(f"IMAGE_SEARCH_TOOL - Image URL found: {image_url}")
                if not CHECK_RESOLUTION or self.is_valid_resolution(image_url):
                    response = {"term": search_term, "image_url": image_url}
                    logging.info(f"IMAGE_SEARCH_TOOL - Image has valid resolution: {image_url}")
                else:
                    response = {"term": search_term, "image_url": None, "error": "No suitable resolution found"}
                    logging.warning(f"IMAGE_SEARCH_TOOL - Image does not have suitable resolution: {image_url}")
            else:
                response = {"term": search_term, "image_url": None}
                logging.warning("IMAGE_SEARCH_TOOL - No image URL found in search results.")
        else:
            response = {"term": search_term, "image_url": None}
            logging.error(f"IMAGE_SEARCH_TOOL - Image search failed with status code: {status}")
        return json.dumps(response)

    def search_web(self, query: str) -> Tuple[Dict[str, Any], int]:
        logging.info(f"IMAGE_SEARCH_TOOL - Received search query: {query}")
        api_key = os.getenv('SERPER_API_KEY')

        if not api_key:
            logging.error("IMAGE_SEARCH_TOOL - Serper API key is not set.")
            return {"error": "Serper API key is not set."}, 500

        search_url = 'https://google.serper.dev/images'
        headers = {
            'X-API-KEY': api_key,
            'Content-Type': 'application/json'
        }
        payload = json.dumps({"q": query})

        try:
            response = requests.post(search_url, headers=headers, data=payload)
            logging.debug(f"IMAGE_SEARCH_TOOL - Response status code: {response.status_code}")
            response.raise_for_status()
            results = response.json()
            logging.debug(f"IMAGE_SEARCH_TOOL - Full search results: {json.dumps(results, indent=2)}")
            return results, 200
        except requests.exceptions.HTTPError as http_err:
            logging.error(f"IMAGE_SEARCH_TOOL - HTTP error occurred: {http_err}")
            return {"error": f"HTTP error: {http_err}"}, response.status_code
        except requests.exceptions.RequestException as req_err:
            logging.exception("IMAGE_SEARCH_TOOL - Request exception occurred.")
            return {"error": str(req_err)}, 500
        except ValueError as json_err:
            logging.exception("IMAGE_SEARCH_TOOL - JSON decoding failed.")
            return {"error": "JSON decoding error"}, 500

    def extract_image_url(self, search_results: Dict[str, Any]) -> str:
        logging.debug(f"IMAGE_SEARCH_TOOL - Extracting image URL from search results: {json.dumps(search_results, indent=2)}")
        if "images" in search_results:
            logging.debug(f"IMAGE_SEARCH_TOOL - Number of images found: {len(search_results['images'])}")
            for image in search_results["images"]:
                logging.debug(f"IMAGE_SEARCH_TOOL - Checking image: {json.dumps(image, indent=2)}")
                if image["imageUrl"].lower().endswith(('.jpg', '.jpeg')):
                    logging.debug(f"IMAGE_SEARCH_TOOL - Image URL extracted: {image['imageUrl']}")
                    return image["imageUrl"]
        else:
            logging.debug("IMAGE_SEARCH_TOOL - 'images' key not found in search results.")
        logging.debug("IMAGE_SEARCH_TOOL - No suitable image URL found.")
        return ""

    def is_valid_resolution(self, image_url: str) -> bool:
        try:
            logging.debug(f"IMAGE_SEARCH_TOOL - Checking resolution for image URL: {image_url}")
            response = requests.get(image_url)
            img = Image.open(BytesIO(response.content))
            width, height = img.size
            valid_resolution = 640 <= width <= 1280 and 480 <= height <= 720  # Example resolution range for low to medium
            if valid_resolution:
                logging.debug(f"IMAGE_SEARCH_TOOL - Image resolution is valid: {width}x{height}")
            else:
                logging.debug(f"IMAGE_SEARCH_TOOL - Image resolution is not valid: {width}x{height}")
            return valid_resolution
        except Exception as e:
            logging.error(f"IMAGE_SEARCH_TOOL - Error checking image resolution: {e}")
            return False

# Example usage
if __name__ == "__main__":
    tool = ImageSearchTool()
    search_term = "santa cruz, ca, boardwalk"
    result = tool._run(search_term=search_term)
    print("Image search result:", result)
