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

const WorkConnectionsModalContent = ({ node }) => {
    const { details = {} } = node;
    const { contacts = [], keywords = [] } = details;

    const renderDatedNotes = (datedNotes = []) => (
        <div>
            <h4>Dated Notes</h4>
            {datedNotes.length > 0 ? (
                <ul>
                    {datedNotes.map((note, index) => (
                        <li key={index}>
                            <strong>{note.date}:</strong> {note.note}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No dated notes have been added for this contact.</p>
            )}
        </div>
    );

    const renderContacts = (contacts = []) => (
        <div>
            {contacts.length > 0 ? (
                <div>
                    {contacts.map((contact, index) => (
                        <div key={index} className="contact-section">
                            <div className="contact-header">
                                <h4>{contact.name} - {contact.company}</h4>
                            </div>
                            <p><strong>Role:</strong> {contact.role}</p>
                            <p><strong>Phone:</strong> {contact.phone}</p>
                            {renderDatedNotes(contact.dated_notes)}
                            <p><strong>Keywords:</strong> {contact.keywords.join(', ')}</p>
                            {index < contacts.length - 1 && <hr className="contact-separator" />}
                        </div>
                    ))}
                </div>
            ) : (
                <p>No contacts have been added yet.</p>
            )}
        </div>
    );

    return (
        <div className="modal-container">
            <div className="header">
                <h1>Work Connections</h1>
                <p>Manage your professional network and contacts here.</p>
            </div>
            <div className="content">
                <Tabs>
                    <div label="Contacts">
                        {renderContacts(contacts)}
                    </div>
                    <div label="Keywords">
                        <div className="keywords-section">
                            <h4>Keywords</h4>
                            {keywords.length > 0 ? (
                                <ul>
                                    {keywords.map((keyword, index) => (
                                        <li key={index}>{keyword}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No keywords have been added yet.</p>
                            )}
                        </div>
                    </div>
                </Tabs>
            </div>
        </div>
    );
};

export default WorkConnectionsModalContent;
