from pydantic import BaseModel, Field
from langchain.tools import BaseTool
from typing import Optional, Type
from langchain.callbacks.manager import (
    AsyncCallbackManagerForToolRun,
    CallbackManagerForToolRun,
)
from api.assistant_module.tools.datanode_package.datanode import generate_datanode_from_model_with_tools
from api.assistant_module.tools.misc_tools.image_search_tool import ImageSearchTool
from api.assistant_module.tools.location_coordinates.location_coordinates import LocationCoordinatesTool
from api.assistant_module.tools.events_package.ticketmaster import TicketmasterEventsTool
from api.assistant_module.tools.hotel_finder.amadeus_list import AmadeusHotelListTool
from api.assistant_module.tools.hotel_finder.amadeus_offers import AmadeusHotelOffersTool

from .itinerary_models import Itinerary
import os
from datetime import datetime
import pytz
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

class ItineraryParams(BaseModel):
    prompt: str = Field(description="The prompt to send to the language model for generating the itinerary datanode.")
    parent_node_id: str = Field(description="The ID of the parent target node that contains the children array where the datanode will be added.")

class ItineraryTool(BaseTool):
    name = "itinerary_tool"
    description = "This tool generates a new itinerary datanode based on the user's prompt and adds it under the Family Outings and activities node in the nodes.json file. Use this tool only for creating new itinerary datanodes. For modifying existing itinerary datanodes, use the edit_itinerary_tool."
    args_schema: Type[BaseModel] = ItineraryParams

    def _run(
            self, prompt: str, parent_node_id: str, run_manager: Optional[CallbackManagerForToolRun] = None
    ) -> dict:
        """Use the tool."""
        return self.generate_datanode(prompt, parent_node_id)

    async def _arun(
            self, prompt: str, parent_node_id: str, run_manager: Optional[AsyncCallbackManagerForToolRun] = None
    ) -> dict:
        """Use the tool asynchronously."""
        return await asyncio.to_thread(self.generate_datanode, prompt, parent_node_id)

    def generate_datanode(self, prompt: str, parent_node_id: str) -> dict:
        """
        Generates a datanode using the provided prompt and adds it to the children array of the specified node in the nodes.json file.
        """
        my_time, my_timezone = get_current_time_and_timezone(os.environ['TIMEZONE'])
        prompt += "Always provide image URLs and always use the image search tool to retrieve those real image URLs for all activities, etc. Do not, under any circumstances, provide made up image URLs or other made up location or event data."

        system_instructions = f"""
        You are a personal AI assistant designed to create itinerary plans. It's {my_time} in the {my_timezone} timezone.
        
        Respond with the data in a JSON object format without enclosing it in a string. 
        Only provide the JSON object.
        """

        return generate_datanode_from_model_with_tools(
            prompt=prompt,
            model_name="gpt-4o",
            pydantic_model=Itinerary,
            tools=[TicketmasterEventsTool(), AmadeusHotelListTool(), AmadeusHotelOffersTool(), LocationCoordinatesTool(), ImageSearchTool()],  # Add appropriate tools if needed
            node_id=parent_node_id,
            node_type="ItineraryModalContent",
            system_instructions=system_instructions
        )

# Example usage
if __name__ == "__main__":
    tool = ItineraryTool()
    result = tool._run(prompt="Plan a weekend trip to the mountains", parent_node_id="family_outings_vacations_node_id")
    print("Generated datanode:", result)
