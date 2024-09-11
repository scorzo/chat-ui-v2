from langchain_core.pydantic_v1 import BaseModel, Field
from typing import List, Optional

class WeatherReport(BaseModel):
    location: str = Field(description="Location for the weather report")
    temperature: str = Field(description="Current temperature")
    condition: str = Field(description="Weather condition (e.g., sunny, rainy)")
    forecast: str = Field(description="Weather forecast for the day")
    insights: str = Field(description="Insights and suggestions based on the weather report")

class ScheduleItem(BaseModel):
    time: str = Field(description="Scheduled time")
    event: str = Field(description="Event description")

class ScheduleToday(BaseModel):
    schedule: List[ScheduleItem] = Field(description="List of scheduled items for today")
    insights: str = Field(description="Insights and suggestions based on today's schedule")

class RecurringDetail(BaseModel):
    day: Optional[int] = Field(None, description="Day of the month when the item recurs")
    amount: Optional[float] = Field(None, description="Amount for each recurrence of the item")

class IncomeItem(BaseModel):
    name: str = Field(description="Name of the income source")
    source: str = Field(description="Source of the income")
    comments: Optional[str] = Field(default='', description="Additional comments for the income source")
    destination_account: Optional[str] = Field(None, description="Destination account for the income")
    recurring_detail: Optional[RecurringDetail] = Field(None, description="Recurring details for the income")

class ExpenseItem(BaseModel):
    name: str = Field(description="Name of the expense")
    category: str = Field(description="Category of the expense (e.g., gas, food, entertainment)")
    comments: Optional[str] = Field(default='', description="Additional comments for the expense")
    recurring_detail: Optional[RecurringDetail] = Field(None, description="Recurring details for the expense")

class LiabilityItem(BaseModel):
    name: str = Field(description="Name of the liability")
    type: str = Field(description="Type of liability (e.g., loan, credit card, mortgage)")
    balance: float = Field(description="Balance of the liability")
    minimum_payment: float = Field(description="Minimum payment for the liability")
    recurring_detail: Optional[RecurringDetail] = Field(None, description="Recurring details for the liability")
    comments: Optional[str] = Field(default='', description="Additional comments for the liability")

class FinanceUpdate(BaseModel):
    income: List[IncomeItem] = Field(default_factory=list, description="Upcoming income transactions, grouped and sorted by type and date")
    expenses: List[ExpenseItem] = Field(default_factory=list, description="Upcoming expenses, including regular expenses and subscriptions, grouped and sorted by type and date")
    liabilities: List[LiabilityItem] = Field(default_factory=list, description="List of upcoming liabilities, including loans, credit cards, and mortgages")
    insights: str = Field(description="Insights and suggestions based on finance updates")

class DailyDigestSuggestion(BaseModel):
    type: str = Field(description="Type of suggestion (e.g., article, movie, podcast)")
    title: str = Field(description="Title of the suggestion")
    description: str = Field(description="Description of the suggestion")
    url: Optional[str] = Field(description="URL for the suggestion", default=None)

class Reminder(BaseModel):
    event: str = Field(description="Event description (e.g., birthday, anniversary)")
    date: str = Field(description="Date of the event")

class EventReminders(BaseModel):
    reminders: List[Reminder] = Field(description="Event reminders for the upcoming month")
    insights: str = Field(description="Insights and suggestions based on event reminders")

class WorkGoal(BaseModel):
    goal: str = Field(description="Work-related goal")
    comments: Optional[str] = Field(description="Comments or notes related to the work goal", default=None)

class FamilyGoal(BaseModel):
    goal: str = Field(description="Family-related goal")
    comments: Optional[str] = Field(description="Comments or notes related to the family goal", default=None)

class MenuItem(BaseModel):
    meal: str = Field(description="Meal description (e.g., breakfast, lunch, dinner)")
    recipe: str = Field(description="Recipe for the meal")
    ingredients: List[str] = Field(description="List of ingredients needed")

class FamilyMenuIdeas(BaseModel):
    menu: List[MenuItem] = Field(description="Family menu ideas for the day")
    insights: str = Field(description="Insights and suggestions based on family menu ideas")

class HouseholdTask(BaseModel):
    task: str = Field(description="Task description")
    priority: Optional[str] = Field(description="Priority level of the task (e.g., high, medium, low)", default=None)

class HouseholdTasks(BaseModel):
    tasks: List[HouseholdTask] = Field(description="List of household tasks for the day")
    insights: str = Field(description="Insights and suggestions based on household tasks")

class DailyUpdate(BaseModel):
    name: str = Field(description="Name of the daily update")
    description: str = Field(description="Description of the daily update")
    date: str = Field(description="Date of the daily update in ISO 8601 format")
    greeting: str = Field(description="Personalized greeting for the day with highlights from the daily update")
    weather_report: WeatherReport = Field(description="Weather report for the day with location and insights")
    schedule_today: ScheduleToday = Field(description="Today's schedule with insights")
    finance_updates: FinanceUpdate = Field(description="Finance updates including income, expenses, and liabilities with insights")
    daily_digest_suggestions: List[DailyDigestSuggestion] = Field(description="Entertainment and informational suggestions for the day")
    event_reminders: EventReminders = Field(description="Event reminders for the upcoming month with insights")
    work_goals: List[WorkGoal] = Field(description="Work-related goals with comments")
    family_goals: List[FamilyGoal] = Field(description="Family-related goals with comments")
    family_menu_ideas: FamilyMenuIdeas = Field(description="Family menu ideas for the day with insights")
    household_tasks: HouseholdTasks = Field(description="Household tasks for the day with insights")
    closing_greeting: str = Field(description="Motivational closing statement based on the user's context")
    inspirational_quote: str = Field(description="Daily inspirational quote")
