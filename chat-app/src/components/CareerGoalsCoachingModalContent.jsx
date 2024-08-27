import React, { useState } from 'react';
import './DefaultModalContent.css';

const Tab = ({ children, activeTab, label, onClick }) => (
    <li className={`tab-item ${activeTab === label ? 'active' : ''}`} onClick={() => onClick(label)}>
        {label}
    </li>
);

const Tabs = ({ children }) => {
    // Ensure children is an array and has elements before proceeding
    const [activeTab, setActiveTab] = useState(children && children.length ? children[0].props.label : '');

    if (!children || !children.length) {
        return <div>No categories available.</div>;
    }

    const onClickTabItem = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="tabs">
            <ul className="tab-list">
                {children.map((child) => {
                    const { label } = child.props;

                    return (
                        <Tab
                            activeTab={activeTab}
                            key={label}
                            label={label}
                            onClick={onClickTabItem}
                        />
                    );
                })}
            </ul>
            <div className="tab-content">
                {children.map((child) => {
                    if (child.props.label !== activeTab) return undefined;
                    return child.props.children;
                })}
            </div>
        </div>
    );
};

const CareerGoalsCoachingModalContent = ({ node }) => {
    // Provide default values to avoid errors when details are empty
    const { details = {} } = node;
    const { name = 'No Name', description = 'No Description', goal_categories = [] } = details;

    const renderProgressTrackingForGoal = (goalName, progressTracking = []) => (
        <div>
            <h4>Progress Tracking</h4>
            {progressTracking.filter(pt => pt.goal === goalName).length > 0 ? (
                <table className="compact-table">
                    <thead>
                    <tr>
                        <th>Progress Update</th>
                        <th>Date</th>
                        <th>Progress (%)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {progressTracking.filter(pt => pt.goal === goalName).map((progress, index) => (
                        <tr key={index}>
                            <td>{progress.progress_update}</td>
                            <td>{progress.date}</td>
                            <td>{progress.progress}%</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No progress tracking entries have been added for this goal.</p>
            )}
        </div>
    );

    const renderCoachingResources = (coachingResources = []) => (
        <div>
            <h4>Coaching Resources</h4>
            {coachingResources.length > 0 ? (
                <ul>
                    {coachingResources.map((resource, index) => (
                        <li key={index}>
                            <a href={resource.url} target="_blank" rel="noopener noreferrer">{resource.resource}</a>: {resource.description}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No coaching resources have been added.</p>
            )}
        </div>
    );

    const renderGoals = (goals = [], progressTracking = [], coachingResources = []) => (
        <div>
            {goals.length > 0 ? (
                <div>
                    {goals.map((goal, index) => (
                        <div key={index} className="goal-section">
                            <div className="goal-header">
                                <h4>{goal.goal}</h4>
                            </div>
                            <p><strong>Description:</strong> {goal.description}</p>
                            <p><strong>Target Date:</strong> {goal.target_date}</p>
                            <p><strong>Priority:</strong> {goal.priority}</p>
                            <p><strong>Status:</strong> {goal.status}</p>
                            {renderProgressTrackingForGoal(goal.goal, progressTracking)}
                            {renderCoachingResources(coachingResources)}
                            {index < goals.length - 1 && <hr className="goal-separator" />}
                        </div>
                    ))}
                </div>
            ) : (
                <p>No goals have been added yet.</p>
            )}
        </div>
    );

    const renderSection = (category) => (
        <div className="section card">
            <div className="card-content">
                <h2>{category.category}</h2>
                <p><strong>Related Areas:</strong> {category.related_areas.join(', ')}</p>
                {renderGoals(category.goals, category.progress_tracking, category.coaching_resources)}
            </div>
        </div>
    );

    return (
        <div className="modal-container">
            <div className="header">
                <h1>{name}</h1>
                <p>{description}</p>
            </div>
            <div className="content">
                <Tabs>
                    {goal_categories.map((category, index) => (
                        <div label={category.category} key={index}>
                            {renderSection(category)}
                        </div>
                    ))}
                </Tabs>
            </div>
            {details.notes && (
                <div className="footer">
                    <p>{details.notes}</p>
                </div>
            )}
        </div>
    );
};

export default CareerGoalsCoachingModalContent;
