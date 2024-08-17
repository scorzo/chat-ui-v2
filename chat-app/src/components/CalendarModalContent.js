import React, { useState } from 'react';
import './DefaultModalContent.css';
import './CalendarModalContent.css';

const CalendarModalContent = ({ node, sunburstGraphRef, onRequestClose }) => {

    const { details } = node;
    const events = details?.events || [];

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
                    </>
                )}
                <a href="#" className="toggle-link" onClick={toggleView}>
                    {isCompactView ? 'Expanded View' : 'Compact View'}
                </a>
            </div>
            <div className={`content ${isCompactView ? 'compact' : ''}`}>
                {events.length > 0 && (
                    <div className="events-section">
                        <h2>Events</h2>
                        {isCompactView ? (
                            <table className="compact-table">
                                <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Start</th>
                                    <th>End</th>
                                    <th>Location</th>
                                    <th>Notes</th>
                                </tr>
                                </thead>
                                <tbody>
                                {events.map(event => (
                                    <tr key={event.event_id}>
                                        <td>{event.title}</td>
                                        <td>{new Date(event.start_time).toLocaleString()}</td>
                                        <td>{new Date(event.end_time).toLocaleString()}</td>
                                        <td>{event.location}</td>
                                        <td>{event.notes}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            events.map(event => (
                                <div className="card" key={event.event_id}>
                                    <div className="card-content">
                                        <h3>{event.title}</h3>
                                        <p>Start: {new Date(event.start_time).toLocaleString()}</p>
                                        <p>End: {new Date(event.end_time).toLocaleString()}</p>
                                        <p>Location: {event.location}</p>
                                        {event.notes && <p>Notes: {event.notes}</p>}
                                        {event.url && <a href={event.url} className="button" target="_blank" rel="noopener noreferrer">More Info</a>}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
            {details && (
                <div className="footer">
                    {details.notes && <p>{details.notes}</p>}
                </div>
            )}
        </div>
    );
};

export default CalendarModalContent;
