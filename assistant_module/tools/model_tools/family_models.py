from langchain_core.pydantic_v1 import BaseModel, Field
from typing import List, Optional

class Person(BaseModel):
    id: str
    name: str
    age: int
    gender: str
    role: str
    occupation: Optional[str] = None
    industry: Optional[str] = None
    education_level: Optional[str] = None
    marital_status: Optional[str] = None
    interests: Optional[List[str]] = None
    personality_traits: Optional[List[str]] = None
    lifestyle: Optional[List[str]] = None
    diet_preferences: Optional[List[str]] = None
    allergies: Optional[List[str]] = None
    fitness_level: Optional[str] = None
    technology_use: Optional[List[str]] = None
    travel_preferences: Optional[List[str]] = None
    financial_preferences: Optional[List[str]] = None
    communication_preferences: Optional[List[str]] = None
    cultural_background: Optional[str] = None
    language: Optional[List[str]] = None
    living_situation: Optional[List[str]] = None
    vehicle_ownership: Optional[str] = None
    social_media_use: Optional[List[str]] = None
    shopping_preferences: Optional[List[str]] = None
    entertainment_preferences: Optional[List[str]] = None
    current_city: Optional[str] = None
    current_country: Optional[str] = None
    frequent_travel_destinations: Optional[List[str]] = None
    preferred_climate: Optional[str] = None
    location_interests: Optional[List[str]] = None

class Pet(BaseModel):
    name: str
    age: int
    type: str

class FamilyMember(Person):
    pets: Optional[List[Pet]] = None

class Family(BaseModel):
    family_name: str
    members: List[FamilyMember]

# Example usage
family = Family(
    family_name="Hamilton",
    members=[
        FamilyMember(
            id="TWVtYmVyMDE=",
            name="Alexandra Hamilton",
            age=29,
            gender="Female",
            occupation="Software Developer",
            industry="Technology",
            education_level="Master's Degree",
            marital_status="Married",
            role="Mother",
            pets=[
                Pet(name="Buddy", age=3, type="Dog")
            ],
            interests=["coding", "hiking", "reading", "travel", "vegan cooking"],
            personality_traits=["introverted", "meticulous", "curious"],
            lifestyle=["active", "health-conscious", "environmentally aware"],
            diet_preferences=["vegan"],
            allergies=["peanuts"],
            fitness_level="high",
            technology_use=["high", "early adopter"],
            travel_preferences=["adventure", "culture", "eco-friendly"],
            financial_preferences=["savings-focused", "investment-curious"],
            communication_preferences=["email", "messaging apps"],
            cultural_background="American",
            language=["English", "Spanish"],
            living_situation=["city", "apartment"],
            vehicle_ownership="electric car",
            social_media_use=["high", "Facebook", "Instagram", "Twitter"],
            shopping_preferences=["online", "sustainable brands"],
            entertainment_preferences=["streaming services", "live concerts", "theater"],
            current_city="San Francisco",
            current_country="USA",
            frequent_travel_destinations=["New York", "Berlin", "Tokyo"],
            preferred_climate="mild",
            location_interests=["urban", "cultural sites", "parks"]
        ),
        FamilyMember(
            id="TWVtYmVyMDI=",
            name="John Hamilton",
            age=32,
            gender="Male",
            occupation="Data Scientist",
            industry="Technology",
            education_level="Bachelor's Degree",
            marital_status="Married",
            role="Father",
            pets=[
                Pet(name="Buddy", age=3, type="Dog")
            ],
            interests=["data analysis", "running", "cooking", "travel", "photography"],
            personality_traits=["analytical", "outgoing", "curious"],
            lifestyle=["active", "tech-savvy", "family-oriented"],
            diet_preferences=["omnivore"],
            allergies=[],
            fitness_level="medium",
            technology_use=["high", "early adopter"],
            travel_preferences=["adventure", "nature", "culture"],
            financial_preferences=["investment-focused", "savings-conscious"],
            communication_preferences=["phone", "email"],
            cultural_background="American",
            language=["English"],
            living_situation=["city", "apartment"],
            vehicle_ownership="electric car",
            social_media_use=["medium", "Facebook", "LinkedIn"],
            shopping_preferences=["online", "tech gadgets"],
            entertainment_preferences=["movies", "concerts", "sports events"],
            current_city="San Francisco",
            current_country="USA",
            frequent_travel_destinations=["London", "Paris", "Tokyo"],
            preferred_climate="mild",
            location_interests=["urban", "nature trails", "parks"]
        ),
        FamilyMember(
            id="TWVtYmVyMDM=",
            name="C",
            age=8,
            gender="Male",
            role="Child"
        ),
        FamilyMember(
            id="TWVtYmVyMDQ=",
            name="J",
            age=10,
            gender="Male",
            role="Child"
        )
    ]
)

print(family.json(indent=4))
