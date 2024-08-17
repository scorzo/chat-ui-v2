import React, { useState } from 'react';
import './SpecialDatesModalContent.css';

const eventTypes = [
    "Birthday", "Anniversary", "Holiday", "Meeting", "Appointment",
    "Family Gathering", "Vacation", "Work Event", "School Event", "Other"
];

const SpecialDatesModalContent = ({ node, onRequestClose }) => {
    const [details, setDetails] = useState(node.details);
    const [isEditing, setIsEditing] = useState(null);
    const [newEvent, setNewEvent] = useState({
        event_type: "", event_name: "", date: "", notes: ""
    });

    const handleInputChange = (e, index) => {
        const { name, value } = e.target;
        const updatedDates = [...details.dates];
        updatedDates[index][name] = value;
        setDetails({ ...details, dates: updatedDates });
    };

    const handleNewEventChange = (e) => {
        const { name, value } = e.target;
        setNewEvent({ ...newEvent, [name]: value });
    };

    const handleSaveNewEvent = () => {
        setDetails({ ...details, dates: [...details.dates, newEvent] });
        setNewEvent({ event_type: "", event_name: "", date: "", notes: "" });
    };

    const handleDeleteEvent = (index) => {
        const updatedDates = details.dates.filter((_, i) => i !== index);
        setDetails({ ...details, dates: updatedDates });
    };

    const handleEditEvent = (index) => {
        setIsEditing(index);
    };

    const handleSaveEdit = (index) => {
        setIsEditing(null);
    };

    return (
        <div className="modal-container">
            <div className="header">
                {details && (
                    <>
                        <h1>{details.name}</h1>
                        <p>{details.description}</p>
                    </>
                )}
            </div>
            <div className="content">
                <table className="special-dates-table">
                    <thead>
                    <tr>
                        <th>Type</th>
                        <th>Name</th>
                        <th>Date</th>
                        <th>Notes</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {details.dates.map((date, index) => (
                        <tr key={index}>
                            {isEditing === index ? (
                                <>
                                    <td>
                                        <select
                                            name="event_type"
                                            value={date.event_type}
                                            onChange={(e) => handleInputChange(e, index)}
                                        >
                                            {eventTypes.map((type) => (
                                                <option key={type} value={type}>{type}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td><input type="text" name="event_name" value={date.event_name} onChange={(e) => handleInputChange(e, index)} /></td>
                                    <td><input type="date" name="date" value={date.date} onChange={(e) => handleInputChange(e, index)} /></td>
                                    <td><input type="text" name="notes" value={date.notes} onChange={(e) => handleInputChange(e, index)} /></td>
                                    <td>
                                        <button onClick={() => handleSaveEdit(index)}>Save</button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{date.event_type}</td>
                                    <td>{date.event_name}</td>
                                    <td>{date.date}</td>
                                    <td>{date.notes}</td>
                                    <td>
                                        <button onClick={() => handleEditEvent(index)}>Edit</button>
                                        <button onClick={() => handleDeleteEvent(index)}>Delete</button>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
                <div className="add-new-event">
                    <h3>Add New Event</h3>
                    <select
                        name="event_type"
                        value={newEvent.event_type}
                        onChange={handleNewEventChange}
                    >
                        {eventTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                    <input type="text" name="event_name" placeholder="Event Name" value={newEvent.event_name} onChange={handleNewEventChange} />
                    <input type="date" name="date" value={newEvent.date} onChange={handleNewEventChange} />
                    <input type="text" name="notes" placeholder="Notes" value={newEvent.notes} onChange={handleNewEventChange} />
                    <button onClick={handleSaveNewEvent}>Add Event</button>
                </div>
            </div>
        </div>
    );
};

export default SpecialDatesModalContent;
