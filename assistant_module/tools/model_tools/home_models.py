from langchain_core.pydantic_v1 import BaseModel, Field
from typing import List, Optional, Dict, Any, Tuple

class ParkingInformation(BaseModel):
    garage_minimum: int
    garage_maximum: int
    parking_description: str
    ev_hookup_type: str
    garage_spaces: int

class VirtualTour(BaseModel):
    branded_tour: str
    unbranded_tour: str

class BedroomInformation(BaseModel):
    bedrooms_minimum: int
    bedrooms_maximum: int
    bedroom_types: List[str]

class BathroomInformation(BaseModel):
    baths_full: int
    baths_half: int
    bathroom_description: str

class InteriorFeatures(BaseModel):
    laundry: List[str]
    flooring: List[str]
    has_fireplace: bool
    fireplace_description: str
    fireplaces_minimum: int

class HeatingCoolingInformation(BaseModel):
    cooling: str
    heating: str

class MaintenanceHistory(BaseModel):
    date: str
    notes: Optional[str] = None

class HVACSystem(BaseModel):
    type: str
    age: int
    maintenance_history: List[MaintenanceHistory]

class Plumbing(BaseModel):
    pipes: Dict[str, Any]
    water_heater: Dict[str, Any]
    fixtures: List[Dict[str, Any]]

class ElectricalSystem(BaseModel):
    circuit_breaker: Dict[str, Any]
    wiring: Dict[str, Any]
    appliances: List[Dict[str, Any]]

class RoofAndInsulation(BaseModel):
    roof: Dict[str, Any]
    insulation: Dict[str, Any]

class SmartDevice(BaseModel):
    name: str
    manufacturer: str
    model: str
    connected: bool

class Plumbing(BaseModel):
    pipes: Dict[str, Any]
    water_heater: Dict[str, Any]
    fixtures: List[Dict[str, Any]]

class ElectricalSystem(BaseModel):
    circuit_breaker: Dict[str, Any]
    wiring: Dict[str, Any]
    appliances: List[Dict[str, Any]]

class RoofAndInsulation(BaseModel):
    roof: Dict[str, Any]
    insulation: Dict[str, Any]

class SmartDevice(BaseModel):
    name: str
    manufacturer: str
    model: str
    connected: bool

class Dimensions(BaseModel):
    length: float
    width: float
    height: float

class Room(BaseModel):
    name: str
    dimensions: Dimensions
    wall_material: str
    description: Optional[str] = None

class BuildingInformation(BaseModel):
    building_type: str
    construction_type: List[str]

class PropertyFeatures(BaseModel):
    amenities: List[str]
    communication: str
    living_sq_ft: int
    security_features: str

class LotInformation(BaseModel):
    lot_acres: float
    lot_description: str
    lot_size_area_minimum_units: str
    lot_size_area_maximum_units: str
    lot_size_source: str
    zoning: str

class UtilityInformation(BaseModel):
    energy_features: str
    sewer_septic: str
    utilities: str

class WaterInformation(BaseModel):
    water: str

class MultiUnitInformation(BaseModel):
    stories: int

class SchoolInformation(BaseModel):
    elementary_school: str
    elementary_school_district: str
    middle_school: str
    high_school: str
    high_school_district: str

class HomeData(BaseModel):
    home_id: str
    name: str
    description: str
    address: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    parking: Optional[ParkingInformation] = None
    virtual_tour: Optional[VirtualTour] = None
    bedroom_info: Optional[BedroomInformation] = None
    bathroom_info: Optional[BathroomInformation] = None
    interior_features: Optional[InteriorFeatures] = None
    heating_cooling: Optional[HeatingCoolingInformation] = None
    hvac: Optional[HVACSystem] = None
    plumbing: Optional[Plumbing] = None
    electrical: Optional[ElectricalSystem] = None
    roof_and_insulation: Optional[RoofAndInsulation] = None
    smart_devices: Optional[List[SmartDevice]] = None
    building_info: Optional[BuildingInformation] = None
    property_features: Optional[PropertyFeatures] = None
    lot_info: Optional[LotInformation] = None
    utility_info: Optional[UtilityInformation] = None
    water_info: Optional[WaterInformation] = None
    multi_unit_info: Optional[MultiUnitInformation] = None
    school_info: Optional[SchoolInformation] = None
    structure: Optional[Dict[str, Any]] = Field(default_factory=dict)
