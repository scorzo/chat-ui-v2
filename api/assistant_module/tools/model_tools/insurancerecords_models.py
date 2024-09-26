from langchain_core.pydantic_v1 import BaseModel, Field
from typing import List, Optional

class CoverageDetail(BaseModel):
    type: str
    amount: float
    notes: Optional[str] = None

class InsuranceRecord(BaseModel):
    policy_number: str
    provider: str
    start_date: str
    end_date: str
    coverage: List[CoverageDetail]
    premium: float
    deductible: float
    notes: Optional[str] = None

class HouseInsurance(BaseModel):
    house_id: str
    address: str
    insurance: InsuranceRecord

class CarInsurance(BaseModel):
    vehicle_id: str
    make: str
    model: str
    year: int
    vin: str
    insurance: InsuranceRecord

class RentersInsurance(BaseModel):
    rental_id: str
    address: str
    insurance: InsuranceRecord

class FloodInsurance(BaseModel):
    property_id: str
    address: str
    insurance: InsuranceRecord

class EarthquakeInsurance(BaseModel):
    property_id: str
    address: str
    insurance: InsuranceRecord

class UmbrellaInsurance(BaseModel):
    policy_id: str
    insurance: InsuranceRecord

class PetInsurance(BaseModel):
    pet_id: str
    pet_name: str
    insurance: InsuranceRecord

class InsuranceData(BaseModel):
    family_id: str
    name: str
    description: str
    start_date: str
    end_date: str
    house_insurance: List[HouseInsurance]
    car_insurance: List[CarInsurance]
    renters_insurance: List[RentersInsurance]
    flood_insurance: List[FloodInsurance]
    earthquake_insurance: List[EarthquakeInsurance]
    umbrella_insurance: List[UmbrellaInsurance]
    pet_insurance: List[PetInsurance]
