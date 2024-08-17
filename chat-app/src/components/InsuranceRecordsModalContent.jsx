import React, { useState, useEffect } from 'react';
import './DefaultModalContent.css'; // Reference to the default stylesheet
import './InsuranceRecordsModalContent.css'; // Reference to the custom stylesheet
import defaultImage from './defaultImage.jpg'; // Default image for all instances
import axios from 'axios';

const InsuranceRecordsModalContent = ({ node, sunburstGraphRef, onRequestClose }) => {

    const { details } = node;

    const [isCompactView, setIsCompactView] = useState(true);
    const [houseInsurance, setHouseInsurance] = useState(details?.house_insurance || []);
    const [carInsurance, setCarInsurance] = useState(details?.car_insurance || []);
    const [rentersInsurance, setRentersInsurance] = useState(details?.renters_insurance || []);
    const [floodInsurance, setFloodInsurance] = useState(details?.flood_insurance || []);
    const [earthquakeInsurance, setEarthquakeInsurance] = useState(details?.earthquake_insurance || []);
    const [umbrellaInsurance, setUmbrellaInsurance] = useState(details?.umbrella_insurance || []);
    const [petInsurance, setPetInsurance] = useState(details?.pet_insurance || []);
    const [newInsurance, setNewInsurance] = useState({});
    const [editedInsurance, setEditedInsurance] = useState(null);

    useEffect(() => {
        if (details) {
            setHouseInsurance(details.house_insurance || []);
            setCarInsurance(details.car_insurance || []);
            setRentersInsurance(details.renters_insurance || []);
            setFloodInsurance(details.flood_insurance || []);
            setEarthquakeInsurance(details.earthquake_insurance || []);
            setUmbrellaInsurance(details.umbrella_insurance || []);
            setPetInsurance(details.pet_insurance || []);
        }
    }, [details]);

    const toggleView = (event) => {
        event.preventDefault();
        setIsCompactView(!isCompactView);
    };

    const handleInputChange = (e, insurance, setInsurance) => {
        const { name, value } = e.target;
        setInsurance({ ...insurance, [name]: value });
    };

    const handleAddInsurance = async (type) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/nodes/${node.node_id}/${type}`, newInsurance);
            switch (type) {
                case 'house_insurance':
                    setHouseInsurance([...houseInsurance, response.data]);
                    break;
                case 'car_insurance':
                    setCarInsurance([...carInsurance, response.data]);
                    break;
                case 'renters_insurance':
                    setRentersInsurance([...rentersInsurance, response.data]);
                    break;
                case 'flood_insurance':
                    setFloodInsurance([...floodInsurance, response.data]);
                    break;
                case 'earthquake_insurance':
                    setEarthquakeInsurance([...earthquakeInsurance, response.data]);
                    break;
                case 'umbrella_insurance':
                    setUmbrellaInsurance([...umbrellaInsurance, response.data]);
                    break;
                case 'pet_insurance':
                    setPetInsurance([...petInsurance, response.data]);
                    break;
                default:
                    break;
            }
            setNewInsurance({});
        } catch (error) {
            console.error("There was an error adding the insurance!", error);
        }
    };

    const handleEditInsurance = (insurance) => setEditedInsurance(insurance);

    const handleSaveInsurance = async () => {
        try {
            const type = editedInsurance.house_id ? 'house_insurance' : editedInsurance.vehicle_id ? 'car_insurance' : editedInsurance.rental_id ? 'renters_insurance' : editedInsurance.property_id ? 'flood_insurance' : editedInsurance.pet_id ? 'pet_insurance' : 'umbrella_insurance';
            const id = editedInsurance.house_id || editedInsurance.vehicle_id || editedInsurance.rental_id || editedInsurance.property_id || editedInsurance.pet_id || editedInsurance.policy_id;
            const response = await axios.put(`${process.env.REACT_APP_API_ENDPOINT}/nodes/${node.node_id}/${type}/${id}`, editedInsurance);
            const updatedList = (() => {
                switch (type) {
                    case 'house_insurance':
                        return houseInsurance.map((insurance) => (insurance.house_id === editedInsurance.house_id ? response.data : insurance));
                    case 'car_insurance':
                        return carInsurance.map((insurance) => (insurance.vehicle_id === editedInsurance.vehicle_id ? response.data : insurance));
                    case 'renters_insurance':
                        return rentersInsurance.map((insurance) => (insurance.rental_id === editedInsurance.rental_id ? response.data : insurance));
                    case 'flood_insurance':
                        return floodInsurance.map((insurance) => (insurance.property_id === editedInsurance.property_id ? response.data : insurance));
                    case 'earthquake_insurance':
                        return earthquakeInsurance.map((insurance) => (insurance.property_id === editedInsurance.property_id ? response.data : insurance));
                    case 'pet_insurance':
                        return petInsurance.map((insurance) => (insurance.pet_id === editedInsurance.pet_id ? response.data : insurance));
                    case 'umbrella_insurance':
                        return umbrellaInsurance.map((insurance) => (insurance.policy_id === editedInsurance.policy_id ? response.data : insurance));
                    default:
                        return [];
                }
            })();
            setInsuranceState(type, updatedList);
            setEditedInsurance(null);
        } catch (error) {
            console.error("There was an error saving the insurance!", error);
        }
    };

    const handleDeleteInsurance = async (id, type) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_ENDPOINT}/nodes/${node.node_id}/${type}/${id}`);
            const updatedList = (() => {
                switch (type) {
                    case 'house_insurance':
                        return houseInsurance.filter(insurance => insurance.house_id !== id);
                    case 'car_insurance':
                        return carInsurance.filter(insurance => insurance.vehicle_id !== id);
                    case 'renters_insurance':
                        return rentersInsurance.filter(insurance => insurance.rental_id !== id);
                    case 'flood_insurance':
                        return floodInsurance.filter(insurance => insurance.property_id !== id);
                    case 'earthquake_insurance':
                        return earthquakeInsurance.filter(insurance => insurance.property_id !== id);
                    case 'pet_insurance':
                        return petInsurance.filter(insurance => insurance.pet_id !== id);
                    case 'umbrella_insurance':
                        return umbrellaInsurance.filter(insurance => insurance.policy_id !== id);
                    default:
                        return [];
                }
            })();
            setInsuranceState(type, updatedList);
        } catch (error) {
            console.error(`There was an error deleting the ${type.replace('_', ' ')}!`, error);
        }
    };

    const setInsuranceState = (type, updatedList) => {
        switch (type) {
            case 'house_insurance':
                setHouseInsurance(updatedList);
                break;
            case 'car_insurance':
                setCarInsurance(updatedList);
                break;
            case 'renters_insurance':
                setRentersInsurance(updatedList);
                break;
            case 'flood_insurance':
                setFloodInsurance(updatedList);
                break;
            case 'earthquake_insurance':
                setEarthquakeInsurance(updatedList);
                break;
            case 'pet_insurance':
                setPetInsurance(updatedList);
                break;
            case 'umbrella_insurance':
                setUmbrellaInsurance(updatedList);
                break;
            default:
                break;
        }
    };

    const renderInsuranceSection = (title, insuranceList, type) => (
        <div className="insurance-section">
            <h2>{title}</h2>
            {insuranceList.map(insurance => (
                <div className="card" key={insurance.house_id || insurance.vehicle_id || insurance.rental_id || insurance.property_id || insurance.pet_id || insurance.policy_id}>
                    <img src={defaultImage} alt={`${title} Image`} className="insurance-image" />
                    <div className="card-content">
                        {editedInsurance && (editedInsurance.house_id === insurance.house_id || editedInsurance.vehicle_id === insurance.vehicle_id || editedInsurance.rental_id === insurance.rental_id || editedInsurance.property_id === insurance.property_id || editedInsurance.pet_id === insurance.pet_id || editedInsurance.policy_id === insurance.policy_id) ? (
                            <>
                                <input
                                    type="text"
                                    name="address"
                                    value={editedInsurance.address || ''}
                                    onChange={(e) => handleInputChange(e, editedInsurance, setEditedInsurance)}
                                    placeholder="Address"
                                />
                                <input
                                    type="text"
                                    name="policy_number"
                                    value={editedInsurance.insurance.policy_number}
                                    onChange={(e) => handleInputChange(e, editedInsurance.insurance, insurance => setEditedInsurance({ ...editedInsurance, insurance }))}
                                    placeholder="Policy Number"
                                />
                                <input
                                    type="text"
                                    name="provider"
                                    value={editedInsurance.insurance.provider}
                                    onChange={(e) => handleInputChange(e, editedInsurance.insurance, insurance => setEditedInsurance({ ...editedInsurance, insurance }))}
                                    placeholder="Provider"
                                />
                                <input
                                    type="date"
                                    name="start_date"
                                    value={editedInsurance.insurance.start_date}
                                    onChange={(e) => handleInputChange(e, editedInsurance.insurance, insurance => setEditedInsurance({ ...editedInsurance, insurance }))}
                                />
                                <input
                                    type="date"
                                    name="end_date"
                                    value={editedInsurance.insurance.end_date}
                                    onChange={(e) => handleInputChange(e, editedInsurance.insurance, insurance => setEditedInsurance({ ...editedInsurance, insurance }))}
                                />
                                <input
                                    type="number"
                                    name="premium"
                                    value={editedInsurance.insurance.premium}
                                    onChange={(e) => handleInputChange(e, editedInsurance.insurance, insurance => setEditedInsurance({ ...editedInsurance, insurance }))}
                                    placeholder="Premium"
                                />
                                <input
                                    type="number"
                                    name="deductible"
                                    value={editedInsurance.insurance.deductible}
                                    onChange={(e) => handleInputChange(e, editedInsurance.insurance, insurance => setEditedInsurance({ ...editedInsurance, insurance }))}
                                    placeholder="Deductible"
                                />
                                <textarea
                                    name="notes"
                                    value={editedInsurance.insurance.notes || ''}
                                    onChange={(e) => handleInputChange(e, editedInsurance.insurance, insurance => setEditedInsurance({ ...editedInsurance, insurance }))}
                                    placeholder="Notes"
                                />
                                <button onClick={handleSaveInsurance}>Save</button>
                            </>
                        ) : (
                            <>
                                <h3>{insurance.address || `${insurance.make} ${insurance.model}` || insurance.pet_name || 'Policy'}</h3>
                                <p>Policy Number: {insurance.insurance.policy_number}</p>
                                <p>Provider: {insurance.insurance.provider}</p>
                                <p>Start Date: {insurance.insurance.start_date}</p>
                                <p>End Date: {insurance.insurance.end_date}</p>
                                <p>Premium: ${insurance.insurance.premium}</p>
                                <p>Deductible: ${insurance.insurance.deductible}</p>
                                {insurance.insurance.notes && (
                                    <p>Notes: {insurance.insurance.notes}</p>
                                )}
                                <button onClick={() => handleEditInsurance(insurance)}>Edit</button>
                                <button onClick={() => handleDeleteInsurance(insurance.house_id || insurance.vehicle_id || insurance.rental_id || insurance.property_id || insurance.pet_id || insurance.policy_id, type)}>Delete</button>
                            </>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );

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
                {renderInsuranceSection('House Insurance', houseInsurance, 'house_insurance')}
                {renderInsuranceSection('Car Insurance', carInsurance, 'car_insurance')}
                {renderInsuranceSection('Renters Insurance', rentersInsurance, 'renters_insurance')}
                {renderInsuranceSection('Flood Insurance', floodInsurance, 'flood_insurance')}
                {renderInsuranceSection('Earthquake Insurance', earthquakeInsurance, 'earthquake_insurance')}
                {renderInsuranceSection('Umbrella Insurance', umbrellaInsurance, 'umbrella_insurance')}
                {renderInsuranceSection('Pet Insurance', petInsurance, 'pet_insurance')}
                <div className="add-insurance-section">
                    <h2>Add New Insurance</h2>
                    <div className="card">
                        <div className="card-content">
                            <select name="type" onChange={(e) => setNewInsurance({ ...newInsurance, type: e.target.value })}>
                                <option value="">Select Insurance Type</option>
                                <option value="house_insurance">House Insurance</option>
                                <option value="car_insurance">Car Insurance</option>
                                <option value="renters_insurance">Renters Insurance</option>
                                <option value="flood_insurance">Flood Insurance</option>
                                <option value="earthquake_insurance">Earthquake Insurance</option>
                                <option value="umbrella_insurance">Umbrella Insurance</option>
                                <option value="pet_insurance">Pet Insurance</option>
                            </select>
                            <input
                                type="text"
                                name="address"
                                placeholder="Address (if applicable)"
                                value={newInsurance.address || ''}
                                onChange={(e) => handleInputChange(e, newInsurance, setNewInsurance)}
                            />
                            <input
                                type="text"
                                name="make"
                                placeholder="Make (if applicable)"
                                value={newInsurance.make || ''}
                                onChange={(e) => handleInputChange(e, newInsurance, setNewInsurance)}
                            />
                            <input
                                type="text"
                                name="model"
                                placeholder="Model (if applicable)"
                                value={newInsurance.model || ''}
                                onChange={(e) => handleInputChange(e, newInsurance, setNewInsurance)}
                            />
                            <input
                                type="number"
                                name="year"
                                placeholder="Year (if applicable)"
                                value={newInsurance.year || ''}
                                onChange={(e) => handleInputChange(e, newInsurance, setNewInsurance)}
                            />
                            <input
                                type="text"
                                name="vin"
                                placeholder="VIN (if applicable)"
                                value={newInsurance.vin || ''}
                                onChange={(e) => handleInputChange(e, newInsurance, setNewInsurance)}
                            />
                            <input
                                type="text"
                                name="pet_name"
                                placeholder="Pet Name (if applicable)"
                                value={newInsurance.pet_name || ''}
                                onChange={(e) => handleInputChange(e, newInsurance, setNewInsurance)}
                            />
                            <input
                                type="text"
                                name="policy_number"
                                placeholder="Policy Number"
                                value={newInsurance.policy_number || ''}
                                onChange={(e) => handleInputChange(e, newInsurance, setNewInsurance)}
                            />
                            <input
                                type="text"
                                name="provider"
                                placeholder="Provider"
                                value={newInsurance.provider || ''}
                                onChange={(e) => handleInputChange(e, newInsurance, setNewInsurance)}
                            />
                            <input
                                type="date"
                                name="start_date"
                                placeholder="Start Date"
                                value={newInsurance.start_date || ''}
                                onChange={(e) => handleInputChange(e, newInsurance, setNewInsurance)}
                            />
                            <input
                                type="date"
                                name="end_date"
                                placeholder="End Date"
                                value={newInsurance.end_date || ''}
                                onChange={(e) => handleInputChange(e, newInsurance, setNewInsurance)}
                            />
                            <input
                                type="number"
                                name="premium"
                                placeholder="Premium"
                                value={newInsurance.premium || ''}
                                onChange={(e) => handleInputChange(e, newInsurance, setNewInsurance)}
                            />
                            <input
                                type="number"
                                name="deductible"
                                placeholder="Deductible"
                                value={newInsurance.deductible || ''}
                                onChange={(e) => handleInputChange(e, newInsurance, setNewInsurance)}
                            />
                            <textarea
                                name="notes"
                                placeholder="Notes"
                                value={newInsurance.notes || ''}
                                onChange={(e) => handleInputChange(e, newInsurance, setNewInsurance)}
                            />
                            <button onClick={() => handleAddInsurance(newInsurance.type)}>Add Insurance</button>
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

export default InsuranceRecordsModalContent;
