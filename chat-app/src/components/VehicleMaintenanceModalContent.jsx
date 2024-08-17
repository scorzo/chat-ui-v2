import React, { useState, useEffect } from 'react';
import './DefaultModalContent.css'; // Reference to the stylesheet
import './VehicleMaintenanceModalContent.css'; // Reference to the custom stylesheet
import defaultImage from './defaultImage.jpg'; // Default image for all instances
import axios from 'axios';

const VehicleMaintenanceModalContent = ({ node, sunburstGraphRef, onRequestClose }) => {

    const { details } = node;

    const [isCompactView, setIsCompactView] = useState(true);
    const [vehicles, setVehicles] = useState(details?.vehicles || []);
    const [newVehicle, setNewVehicle] = useState({});
    const [editedVehicle, setEditedVehicle] = useState(null);

    useEffect(() => {
        if (details?.vehicles) {
            setVehicles(details.vehicles);
        }
    }, [details]);

    const toggleView = (event) => {
        event.preventDefault();
        setIsCompactView(!isCompactView);
    };

    const handleInputChange = (e, vehicle, setVehicle) => {
        const { name, value } = e.target;
        if (name === 'primary_drivers') {
            setVehicle({ ...vehicle, [name]: value.split(',').map(driver => driver.trim()) });
        } else if (name === 'tires') {
            setVehicle({ ...vehicle, [name]: value.split(',').map(tire => tire.trim()) });
        } else {
            setVehicle({ ...vehicle, [name]: value });
        }
    };

    const handleAddVehicle = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/nodes/${node.node_id}/vehicles`, newVehicle);
            setVehicles([...vehicles, response.data]);
            setNewVehicle({});
        } catch (error) {
            console.error("There was an error adding the vehicle!", error);
        }
    };

    const handleEditVehicle = (vehicle) => setEditedVehicle(vehicle);

    const handleSaveVehicle = async () => {
        try {
            const response = await axios.put(`http://127.0.0.1:5000/nodes/${node.node_id}/vehicles/${editedVehicle.vehicle_id}`, editedVehicle);
            const updatedVehicles = vehicles.map((vehicle) => (vehicle.vehicle_id === editedVehicle.vehicle_id ? response.data : vehicle));
            setVehicles(updatedVehicles);
            setEditedVehicle(null);
        } catch (error) {
            console.error("There was an error saving the vehicle!", error);
        }
    };

    const handleDeleteVehicle = async (vehicle_id) => {
        try {
            await axios.delete(`http://127.0.0.1:5000/nodes/${node.node_id}/vehicles/${vehicle_id}`);
            setVehicles(vehicles.filter(vehicle => vehicle.vehicle_id !== vehicle_id));
        } catch (error) {
            console.error("There was an error deleting the vehicle!", error);
        }
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
                {vehicles.length > 0 && (
                    <div className="vehicles-section">
                        <h2>Vehicles</h2>
                        {vehicles.map(vehicle => (
                            <div className="card" key={vehicle.vehicle_id}>
                                <img src={defaultImage} alt="Vehicle" className="vehicle-image" />
                                <div className="card-content">
                                    {editedVehicle && editedVehicle.vehicle_id === vehicle.vehicle_id ? (
                                        <>
                                            <input
                                                type="text"
                                                name="name"
                                                value={editedVehicle.name}
                                                onChange={(e) => handleInputChange(e, editedVehicle, setEditedVehicle)}
                                            />
                                            <input
                                                type="text"
                                                name="make"
                                                value={editedVehicle.make}
                                                onChange={(e) => handleInputChange(e, editedVehicle, setEditedVehicle)}
                                            />
                                            <input
                                                type="text"
                                                name="model"
                                                value={editedVehicle.model}
                                                onChange={(e) => handleInputChange(e, editedVehicle, setEditedVehicle)}
                                            />
                                            <input
                                                type="number"
                                                name="year"
                                                value={editedVehicle.year}
                                                onChange={(e) => handleInputChange(e, editedVehicle, setEditedVehicle)}
                                            />
                                            <input
                                                type="text"
                                                name="vin"
                                                value={editedVehicle.vin}
                                                onChange={(e) => handleInputChange(e, editedVehicle, setEditedVehicle)}
                                            />
                                            <input
                                                type="text"
                                                name="color"
                                                value={editedVehicle.color}
                                                onChange={(e) => handleInputChange(e, editedVehicle, setEditedVehicle)}
                                            />
                                            <input
                                                type="text"
                                                name="primary_drivers"
                                                value={Array.isArray(editedVehicle?.primary_drivers) ? editedVehicle.primary_drivers.join(', ') : editedVehicle?.primary_drivers || ''}
                                                onChange={(e) => handleInputChange(e, editedVehicle, setEditedVehicle)}
                                            />
                                            <input
                                                type="number"
                                                name="average_daily_usage_km"
                                                value={editedVehicle.average_daily_usage_km}
                                                onChange={(e) => handleInputChange(e, editedVehicle, setEditedVehicle)}
                                            />
                                            <textarea
                                                name="tires"
                                                value={Array.isArray(editedVehicle?.tires) ? editedVehicle.tires.join(', ') : editedVehicle?.tires || ''}
                                                onChange={(e) => handleInputChange(e, editedVehicle, setEditedVehicle)}
                                            />
                                            <button onClick={handleSaveVehicle}>Save</button>
                                        </>
                                    ) : (
                                        <>
                                            <h3>{vehicle.name}</h3>
                                            {vehicle.make && (
                                                <p>Make: {vehicle.make}</p>
                                            )}
                                            {vehicle.model && (
                                                <p>Model: {vehicle.model}</p>
                                            )}
                                            {vehicle.year && (
                                                <p>Year: {vehicle.year}</p>
                                            )}
                                            {vehicle.vin && (
                                                <p>VIN: {vehicle.vin}</p>
                                            )}
                                            {vehicle.color && (
                                                <p>Color: {vehicle.color}</p>
                                            )}
                                            {vehicle.primary_drivers && vehicle.primary_drivers.length > 0 && (
                                                <p>Primary Drivers: {vehicle.primary_drivers.join(', ')}</p>
                                            )}
                                            {vehicle.average_daily_usage_km && (
                                                <p>Average Daily Usage: {vehicle.average_daily_usage_km} km</p>
                                            )}
                                            {vehicle.tires && vehicle.tires.length > 0 && (
                                                <p>Tires: {vehicle.tires.join(', ')}</p>
                                            )}
                                            <button onClick={() => handleEditVehicle(vehicle)}>Edit</button>
                                            <button onClick={() => handleDeleteVehicle(vehicle.vehicle_id)}>Delete</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="add-vehicle-section">
                    <h2>Add New Vehicle</h2>
                    <div className="card">
                        <div className="card-content">
                            <input
                                type="text"
                                name="name"
                                placeholder="Vehicle Name"
                                value={newVehicle.name || ''}
                                onChange={(e) => handleInputChange(e, newVehicle, setNewVehicle)}
                            />
                            <input
                                type="text"
                                name="make"
                                placeholder="Make"
                                value={newVehicle.make || ''}
                                onChange={(e) => handleInputChange(e, newVehicle, setNewVehicle)}
                            />
                            <input
                                type="text"
                                name="model"
                                placeholder="Model"
                                value={newVehicle.model || ''}
                                onChange={(e) => handleInputChange(e, newVehicle, setNewVehicle)}
                            />
                            <input
                                type="number"
                                name="year"
                                placeholder="Year"
                                value={newVehicle.year || ''}
                                onChange={(e) => handleInputChange(e, newVehicle, setNewVehicle)}
                            />
                            <input
                                type="text"
                                name="vin"
                                placeholder="VIN"
                                value={newVehicle.vin || ''}
                                onChange={(e) => handleInputChange(e, newVehicle, setNewVehicle)}
                            />
                            <input
                                type="text"
                                name="color"
                                placeholder="Color"
                                value={newVehicle.color || ''}
                                onChange={(e) => handleInputChange(e, newVehicle, setNewVehicle)}
                            />
                            <input
                                type="text"
                                name="primary_drivers"
                                placeholder="Primary Drivers"
                                value={newVehicle.primary_drivers || ''}
                                onChange={(e) => handleInputChange(e, newVehicle, setNewVehicle)}
                            />
                            <input
                                type="number"
                                name="average_daily_usage_km"
                                placeholder="Average Daily Usage (km)"
                                value={newVehicle.average_daily_usage_km || ''}
                                onChange={(e) => handleInputChange(e, newVehicle, setNewVehicle)}
                            />
                            <textarea
                                name="tires"
                                placeholder="Tires"
                                value={newVehicle.tires || ''}
                                onChange={(e) => handleInputChange(e, newVehicle, setNewVehicle)}
                            />
                            <button onClick={handleAddVehicle}>Add Vehicle</button>
                        </div>
                    </div>
                </div>
            </div>
            {details && (
                <div className="footer">
                    {details.notes && (
                        <p>{details.notes}</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default VehicleMaintenanceModalContent;
