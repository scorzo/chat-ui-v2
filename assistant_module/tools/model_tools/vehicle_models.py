from langchain_core.pydantic_v1 import BaseModel, Field
from typing import List, Optional

class MaintenanceHistory(BaseModel):
    date: str
    notes: Optional[str] = None

class Tire(BaseModel):
    brand: str
    model: str
    size: str
    age: int

class PrimaryDriver(BaseModel):
    name: str
    license_number: str
    age: int
    driving_experience_years: int

class Vehicle(BaseModel):
    vehicle_id: str
    name: str
    make: str
    model: str
    year: int
    vin: str
    color: str
    primary_drivers: List[PrimaryDriver]
    average_daily_usage_km: float
    tires: List[Tire]
    maintenance_history: List[MaintenanceHistory]

class VehiclesData(BaseModel):
    family_id: str
    name: str
    description: str
    start_date: str
    end_date: str
    vehicles: List[Vehicle]