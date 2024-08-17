import React, { useState } from 'react';
import './DefaultModalContent.css';
import './DailyUpdateModalContent.css';
import { FaSun, FaClock, FaTasks, FaDollarSign, FaNewspaper, FaBirthdayCake, FaQuoteLeft, FaBook, FaUtensils } from 'react-icons/fa'; // Importing icons from FontAwesome

const DailyUpdateModalContent = ({ node, sunburstGraphRef, onRequestClose }) => {

    const { details } = node;

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
                            <FaSun className="icon" />
                            <h2>Weather Report</h2>
                            <p>Temperature: {details.weather_report.temperature}</p>
                            <p>Condition: {details.weather_report.condition}</p>
                            <p>Forecast: {details.weather_report.forecast}</p>
                            <textarea readOnly className="insights" value={details.weather_report.insights} />
                        </div>
                        <div className="section">
                            <FaClock className="icon" />
                            <h2>Today's Schedule</h2>
                            {details.schedule_today.map((item, index) => (
                                <div key={index} className="item">
                                    <p>Time: {item.time}</p>
                                    <p>Event: {item.event}</p>
                                </div>
                            ))}
                            <textarea readOnly className="insights" value={details.schedule_insights} />
                        </div>
                        <div className="section">
                            <FaTasks className="icon" />
                            <h2>Household Tasks</h2>
                            {details.household_tasks.map((task, index) => (
                                <div key={index} className="item">
                                    <p>Task: {task.task}</p>
                                    <p>Priority: {task.priority}</p>
                                </div>
                            ))}
                            <textarea readOnly className="insights" value={details.household_tasks_insights} />
                        </div>
                        <div className="section">
                            <FaDollarSign className="icon" />
                            <h2>Finance Updates</h2>
                            {details.finance_updates.payday_alert && (
                                <p>Payday Alert: {details.finance_updates.payday_alert}</p>
                            )}
                            {details.finance_updates.bills_coming_due && (
                                <>
                                    <h3>Bills Coming Due</h3>
                                    {details.finance_updates.bills_coming_due.map((bill, index) => (
                                        <div key={index} className="item">
                                            <p>Bill: {bill.bill_name}</p>
                                            <p>Due Date: {bill.due_date}</p>
                                            <p>Amount Due: {bill.currency} {bill.amount_due}</p>
                                        </div>
                                    ))}
                                </>
                            )}
                            {details.finance_updates.stock_market_suggestions && (
                                <>
                                    <h3>Stock Market Suggestions</h3>
                                    {details.finance_updates.stock_market_suggestions.map((suggestion, index) => (
                                        <p key={index}>{suggestion}</p>
                                    ))}
                                </>
                            )}
                            <textarea readOnly className="insights" value={details.finance_updates.insights} />
                        </div>
                        <div className="section">
                            <FaNewspaper className="icon" />
                            <h2>Daily Suggestions</h2>
                            {details.daily_suggestions.map((suggestion, index) => (
                                <div key={index} className="item">
                                    <p>Type: {suggestion.type}</p>
                                    <p>Title: {suggestion.title}</p>
                                    <p>Description: {suggestion.description}</p>
                                    {suggestion.url && (
                                        <p>URL: <a href={suggestion.url} target="_blank" rel="noopener noreferrer">{suggestion.url}</a></p>
                                    )}
                                </div>
                            ))}
                            <textarea readOnly className="insights" value={details.daily_suggestions_insights} />
                        </div>
                        <div className="section">
                            <FaBirthdayCake className="icon" />
                            <h2>Reminders</h2>
                            {details.reminders.map((reminder, index) => (
                                <div key={index} className="item">
                                    <p>Event: {reminder.event}</p>
                                    <p>Date: {reminder.date}</p>
                                </div>
                            ))}
                            <textarea readOnly className="insights" value={details.reminders_insights} />
                        </div>
                        <div className="section">
                            <FaQuoteLeft className="icon" />
                            <h2>Inspirational Quote</h2>
                            <p>{details.inspirational_quote}</p>
                        </div>
                        <div className="section">
                            <FaBook className="icon" />
                            <h2>Learning Path Suggestions</h2>
                            {details.learning_path_suggestions.map((suggestion, index) => (
                                <div key={index} className="item">
                                    <p>Subject: {suggestion.subject}</p>
                                    <p>Resource: {suggestion.resource}</p>
                                    {suggestion.url && (
                                        <p>URL: <a href={suggestion.url} target="_blank" rel="noopener noreferrer">{suggestion.url}</a></p>
                                    )}
                                </div>
                            ))}
                            <textarea readOnly className="insights" value={details.learning_path_insights} />
                        </div>
                        <div className="section">
                            <FaUtensils className="icon" />
                            <h2>Family Menu Ideas</h2>
                            {details.family_menu_ideas.map((menu, index) => (
                                <div key={index} className="item">
                                    <p>Meal: {menu.meal}</p>
                                    <p>Recipe: {menu.recipe}</p>
                                    <p>Ingredients: {menu.ingredients.join(', ')}</p>
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

export default DailyUpdateModalContent;
