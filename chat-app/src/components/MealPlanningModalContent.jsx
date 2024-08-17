import React, { useState } from 'react';
import './MealPlanningModalContent.css';
import { FaUtensils } from 'react-icons/fa'; // Importing the utensil icon from FontAwesome

const MealPlanningModalContent = ({ node, onRequestClose }) => {
    const details = node.details;
    const [isCompactView, setIsCompactView] = useState(true);

    const toggleView = (event) => {
        event.preventDefault();
        setIsCompactView(!isCompactView);
    };
    return (
        <div className="modal-container">
            <div className="header">
                {details && (
                    <>
                        <h1>{details.name}</h1>
                        <p>{details.description}</p>
                        <p>Date: {details.date}</p>
                    </>
                )}
                <a href="#" className="toggle-link" onClick={toggleView}>
                    {isCompactView ? 'Expanded View' : 'Compact View'}
                </a>
            </div>
            <div className={`content ${isCompactView ? 'compact' : ''}`}>
                {details && (
                    <>
                        <div className="section">
                            <FaUtensils className="icon" />
                            <h2>Family Menu Ideas</h2>
                            {details.family_menu_ideas.map((menu, index) => (
                                <div key={index} className="item">
                                    <p><strong>Meal:</strong> {menu.meal}</p>
                                    <p><strong>Recipe:</strong> {menu.recipe}</p>
                                    <p><strong>Ingredients:</strong> {menu.ingredients.join(', ')}</p>
                                    {menu.image_url && (
                                        <img src={menu.image_url} alt={`${menu.meal} image`} className="menu-image" />
                                    )}
                                </div>
                            ))}
                            <textarea readOnly className="insights" value={details.menu_insights} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MealPlanningModalContent;
