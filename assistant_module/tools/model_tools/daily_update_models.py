from langchain_core.pydantic_v1 import BaseModel, Field
from typing import List, Optional

class WeatherReport(BaseModel):
    temperature: str = Field(description="Current temperature")
    condition: str = Field(description="Weather condition (e.g., sunny, rainy)")
    forecast: str = Field(description="Weather forecast for the day")
    insights: str = Field(description="Insights and suggestions based on the weather report")

class ScheduleItem(BaseModel):
    time: str = Field(description="Scheduled time")
    event: str = Field(description="Event description")

class HouseholdTask(BaseModel):
    task: str = Field(description="Task description")
    priority: Optional[str] = Field(description="Priority level of the task (e.g., high, medium, low)", default=None)

class BillReminder(BaseModel):
    bill_name: str = Field(description="Name of the bill")
    due_date: str = Field(description="Due date of the bill")
    amount_due: float = Field(description="Amount due for the bill")
    currency: str = Field(description="Currency of the amount due")

class FinanceUpdate(BaseModel):
    payday_alert: Optional[str] = Field(description="Payday alert message", default=None)
    stock_market_suggestions: Optional[List[str]] = Field(description="List of stock market suggestions", default=None)
    bills_coming_due: Optional[List[BillReminder]] = Field(description="List of bills coming due", default=None)
    insights: str = Field(description="Insights and suggestions based on finance updates")

class DailySuggestion(BaseModel):
    type: str = Field(description="Type of suggestion (e.g., article, movie, podcast)")
    title: str = Field(description="Title of the suggestion")
    description: str = Field(description="Description of the suggestion")
    url: Optional[str] = Field(description="URL for the suggestion", default=None)

class Reminder(BaseModel):
    event: str = Field(description="Event description (e.g., birthday, anniversary)")
    date: str = Field(description="Date of the event")

class LearningPathSuggestion(BaseModel):
    subject: str = Field(description="Subject of the learning path")
    resource: str = Field(description="Resource for the learning path (e.g., book, course)")
    url: Optional[str] = Field(description="URL for the resource", default=None)

class MenuItem(BaseModel):
    meal: str = Field(description="Meal description (e.g., breakfast, lunch, dinner)")
    recipe: str = Field(description="Recipe for the meal")
    ingredients: List[str] = Field(description="List of ingredients needed")

class DailyUpdate(BaseModel):
    name: str = Field(description="Name of the daily update")
    description: str = Field(description="Description of the daily update")
    date: str = Field(description="Date of the daily update in ISO 8601 format")
    greeting: str = Field(description="Personalized greeting for the day")
    weather_report: WeatherReport = Field(description="Weather report for the day")
    schedule_today: List[ScheduleItem] = Field(description="List of scheduled items for today")
    schedule_insights: str = Field(description="Insights and suggestions based on today's schedule")
    household_tasks: List[HouseholdTask] = Field(description="List of household task suggestions")
    household_tasks_insights: str = Field(description="Insights and suggestions based on household tasks")
    finance_updates: FinanceUpdate = Field(description="Finance updates including bills and payday alerts")
    daily_suggestions: List[DailySuggestion] = Field(description="Daily article, movie, podcast suggestions")
    daily_suggestions_insights: str = Field(description="Insights and suggestions based on daily suggestions")
    reminders: List[Reminder] = Field(description="Birthday and anniversary reminders")
    reminders_insights: str = Field(description="Insights and suggestions based on reminders")
    inspirational_quote: str = Field(description="Inspirational quote for the day")
    learning_path_suggestions: List[LearningPathSuggestion] = Field(description="Daily learning path suggestions")
    learning_path_insights: str = Field(description="Insights and suggestions based on learning path suggestions")
    family_menu_ideas: List[MenuItem] = Field(description="Family menu ideas for the day")
    menu_insights: str = Field(description="Insights and suggestions based on family menu ideas")
