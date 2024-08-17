import React, { useState, useEffect } from 'react';
import './DefaultModalContent.css';
import './LearningModalContent.css';

const LearningModalContent = ({ node, sunburstGraphRef, onRequestClose }) => {

    const { details } = node;
    const people = details?.people || [];

    const [selectedPersonIndex, setSelectedPersonIndex] = useState(0);
    const [selectedPerson, setSelectedPerson] = useState(people[selectedPersonIndex] || {});

    useEffect(() => {
        setSelectedPerson(people[selectedPersonIndex] || {});
    }, [selectedPersonIndex, people]);

    const handlePersonChange = (e) => {
        setSelectedPersonIndex(e.target.value);
    };

    return (
        <div className="modal-container">
            <div className="header">
                <h1>Learning</h1>
                <p>School and Learning related activities</p>
            </div>
            <div className="content">
                <div className="person-selector">
                    <label htmlFor="person">Select Family Member: </label>
                    <select id="person" value={selectedPersonIndex} onChange={handlePersonChange}>
                        {people.map((person, index) => (
                            <option key={index} value={index}>{person.name}</option>
                        ))}
                    </select>
                </div>
                <div className="person-details">
                    <h2>{selectedPerson.name}</h2>
                    {selectedPerson.institutions_attending?.map((institution, institutionIndex) => (
                        <div key={institutionIndex} className="institution-section">
                            <div className="card">
                                <div className="card-header">
                                    <h3>{institution.name}</h3>
                                </div>
                                <div className="card-content">
                                    <p>Hours: {institution.hours}</p>
                                    <p>Grade Level: {institution.grade_level}</p>
                                    <h4>Topics:</h4>
                                    {institution.topics.map((topic, topicIndex) => (
                                        <div key={topicIndex} className="topic-section">
                                            <div className="card">
                                                <div className="card-header">
                                                    <h4>{topic.subject}</h4>
                                                </div>
                                                <div className="card-content">
                                                    <p>Class Hours: {topic.class_hours}</p>
                                                    <p>Teacher Contact:</p>
                                                    <p>Name: {topic.teacher_contact.name}</p>
                                                    <p>Email: {topic.teacher_contact.email}</p>
                                                    <p>Phone: {topic.teacher_contact.phone}</p>
                                                    <p>Homework: {topic.homework}</p>
                                                    <p>Notes: {topic.notes}</p>
                                                    <p>Start Date: {topic.start_date}</p>
                                                    <p>End Date: {topic.end_date}</p>
                                                    <h4>Exams:</h4>
                                                    {topic.exams.map((exam, examIndex) => (
                                                        <div key={examIndex} className="exam-section">
                                                            <div className="card-content">
                                                                <p>Date: {exam.date}</p>
                                                                <p>Topic: {exam.topic}</p>
                                                                <p>Description: {exam.description}</p>
                                                                <p>Score: {exam.score}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="footer">
                {details?.notes && <p>{details.notes}</p>}
            </div>
        </div>
    );
};

export default LearningModalContent;
