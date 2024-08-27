import React, { useState } from 'react';
import './DefaultModalContent.css';

const Tab = ({ children, activeTab, label, onClick }) => (
    <li className={`tab-item ${activeTab === label ? 'active' : ''}`} onClick={() => onClick(label)}>
        {label}
    </li>
);

const Tabs = ({ children }) => {
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

const CareerDevelopmentModalContent = ({ node }) => {
    const { details = {} } = node;
    const { name = 'No Name', description = 'No Description', skills = [], experience = [], education = [] } = details;

    const renderSkills = (skills = []) => (
        <div>
            {skills.length > 0 ? (
                <ul>
                    {skills.map((skill, index) => (
                        <li key={index}>
                            <strong>{skill.skill_name}</strong>
                            {skill.proficiency_level && ` - ${skill.proficiency_level}`}
                            <p>Last Updated: {skill.last_updated_date}</p>
                            {(skill.related_projects && skill.related_projects.length > 0) ? (
                                <p>Related Projects: {skill.related_projects.join(', ')}</p>
                            ) : (
                                <p>No related projects.</p>
                            )}
                            {(skill.keywords && skill.keywords.length > 0) ? (
                                <p>Keywords: {skill.keywords.join(', ')}</p>
                            ) : (
                                <p>No keywords provided.</p>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No skills have been added yet.</p>
            )}
        </div>
    );

    const renderExperience = (experience = []) => (
        <div>
            {experience.length > 0 ? (
                <ul>
                    {experience.map((exp, index) => (
                        <li key={index}>
                            <strong>{exp.job_title}</strong> at {exp.company}
                            <p>{exp.location}</p>
                            <p>{exp.duration}</p>
                            <p>Responsibilities:</p>
                            <ul>
                                {(exp.responsibilities || []).map((responsibility, idx) => (
                                    <li key={idx}>{responsibility}</li>
                                ))}
                            </ul>
                            {(exp.achievements && exp.achievements.length > 0) && (
                                <>
                                    <p>Achievements:</p>
                                    <ul>
                                        {exp.achievements.map((achievement, idx) => (
                                            <li key={idx}>{achievement}</li>
                                        ))}
                                    </ul>
                                </>
                            )}
                            {(exp.skills_used && exp.skills_used.length > 0) && (
                                <p>Skills Used: {exp.skills_used.join(', ')}</p>
                            )}
                            {(exp.keywords && exp.keywords.length > 0) && (
                                <p>Keywords: {exp.keywords.join(', ')}</p>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No experience has been added yet.</p>
            )}
        </div>
    );

    const renderEducation = (education = []) => (
        <div>
            {education.length > 0 ? (
                <ul>
                    {education.map((edu, index) => (
                        <li key={index}>
                            <strong>{edu.degree}</strong> from {edu.institution}
                            <p>{edu.location}</p>
                            <p>Graduation Date: {edu.graduation_date}</p>
                            {(edu.certifications && edu.certifications.length > 0) && (
                                <p>Certifications: {edu.certifications.join(', ')}</p>
                            )}
                            {(edu.internships && edu.internships.length > 0) && (
                                <p>Internships: {edu.internships.join(', ')}</p>
                            )}
                            {(edu.related_projects && edu.related_projects.length > 0) && (
                                <p>Related Projects: {edu.related_projects.join(', ')}</p>
                            )}
                            {(edu.keywords && edu.keywords.length > 0) && (
                                <p>Keywords: {edu.keywords.join(', ')}</p>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No education has been added yet.</p>
            )}
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
                    <div label="Skills">
                        {renderSkills(skills)}
                    </div>
                    <div label="Experience">
                        {renderExperience(experience)}
                    </div>
                    <div label="Education">
                        {renderEducation(education)}
                    </div>
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

export default CareerDevelopmentModalContent;
