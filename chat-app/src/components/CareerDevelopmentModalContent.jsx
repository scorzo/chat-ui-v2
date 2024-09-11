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
    const { name = 'No Name', description = 'No Description', contact_information = {}, experience = [], education = [], additional_skills = {} } = details;

    const renderContactInformation = (contact_information) => (
        <div>
            <strong>{contact_information.name}</strong>
            <p>Job Title: {contact_information.job_title}</p>
            <p>Location: {contact_information.location}</p>
            {contact_information.linkedin && <p>LinkedIn: <a href={contact_information.linkedin}>{contact_information.linkedin}</a></p>}
            <p>Email: {contact_information.email}</p>
            <p>Phone: {contact_information.phone}</p>
            {contact_information.github && <p>GitHub: <a href={contact_information.github}>{contact_information.github}</a></p>}
            {contact_information.articles && <p>Articles: <a href={contact_information.articles}>{contact_information.articles}</a></p>}
        </div>
    );

    const renderExperience = (experience = []) => (
        <div>
            {experience.length > 0 ? (
                <ul>
                    {experience.map((exp, index) => (
                        <li key={index}>
                            <strong>{exp.company}</strong>
                            <p>{exp.location}</p>
                            <p>{exp.duration}</p>
                            {exp.roles.map((role, idx) => (
                                <div key={idx}>
                                    <p><strong>Role Title:</strong> {role.role_title}</p>
                                    <ul>
                                        {role.projects_accomplishments.map((proj, projIdx) => (
                                            <li key={projIdx}>
                                                <strong>{proj.name}</strong>
                                                <p>{proj.description}</p>
                                                <p>Skills Tags: {proj.skills_tags.join(', ')}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
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

    const renderKnowledgeBase = (additional_skills = {}) => (
        <div>
            {additional_skills.skills && additional_skills.skills.length > 0 ? (
                <ul>
                    {additional_skills.skills.map((skill, index) => (
                        <li key={index}>
                            <strong>{skill.skill_name}</strong>
                            <p>{skill.notes}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No additional skills have been added yet.</p>
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
                    <div label="Contact">
                        {renderContactInformation(contact_information)}
                    </div>
                    <div label="Experience">
                        {renderExperience(experience)}
                    </div>
                    <div label="Education">
                        {renderEducation(education)}
                    </div>
                    <div label="Knowledge Base">
                        {renderKnowledgeBase(additional_skills)}
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
