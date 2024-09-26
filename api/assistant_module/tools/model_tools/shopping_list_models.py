from langchain_core.pydantic_v1 import BaseModel, Field
from typing import List, Optional

class Item(BaseModel):
    item_id: str = Field(description="Unique identifier for the item")
    name: str = Field(description="Name of the item")
    quantity: int = Field(description="Quantity to be purchased")
    unit: str = Field(description="Unit of measurement for the item (e.g., kg, lb, count)")
    price_per_unit: float = Field(description="Price per unit of the item")
    total_price: float = Field(description="Total price for the item (quantity * price_per_unit)")
    category: str = Field(description="Category of the item (e.g., grocery, electronics)")
    priority: Optional[str] = Field(description="Priority level of the item (e.g., high, medium, low)", default=None)
    notes: Optional[str] = Field(description="Additional notes about the item", default=None)
    image_url: Optional[str] = Field(description="URL of the item image", default=None)

class Recurrence(BaseModel):
    frequency: str = Field(description="Frequency of the order (e.g., daily, weekly, monthly)")
    start_date: str = Field(description="Start date of the recurrence in ISO 8601 format")
    end_date: Optional[str] = Field(description="End date of the recurrence in ISO 8601 format", default=None)

class Order(BaseModel):
    order_id: str = Field(description="Unique identifier for the order")
    user_id: str = Field(description="Unique identifier for the user placing the order")
    items: List[Item] = Field(description="List of items to be ordered")
    order_date: str = Field(description="Date the order is placed in ISO 8601 format")
    delivery_date: Optional[str] = Field(description="Expected delivery date in ISO 8601 format", default=None)
    total_price: float = Field(description="Total price for the entire order")
    currency: str = Field(description="Currency of the total price")
    delivery_address: str = Field(description="Address where the order will be delivered")
    recurrence: Optional[Recurrence] = Field(description="Recurrence details if the order is recurring", default=None)
    notes: Optional[str] = Field(description="Additional notes about the order", default=None)
    order_url: Optional[str] = Field(description="URL to view or manage the order", default=None)

class ShoppingList(BaseModel):
    list_id: str = Field(description="Unique identifier for the shopping list")
    user_id: str = Field(description="Unique identifier for the user creating the list")
    name: str = Field(description="Name of the shopping list")
    description: Optional[str] = Field(description="Description of the shopping list", default=None)
    orders: List[Order] = Field(description="List of orders associated with this shopping list")
    notes: Optional[str] = Field(description="Additional notes about the shopping list", default=None)
