import React, { useState, useEffect } from 'react';
import './DefaultModalContent.css';
import './FamilyHealthModalContent.css'; // Additional CSS for family health theme

const FamilyHealthModalContent = ({ node, sunburstGraphRef, onRequestClose }) => {

    const { details } = node;
    const people = details?.family_members || [];

    const [selectedPersonIndex, setSelectedPersonIndex] = useState(0);
    const [editMode, setEditMode] = useState(false);
    const [editDetails, setEditDetails] = useState(people[selectedPersonIndex] || {});

    useEffect(() => {
        setEditDetails(people[selectedPersonIndex] || {});
    }, [selectedPersonIndex, people]);

    const handlePersonChange = (e) => {
        setSelectedPersonIndex(e.target.value);
    };

    const toggleEditMode = () => {
        setEditMode(!editMode);
        setEditDetails(people[selectedPersonIndex] || {});
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditDetails((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSave = () => {
        // Save the updated details (e.g., make an API call to save changes)
        console.log(editDetails);
        setEditMode(false);
    };

    return (
        <div className="modal-container">
            <div className="header">
                <h1>{details?.name}</h1>
                <p>{details?.description}</p>
                <button onClick={toggleEditMode}>{editMode ? 'Cancel' : 'Toggle Edit'}</button>
                {editMode && <button onClick={handleSave}>Save</button>}
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
                {editMode ? (
                    <div className="person-details">
                        <h2>Physical Health</h2>
                        <input type="text" name="physical_health.condition" value={editDetails?.physical_health?.condition || ''} onChange={handleInputChange} placeholder="Condition" />
                        <input type="text" name="physical_health.medications" value={editDetails?.physical_health?.medications?.join(', ') || ''} onChange={handleInputChange} placeholder="Medications" />
                        <input type="date" name="physical_health.last_checkup_date" value={editDetails?.physical_health?.last_checkup_date || ''} onChange={handleInputChange} placeholder="Last Checkup Date" />
                        <textarea name="physical_health.notes" value={editDetails?.physical_health?.notes || ''} onChange={handleInputChange} placeholder="Notes" />

                        <h2>Mental Health</h2>
                        <input type="text" name="mental_health.condition" value={editDetails?.mental_health?.condition || ''} onChange={handleInputChange} placeholder="Condition" />
                        <input type="text" name="mental_health.medications" value={editDetails?.mental_health?.medications?.join(', ') || ''} onChange={handleInputChange} placeholder="Medications" />
                        <input type="date" name="mental_health.last_checkup_date" value={editDetails?.mental_health?.last_checkup_date || ''} onChange={handleInputChange} placeholder="Last Checkup Date" />
                        <textarea name="mental_health.notes" value={editDetails?.mental_health?.notes || ''} onChange={handleInputChange} placeholder="Notes" />

                        <h2>Preventive Care</h2>
                        <input type="text" name="preventive_care.immunizations" value={editDetails?.preventive_care?.immunizations?.join(', ') || ''} onChange={handleInputChange} placeholder="Immunizations" />
                        <input type="text" name="preventive_care.regular_screenings" value={editDetails?.preventive_care?.regular_screenings?.join(', ') || ''} onChange={handleInputChange} placeholder="Regular Screenings" />
                        <input type="date" name="preventive_care.last_screening_date" value={editDetails?.preventive_care?.last_screening_date || ''} onChange={handleInputChange} placeholder="Last Screening Date" />
                        <textarea name="preventive_care.notes" value={editDetails?.preventive_care?.notes || ''} onChange={handleInputChange} placeholder="Notes" />

                        <h2>Emergency Care</h2>
                        <input type="text" name="emergency_care.emergency_contact" value={editDetails?.emergency_care?.emergency_contact || ''} onChange={handleInputChange} placeholder="Emergency Contact" />
                        <input type="text" name="emergency_care.emergency_contact_phone" value={editDetails?.emergency_care?.emergency_contact_phone || ''} onChange={handleInputChange} placeholder="Emergency Contact Phone" />
                        <input type="text" name="emergency_care.allergies" value={editDetails?.emergency_care?.allergies?.join(', ') || ''} onChange={handleInputChange} placeholder="Allergies" />
                        <textarea name="emergency_care.emergency_instructions" value={editDetails?.emergency_care?.emergency_instructions || ''} onChange={handleInputChange} placeholder="Emergency Instructions" />
                        <textarea name="emergency_care.notes" value={editDetails?.emergency_care?.notes || ''} onChange={handleInputChange} placeholder="Notes" />
                    </div>
                ) : (
                    <div className="person-details">
                        <h2>Physical Health</h2>
                        <p>Condition: {editDetails?.physical_health?.condition}</p>
                        <p>Medications: {editDetails?.physical_health?.medications?.join(', ')}</p>
                        <p>Last Checkup Date: {editDetails?.physical_health?.last_checkup_date}</p>
                        <p>Notes: {editDetails?.physical_health?.notes}</p>

                        <h2>Mental Health</h2>
                        <p>Condition: {editDetails?.mental_health?.condition}</p>
                        <p>Medications: {editDetails?.mental_health?.medications?.join(', ')}</p>
                        <p>Last Checkup Date: {editDetails?.mental_health?.last_checkup_date}</p>
                        <p>Notes: {editDetails?.mental_health?.notes}</p>

                        <h2>Preventive Care</h2>
                        <p>Immunizations: {editDetails?.preventive_care?.immunizations?.join(', ')}</p>
                        <p>Regular Screenings: {editDetails?.preventive_care?.regular_screenings?.join(', ')}</p>
                        <p>Last Screening Date: {editDetails?.preventive_care?.last_screening_date}</p>
                        <p>Notes: {editDetails?.preventive_care?.notes}</p>

                        <h2>Emergency Care</h2>
                        <p>Emergency Contact: {editDetails?.emergency_care?.emergency_contact}</p>
                        <p>Emergency Contact Phone: {editDetails?.emergency_care?.emergency_contact_phone}</p>
                        <p>Allergies: {editDetails?.emergency_care?.allergies?.join(', ')}</p>
                        <p>Emergency Instructions: {editDetails?.emergency_care?.emergency_instructions}</p>
                        <p>Notes: {editDetails?.emergency_care?.notes}</p>
                    </div>
                )}
            </div>
            <div className="footer">
                {details?.notes && (
                    <p>{details.notes}</p>
                )}
            </div>
        </div>
    );
};

export default FamilyHealthModalContent;
