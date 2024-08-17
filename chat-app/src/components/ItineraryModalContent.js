import React, { useState } from 'react';
import './DefaultModalContent.css'; // Reference to the stylesheet
import './ItineraryModalContent.css'; // Reference to the stylesheet
import defaultImage from './defaultImage.jpg'; // Default image for all instances

const ItineraryModalContent = ({ node, sunburstGraphRef, onRequestClose }) => {
    const { details } = node;
    const destinations = details?.destinations || [];

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
                        {details.start_date && details.end_date && (
                            <p>{details.start_date} to {details.end_date}</p>
                        )}
                    </>
                )}
                <a href="#" className="toggle-link" onClick={toggleView}>
                    {isCompactView ? 'Expanded View' : 'Compact View'}
                </a>
            </div>
            <div className={`content ${isCompactView ? 'compact' : ''}`}>
                {destinations.length > 0 && (
                    <div className="destinations-section">
                        <h2>Destinations</h2>
                        {isCompactView ? (
                            <table className="compact-table">
                                <thead>
                                <tr>
                                    <th>Location</th>
                                    <th>Arrival Date</th>
                                    <th>Departure Date</th>
                                    <th>Activities</th>
                                </tr>
                                </thead>
                                <tbody>
                                {destinations.map((destination, index) => (
                                    <tr key={index}>
                                        <td>{destination.location}</td>
                                        <td>{destination.arrival_date}</td>
                                        <td>{destination.departure_date}</td>
                                        <td>
                                            <ul>
                                                {destination.activities?.map((activity, actIndex) => (
                                                    <li key={actIndex}>{activity.name}</li>
                                                ))}
                                            </ul>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            destinations.map((destination, index) => (
                                <div key={index} className="card">
                                    <div className="map" style={{ backgroundImage: `url(${destination.map_image_url || defaultImage})` }}></div>
                                    <div className="card-content">
                                        <h3>{destination.location}</h3>
                                        {destination.arrival_date && destination.departure_date && (
                                            <p>Arrival: {destination.arrival_date} | Departure: {destination.departure_date}</p>
                                        )}
                                        {destination.accommodation && (
                                            <div className="accommodation">
                                                <h4>Accommodations</h4>
                                                <img src={destination.accommodation.image_url || defaultImage} alt={destination.accommodation.name || "Accommodation"} className="accommodation-image" />
                                                <div className="card-content">
                                                    <h3>{destination.accommodation.name}</h3>
                                                    {destination.accommodation.address && (
                                                        <p>Address: {destination.accommodation.address}</p>
                                                    )}
                                                    {destination.accommodation.check_in && destination.accommodation.check_out && (
                                                        <p>Check-in: {destination.accommodation.check_in} | Check-out: {destination.accommodation.check_out}</p>
                                                    )}
                                                    {destination.accommodation.currency && destination.accommodation.price_total && (
                                                        <p>Total Price: {destination.accommodation.currency} {destination.accommodation.price_total}</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {destination.activities && destination.activities.length > 0 && (
                                            <div className="activities">
                                                <h4>Activities</h4>
                                                {destination.activities.map((activity, actIndex) => (
                                                    <div key={actIndex} className="card">
                                                        <img src={activity.image_url || defaultImage} alt={activity.name || "Activity"} className="activity-image" />
                                                        <div className="card-content">
                                                            <h3>{activity.name}</h3>
                                                            {activity.date && activity.time && (
                                                                <p>Date: {activity.date} | Time: {activity.time}</p>
                                                            )}
                                                            {activity.location && (
                                                                <p>Location: {activity.location}</p>
                                                            )}
                                                            {activity.notes && (
                                                                <p>Notes: {activity.notes}</p>
                                                            )}
                                                            {activity.purchase_url && (
                                                                <a href={activity.purchase_url} className="button" target="_blank" rel="noopener noreferrer">Buy Tickets</a>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
            {details && (
                <div className="footer">
                    {details.notes && (
                        <p>{details.notes}</p>
                    )}
                    <p>Number of Adults: {details.number_of_adults} | Number of Children: {details.number_of_children}</p>
                </div>
            )}
        </div>
    );
};

export default ItineraryModalContent;
