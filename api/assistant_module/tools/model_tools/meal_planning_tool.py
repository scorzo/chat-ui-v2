from langchain_core.pydantic_v1 import BaseModel, Field
from langchain.tools import BaseTool
from typing import Optional, Type, List
from langchain.callbacks.manager import (
    AsyncCallbackManagerForToolRun,
    CallbackManagerForToolRun,
)
from datetime import datetime
import pytz
import os
from api.assistant_module.tools.datanode_package.datanode import generate_datanode_from_model_with_tools
from api.assistant_module.tools.misc_tools.image_search_tool import ImageSearchTool
from api.assistant_module.tools.misc_tools.web_search_tool import WebSearchTool
from api.assistant_module.tools.calendar_package.list_calendar_events import ListEventsTool
from api.assistant_module.tools.datanode_package.prune_node_tool import PruneNodeTool
import asyncio

class MenuItem(BaseModel):
    meal: str = Field(description="Meal description (e.g., breakfast, lunch, dinner)")
    recipe: str = Field(description="Recipe for the meal")
    ingredients: List[str] = Field(description="List of ingredients needed")
    image_url: str = Field(description="URL of the meal image")

class MenuIdeas(BaseModel):
    name: str = Field(description="Name of the daily menu")
    description: str = Field(description="Description of the daily menu")
    date: str = Field(description="Date in ISO 8601 format")
    greeting: str = Field(description="Personalized menu related greeting for the day")
    family_menu_ideas: List[MenuItem] = Field(description="Family menu ideas for the day")
    menu_insights: str = Field(description="Insights and suggestions based on family menu ideas")

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
Based on my personal information, create a personalized daily menu for my family for the requested date including:
- breakfast
- lunch
- dinner
Include recipes and a list of ingredients for each meal. Include an image URL for each menu item.
Please include the date in the name.
"""

DEFAULT_PARENT_NODE_ID = "U2hvcHBpbmdMaXN0Tm9yy443"

class MealPlanningParams(BaseModel):
    prompt: Optional[str] = Field(default=DEFAULT_PROMPT, description="The prompt to send to the language model for generating the datanode.")
    parent_node_id: Optional[str] = Field(default=DEFAULT_PARENT_NODE_ID, description="The ID of the parent target node that contains the children array where the datanode will be added.")

class MealPlanningTool(BaseTool):
    name = "meal_planning_tool"
    description = "This tool generates a new meal planning datanode based on the user's prompt and adds it under the specified parent node in the nodes.json file."
    args_schema: Type[BaseModel] = MealPlanningParams

    def _run(
            self, prompt: Optional[str] = DEFAULT_PROMPT, parent_node_id: Optional[str] = DEFAULT_PARENT_NODE_ID, run_manager: Optional[CallbackManagerForToolRun] = None
    ) -> dict:
        """Use the tool."""
        return self.generate_datanode(prompt, parent_node_id)

    async def _arun(
            self, prompt: Optional[str] = DEFAULT_PROMPT, parent_node_id: Optional[str] = DEFAULT_PARENT_NODE_ID, run_manager: Optional[AsyncCallbackManagerForToolRun] = None
    ) -> dict:
        """Use the tool asynchronously."""
        return await asyncio.to_thread(self.generate_datanode, prompt, parent_node_id)

    def generate_datanode(self, prompt: str, parent_node_id: str) -> dict:
        """
        Generates a datanode using the provided prompt and adds it to the children array of the specified node in the nodes.json file.
        """
        my_time, my_timezone = get_current_time_and_timezone(os.environ['TIMEZONE'])
        system_instructions = f"""
        You are a personal AI assistant designed to create family meal plans. It's {my_time} in the {my_timezone} timezone.
        Respond with the data in a JSON object format without enclosing it in a string. 
        Only provide the JSON object.
        """

        return generate_datanode_from_model_with_tools(
            prompt=prompt,
            model_name="gpt-4o",
            pydantic_model=MenuIdeas,
            tools=[ImageSearchTool(),PruneNodeTool(),WebSearchTool(), ListEventsTool()],  # Add appropriate tools if needed
            node_id=parent_node_id,
            node_type="MealPlanningModalContent",
            system_instructions=system_instructions
        )

# Example usage
if __name__ == "__main__":
    tool = MealPlanningTool()
    result = tool._run()
    print("Generated datanode:", result)
