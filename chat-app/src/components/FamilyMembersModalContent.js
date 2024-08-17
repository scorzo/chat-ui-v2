import React, { useState } from 'react';
import './DefaultModalContent.css'; // Reference to the stylesheet
import defaultImage from './defaultImage.jpg'; // Default image for all instances

const FamilyMembersModalContent = ({ node, sunburstGraphRef, onRequestClose }) => {
    const { details } = node;
    const [isCompactView, setIsCompactView] = useState(true);

    const toggleView = (event) => {
        event.preventDefault();
        setIsCompactView(!isCompactView);
    };

    return (
        <div className="modal-container">
            <div className="header">
                <h1>{details.family_name} Family</h1>
                <a href="#" className="toggle-link" onClick={toggleView}>
                    {isCompactView ? 'Expanded View' : 'Compact View'}
                </a>
            </div>
            <div className={`content ${isCompactView ? 'compact' : ''}`}>
                {details.members.map((member, index) => (
                    <div key={index} className="member-section">
                        <h2>{member.name}</h2>
                        {isCompactView ? (
                            <table className="compact-table">
                                <thead>
                                <tr>
                                    <th>Attribute</th>
                                    <th>Value</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>Age</td>
                                    <td>{member.age}</td>
                                </tr>
                                <tr>
                                    <td>Gender</td>
                                    <td>{member.gender}</td>
                                </tr>
                                <tr>
                                    <td>Role</td>
                                    <td>{member.role}</td>
                                </tr>
                                {member.occupation && (
                                    <tr>
                                        <td>Occupation</td>
                                        <td>{member.occupation}</td>
                                    </tr>
                                )}
                                {member.industry && (
                                    <tr>
                                        <td>Industry</td>
                                        <td>{member.industry}</td>
                                    </tr>
                                )}
                                {member.education_level && (
                                    <tr>
                                        <td>Education Level</td>
                                        <td>{member.education_level}</td>
                                    </tr>
                                )}
                                {member.marital_status && (
                                    <tr>
                                        <td>Marital Status</td>
                                        <td>{member.marital_status}</td>
                                    </tr>
                                )}
                                {member.pets && (
                                    <tr>
                                        <td>Pets</td>
                                        <td>{member.pets.map(pet => pet.name).join(', ')}</td>
                                    </tr>
                                )}
                                {member.interests && (
                                    <tr>
                                        <td>Interests</td>
                                        <td>{member.interests.join(', ')}</td>
                                    </tr>
                                )}
                                {member.personality_traits && (
                                    <tr>
                                        <td>Personality Traits</td>
                                        <td>{member.personality_traits.join(', ')}</td>
                                    </tr>
                                )}
                                {member.lifestyle && (
                                    <tr>
                                        <td>Lifestyle</td>
                                        <td>{member.lifestyle.join(', ')}</td>
                                    </tr>
                                )}
                                {member.diet_preferences && (
                                    <tr>
                                        <td>Diet Preferences</td>
                                        <td>{member.diet_preferences.join(', ')}</td>
                                    </tr>
                                )}
                                {member.allergies && (
                                    <tr>
                                        <td>Allergies</td>
                                        <td>{member.allergies.join(', ')}</td>
                                    </tr>
                                )}
                                {member.fitness_level && (
                                    <tr>
                                        <td>Fitness Level</td>
                                        <td>{member.fitness_level}</td>
                                    </tr>
                                )}
                                {member.technology_use && (
                                    <tr>
                                        <td>Technology Use</td>
                                        <td>{member.technology_use.join(', ')}</td>
                                    </tr>
                                )}
                                {member.travel_preferences && (
                                    <tr>
                                        <td>Travel Preferences</td>
                                        <td>{member.travel_preferences.join(', ')}</td>
                                    </tr>
                                )}
                                {member.financial_preferences && (
                                    <tr>
                                        <td>Financial Preferences</td>
                                        <td>{member.financial_preferences.join(', ')}</td>
                                    </tr>
                                )}
                                {member.communication_preferences && (
                                    <tr>
                                        <td>Communication Preferences</td>
                                        <td>{member.communication_preferences.join(', ')}</td>
                                    </tr>
                                )}
                                {member.cultural_background && (
                                    <tr>
                                        <td>Cultural Background</td>
                                        <td>{member.cultural_background}</td>
                                    </tr>
                                )}
                                {member.language && (
                                    <tr>
                                        <td>Language</td>
                                        <td>{member.language.join(', ')}</td>
                                    </tr>
                                )}
                                {member.living_situation && (
                                    <tr>
                                        <td>Living Situation</td>
                                        <td>{member.living_situation.join(', ')}</td>
                                    </tr>
                                )}
                                {member.vehicle_ownership && (
                                    <tr>
                                        <td>Vehicle Ownership</td>
                                        <td>{member.vehicle_ownership}</td>
                                    </tr>
                                )}
                                {member.social_media_use && (
                                    <tr>
                                        <td>Social Media Use</td>
                                        <td>{member.social_media_use.join(', ')}</td>
                                    </tr>
                                )}
                                {member.shopping_preferences && (
                                    <tr>
                                        <td>Shopping Preferences</td>
                                        <td>{member.shopping_preferences.join(', ')}</td>
                                    </tr>
                                )}
                                {member.entertainment_preferences && (
                                    <tr>
                                        <td>Entertainment Preferences</td>
                                        <td>{member.entertainment_preferences.join(', ')}</td>
                                    </tr>
                                )}
                                {member.current_city && (
                                    <tr>
                                        <td>Current City</td>
                                        <td>{member.current_city}</td>
                                    </tr>
                                )}
                                {member.current_country && (
                                    <tr>
                                        <td>Current Country</td>
                                        <td>{member.current_country}</td>
                                    </tr>
                                )}
                                {member.frequent_travel_destinations && (
                                    <tr>
                                        <td>Frequent Travel Destinations</td>
                                        <td>{member.frequent_travel_destinations.join(', ')}</td>
                                    </tr>
                                )}
                                {member.preferred_climate && (
                                    <tr>
                                        <td>Preferred Climate</td>
                                        <td>{member.preferred_climate}</td>
                                    </tr>
                                )}
                                {member.location_interests && (
                                    <tr>
                                        <td>Location Interests</td>
                                        <td>{member.location_interests.join(', ')}</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        ) : (
                            <div className="card">
                                <div className="card-content">
                                    <p>Age: {member.age}</p>
                                    <p>Gender: {member.gender}</p>
                                    <p>Role: {member.role}</p>
                                    {member.occupation && <p>Occupation: {member.occupation}</p>}
                                    {member.industry && <p>Industry: {member.industry}</p>}
                                    {member.education_level && <p>Education Level: {member.education_level}</p>}
                                    {member.marital_status && <p>Marital Status: {member.marital_status}</p>}
                                    {member.pets && member.pets.length > 0 && (
                                        <div>
                                            <h4>Pets</h4>
                                            <ul>
                                                {member.pets.map((pet, index) => (
                                                    <li key={index}>{pet.name}, Age: {pet.age}, Type: {pet.type}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {member.interests && <p>Interests: {member.interests.join(', ')}</p>}
                                    {member.personality_traits && <p>Personality Traits: {member.personality_traits.join(', ')}</p>}
                                    {member.lifestyle && <p>Lifestyle: {member.lifestyle.join(', ')}</p>}
                                    {member.diet_preferences && <p>Diet Preferences: {member.diet_preferences.join(', ')}</p>}
                                    {member.allergies && <p>Allergies: {member.allergies.join(', ')}</p>}
                                    {member.fitness_level && <p>Fitness Level: {member.fitness_level}</p>}
                                    {member.technology_use && <p>Technology Use: {member.technology_use.join(', ')}</p>}
                                    {member.travel_preferences && <p>Travel Preferences: {member.travel_preferences.join(', ')}</p>}
                                    {member.financial_preferences && <p>Financial Preferences: {member.financial_preferences.join(', ')}</p>}
                                    {member.communication_preferences && <p>Communication Preferences: {member.communication_preferences.join(', ')}</p>}
                                    {member.cultural_background && <p>Cultural Background: {member.cultural_background}</p>}
                                    {member.language && <p>Language: {member.language.join(', ')}</p>}
                                    {member.living_situation && <p>Living Situation: {member.living_situation.join(', ')}</p>}
                                    {member.vehicle_ownership && <p>Vehicle Ownership: {member.vehicle_ownership}</p>}
                                    {member.social_media_use && <p>Social Media Use: {member.social_media_use.join(', ')}</p>}
                                    {member.shopping_preferences && <p>Shopping Preferences: {member.shopping_preferences.join(', ')}</p>}
                                    {member.entertainment_preferences && <p>Entertainment Preferences: {member.entertainment_preferences.join(', ')}</p>}
                                    {member.current_city && <p>Current City: {member.current_city}</p>}
                                    {member.current_country && <p>Current Country: {member.current_country}</p>}
                                    {member.frequent_travel_destinations && <p>Frequent Travel Destinations: {member.frequent_travel_destinations.join(', ')}</p>}
                                    {member.preferred_climate && <p>Preferred Climate: {member.preferred_climate}</p>}
                                    {member.location_interests && <p>Location Interests: {member.location_interests.join(', ')}</p>}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FamilyMembersModalContent;
