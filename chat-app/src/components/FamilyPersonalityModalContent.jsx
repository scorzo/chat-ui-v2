import React, { useState } from 'react';
import './DefaultModalContent.css'; // Reference to the stylesheet
import defaultImage from './defaultImage.jpg'; // Default image for all instances

const FamilyPersonalityModalContent = ({ node, sunburstGraphRef, onRequestClose }) => {
    const { details } = node;
    const [isCompactView, setIsCompactView] = useState(true);

    const toggleView = (event) => {
        event.preventDefault();
        setIsCompactView(!isCompactView);
    };

    return (
        <div className="modal-container">
            <div className="header">
                <h1>{details.family_name} Family Personality Information</h1>
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
                                    <td>Personality Type</td>
                                    <td>{member.assessment?.personality_type || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td>Description</td>
                                    <td>{member.assessment?.description || 'N/A'}</td>
                                </tr>
                                </tbody>
                            </table>
                        ) : (
                            <div className="card">
                                <div className="card-content">
                                    <p>Age: {member.age}</p>
                                    <p>Gender: {member.gender}</p>
                                    <h3>Personality Assessment</h3>
                                    {member.assessment ? (
                                        <div>
                                            <p>Personality Type: {member.assessment.personality_type}</p>
                                            <p>Description: {member.assessment.description}</p>
                                            <h4>Scores</h4>
                                            <ul>
                                                <li>Extraversion: {member.score?.extraversion}</li>
                                                <li>Introversion: {member.score?.introversion}</li>
                                                <li>Sensing: {member.score?.sensing}</li>
                                                <li>Intuition: {member.score?.intuition}</li>
                                                <li>Thinking: {member.score?.thinking}</li>
                                                <li>Feeling: {member.score?.feeling}</li>
                                                <li>Judging: {member.score?.judging}</li>
                                                <li>Perceiving: {member.score?.perceiving}</li>
                                            </ul>
                                        </div>
                                    ) : (
                                        <p>No assessment available.</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FamilyPersonalityModalContent;
