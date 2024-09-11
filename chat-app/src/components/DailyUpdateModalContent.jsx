import React, { useState } from 'react';
import './DefaultModalContent.css';
import './DailyUpdateModalContent.css';
import {
    FaSun, FaClock, FaTasks, FaDollarSign, FaNewspaper, FaBirthdayCake,
    FaQuoteLeft, FaBook, FaUtensils, FaBullseye, FaUsers
} from 'react-icons/fa'; // Importing icons from FontAwesome

const DailyUpdateModalContent = ({ node, sunburstGraphRef, onRequestClose }) => {
    const { details } = node;

    const [isCompactView, setIsCompactView] = useState(true);

    const toggleView = (event) => {
        event.preventDefault();
        setIsCompactView(!isCompactView);
    };

    // Function to group expenses by category
    const groupExpensesByCategory = (expenses) => {
        return expenses.reduce((acc, expense) => {
            if (!acc[expense.category]) {
                acc[expense.category] = [];
            }
            acc[expense.category].push(expense);
            return acc;
        }, {});
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
                        {/* Greeting */}
                        <div className="section">
                            <h2>Greeting</h2>
                            <p>{details.greeting}</p>
                        </div>

                        {/* Weather Report */}
                        <div className="section">
                            <FaSun className="icon" />
                            <h2>Weather Report</h2>
                            <p>Location: {details.weather_report.location}</p>
                            <p>Temperature: {details.weather_report.temperature}</p>
                            <p>Condition: {details.weather_report.condition}</p>
                            <p>Forecast: {details.weather_report.forecast}</p>
                            <textarea readOnly className="insights" value={details.weather_report.insights} />
                        </div>

                        {/* Today's Schedule */}
                        <div className="section">
                            <FaClock className="icon" />
                            <h2>Today's Schedule</h2>
                            <table className="generic-table">
                                <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>Event</th>
                                </tr>
                                </thead>
                                <tbody>
                                {details.schedule_today.schedule.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.time}</td>
                                        <td>{item.event}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            <textarea readOnly className="insights" value={details.schedule_today.insights} />
                        </div>

                        {/* Finance Updates */}
                        <div className="finance-section">
                            <FaDollarSign className="icon" />
                            <h2>Finance Updates</h2>

                            {/* Income */}
                            {details.finance_updates.income.length > 0 && (
                                <>
                                    <h3>Income</h3>
                                    <table className="generic-table">
                                        <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Source</th>
                                            <th>Amount</th>
                                            <th>Day</th>
                                            <th>Comments</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {details.finance_updates.income.map((income, index) => (
                                            <tr key={index}>
                                                <td>{income.name}</td>
                                                <td>{income.source}</td>
                                                <td>{income.recurring_detail?.amount}</td>
                                                <td>{income.recurring_detail?.day}</td>
                                                <td>{income.comments}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </>
                            )}

                            {/* Expenses */}
                            {details.finance_updates.expenses.length > 0 && (
                                <>
                                    <h3>Expenses</h3>
                                    {Object.entries(groupExpensesByCategory(details.finance_updates.expenses)).map(([category, expenses], categoryIndex) => (
                                        <div key={categoryIndex}>
                                            <strong>{category}</strong>
                                            <table className="generic-table">
                                                <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Amount</th>
                                                    <th>Day</th>
                                                    <th>Comments</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {expenses.map((expense, index) => (
                                                    <tr key={index}>
                                                        <td>{expense.name}</td>
                                                        <td>{expense.recurring_detail?.amount}</td>
                                                        <td>{expense.recurring_detail?.day}</td>
                                                        <td>{expense.comments}</td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ))}
                                </>
                            )}

                            {/* Liabilities */}
                            {details.finance_updates.liabilities.length > 0 && (
                                <>
                                    <h3>Liabilities</h3>
                                    <table className="generic-table">
                                        <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Type</th>
                                            <th>Balance</th>
                                            <th>Minimum Payment</th>
                                            <th>Day</th>
                                            <th>Comments</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {details.finance_updates.liabilities.map((liability, index) => (
                                            <tr key={index}>
                                                <td>{liability.name}</td>
                                                <td>{liability.type}</td>
                                                <td>{liability.balance}</td>
                                                <td>{liability.minimum_payment}</td>
                                                <td>{liability.recurring_detail?.day}</td>
                                                <td>{liability.comments}</td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </>
                            )}

                            <textarea readOnly className="insights" value={details.finance_updates.insights} />
                        </div>

                        {/* Daily Digest Suggestions */}
                        <div className="section">
                            <FaNewspaper className="icon" />
                            <h2>Daily Digest Suggestions</h2>
                            <table className="generic-table">
                                <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Title</th>
                                    <th>Description</th>
                                    <th>URL</th>
                                </tr>
                                </thead>
                                <tbody>
                                {details.daily_digest_suggestions.map((suggestion, index) => (
                                    <tr key={index}>
                                        <td>{suggestion.type}</td>
                                        <td>{suggestion.title}</td>
                                        <td>{suggestion.description}</td>
                                        <td>
                                            {suggestion.url && (
                                                <a href={suggestion.url} target="_blank" rel="noopener noreferrer">
                                                    {suggestion.url}
                                                </a>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Event Reminders */}
                        <div className="section">
                            <FaBirthdayCake className="icon" />
                            <h2>Event Reminders</h2>
                            {details.event_reminders.reminders.map((reminder, index) => (
                                <div key={index} className="item">
                                    <p>Event: {reminder.event}</p>
                                    <p>Date: {reminder.date}</p>
                                </div>
                            ))}
                            <textarea readOnly className="insights" value={details.event_reminders.insights} />
                        </div>

                        {/* Work Goals */}
                        <div className="section">
                            <FaBullseye className="icon" />
                            <h2>Work Goals</h2>
                            <table className="generic-table">
                                <thead>
                                <tr>
                                    <th>Goal</th>
                                    <th>Comments</th>
                                </tr>
                                </thead>
                                <tbody>
                                {details.work_goals.map((goal, index) => (
                                    <tr key={index}>
                                        <td>{goal.goal}</td>
                                        <td>{goal.comments}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Family Goals */}
                        <div className="section">
                            <FaUsers className="icon" />
                            <h2>Family Goals</h2>
                            <table className="generic-table">
                                <thead>
                                <tr>
                                    <th>Goal</th>
                                    <th>Comments</th>
                                </tr>
                                </thead>
                                <tbody>
                                {details.family_goals.map((goal, index) => (
                                    <tr key={index}>
                                        <td>{goal.goal}</td>
                                        <td>{goal.comments}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Family Menu Ideas */}
                        <div className="section">
                            <FaUtensils className="icon" />
                            <h2>Family Menu Ideas</h2>
                            <table className="generic-table">
                                <thead>
                                <tr>
                                    <th>Meal</th>
                                    <th>Recipe</th>
                                    <th>Ingredients</th>
                                </tr>
                                </thead>
                                <tbody>
                                {details.family_menu_ideas.menu.map((menu, index) => (
                                    <tr key={index}>
                                        <td>{menu.meal}</td>
                                        <td>{menu.recipe}</td>
                                        <td>{menu.ingredients.join(', ')}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            <textarea readOnly className="insights" value={details.family_menu_ideas.insights} />
                        </div>

                        {/* Household Tasks */}
                        <div className="section">
                            <FaTasks className="icon" />
                            <h2>Household Tasks</h2>
                            <table className="generic-table">
                                <thead>
                                <tr>
                                    <th>Task</th>
                                    <th>Priority</th>
                                </tr>
                                </thead>
                                <tbody>
                                {details.household_tasks.tasks.map((task, index) => (
                                    <tr key={index}>
                                        <td>{task.task}</td>
                                        <td>{task.priority}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            <textarea readOnly className="insights" value={details.household_tasks.insights} />
                        </div>

                        {/* Closing Greeting */}
                        <div className="section">
                            <h2>Closing Greeting</h2>
                            <p>{details.closing_greeting}</p>
                        </div>

                        {/* Inspirational Quote */}
                        <div className="section">
                            <FaQuoteLeft className="icon" />
                            <h2>Inspirational Quote</h2>
                            <p>{details.inspirational_quote}</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DailyUpdateModalContent;
