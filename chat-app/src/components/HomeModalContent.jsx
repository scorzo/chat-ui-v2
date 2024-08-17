import React, { useState } from 'react';
import './DefaultModalContent.css';
import './HomeModalContent.css'; // Additional CSS for home theme
import homeImage from './defaultImage.jpg'; // Home-themed image

const HomeModalContent = ({ node, sunburstGraphRef, onRequestClose }) => {
    const { details } = node;
    console.log('Rendering HomeModalContent with node:', node);
    const rooms = details?.structure?.rooms || [];
    const hvac = details?.hvac || {};
    const plumbing = details?.plumbing || {};
    const electrical = details?.electrical || {};
    const roofAndInsulation = details?.roof_and_insulation || {};
    const smartDevices = details?.smart_devices || [];
    const parking = details?.parking || {};
    const virtualTour = details?.virtual_tour || {};
    const bedroomInfo = details?.bedroom_info || {};
    const bathroomInfo = details?.bathroom_info || {};
    const interiorFeatures = details?.interior_features || {};
    const heatingCooling = details?.heating_cooling || {};
    const exteriorFeatures = details?.exterior_features || {};
    const buildingInfo = details?.building_info || {};
    const propertyFeatures = details?.property_features || {};
    const lotInfo = details?.lot_info || {};
    const utilityInfo = details?.utility_info || {};
    const waterInfo = details?.water_info || {};
    const multiUnitInfo = details?.multi_unit_info || {};
    const schoolInfo = details?.school_info || {};

    const [isCompactView, setIsCompactView] = useState(true);
    const [updateUrlMode, setUpdateUrlMode] = useState(false);
    const [redfinUrl, setRedfinUrl] = useState('');
    const [cssClass, setCssClass] = useState('');

    const toggleView = (event) => {
        event.preventDefault();
        setIsCompactView(!isCompactView);
    };

    const handleUpdateUrlChange = (e) => {
        setRedfinUrl(e.target.value);
    };

    const handleCssClassChange = (e) => {
        setCssClass(e.target.value);
    };

    const handleUpdateRedfinUrl = async () => {
        if (!redfinUrl) {
            alert('Please provide a Redfin URL.');
            return;
        }

        if (!window.confirm('Are you sure you want to update the data from this Redfin URL?')) {
            return;
        }

        try {
            const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/scrape_redfin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: redfinUrl, css_class: cssClass }),
            });
            const result = await response.json();

            if (result.success) {
                alert('Data updated successfully.');
                setUpdateUrlMode(false);
                if (sunburstGraphRef.current) {
                    sunburstGraphRef.current.refresh(); // Call refresh method
                }
                // Assuming the result contains the updated details in the correct format
                // Update the state with the new details here if necessary
            } else {
                alert('Failed to update data: ' + result.message);
            }
        } catch (error) {
            alert('An error occurred while updating data: ' + error.message);
        }
    };

    return (
        <div className="modal-container">
            <div className="header">
                {details && (
                    <>
                        <h1>{details.name}</h1>
                        <p>A digital twin for your home.</p>
                    </>
                )}
                <a href="#" className="toggle-link" onClick={toggleView}>
                    {isCompactView ? 'Expanded View' : 'Compact View'}
                </a>
                <button onClick={() => setUpdateUrlMode(!updateUrlMode)}>Update Redfin Source</button>
                {updateUrlMode && (
                    <div className="update-url-section">
                        <input
                            type="text"
                            placeholder="Enter Redfin URL"
                            value={redfinUrl}
                            onChange={handleUpdateUrlChange}
                        />
                        {/*<input*/}
                        {/*    type="text"*/}
                        {/*    placeholder="Enter CSS Class (Optional)"*/}
                        {/*    value={cssClass}*/}
                        {/*    onChange={handleCssClassChange}*/}
                        {/*/>*/}
                        <button onClick={handleUpdateRedfinUrl}>Update</button>
                    </div>
                )}
            </div>
            <div className={`content ${isCompactView ? 'compact' : ''}`}>
                <>
                    {details?.address && (
                        <div className="address-section">
                            <h2>Address</h2>
                            <p>{details.address}</p>
                        </div>
                    )}
                    {details?.description && (
                        <div className="description-section">
                            <h2>Description</h2>
                            <p>{details.description}</p>
                        </div>
                    )}
                    {Object.keys(parking).length > 0 && (
                        <div className="parking-section">
                            <h2>Parking</h2>
                            <p>Garage (Minimum): {parking.garage_minimum}</p>
                            <p>Garage (Maximum): {parking.garage_maximum}</p>
                            <p>Parking Description: {parking.parking_description}</p>
                            <p>Electric Vehicle Hookup Type: {parking.ev_hookup_type}</p>
                            <p>Garage Spaces: {parking.garage_spaces}</p>
                        </div>
                    )}
                    {Object.keys(virtualTour).length > 0 && (
                        <div className="virtual-tour-section">
                            <h2>Virtual Tour</h2>
                            <p><a href={virtualTour.branded_tour} target="_blank" rel="noopener noreferrer">Branded Virtual Tour</a></p>
                            <p><a href={virtualTour.unbranded_tour} target="_blank" rel="noopener noreferrer">Unbranded Virtual Tour</a></p>
                        </div>
                    )}
                    {Object.keys(bedroomInfo).length > 0 && (
                        <div className="bedroom-info-section">
                            <h2>Bedroom Information</h2>
                            <p># of Bedrooms (Minimum): {bedroomInfo.bedrooms_minimum}</p>
                            <p># of Bedrooms (Maximum): {bedroomInfo.bedrooms_maximum}</p>
                            <p>Bedrooms: {bedroomInfo.bedroom_types.join(', ')}</p>
                        </div>
                    )}
                    {Object.keys(bathroomInfo).length > 0 && (
                        <div className="bathroom-info-section">
                            <h2>Bathroom Information</h2>
                            <p># of Baths (Full): {bathroomInfo.baths_full}</p>
                            <p># of Baths (1/2): {bathroomInfo.baths_half}</p>
                            <p>Bathroom Description: {bathroomInfo.bathroom_description}</p>
                        </div>
                    )}
                    {Object.keys(interiorFeatures).length > 0 && (
                        <div className="interior-features-section">
                            <h2>Interior Features</h2>
                            <p>Laundry: {interiorFeatures.laundry.join(', ')}</p>
                            <p>Flooring: {interiorFeatures.flooring.join(', ')}</p>
                            <p>Has Fireplace: {interiorFeatures.has_fireplace ? 'Yes' : 'No'}</p>
                            <p>Fireplace Description: {interiorFeatures.fireplace_description}</p>
                            <p>Fireplaces (Minimum): {interiorFeatures.fireplaces_minimum}</p>
                        </div>
                    )}
                    {Object.keys(heatingCooling).length > 0 && (
                        <div className="heating-cooling-section">
                            <h2>Heating and Cooling</h2>
                            <p>Cooling: {heatingCooling.cooling}</p>
                            <p>Heating: {heatingCooling.heating}</p>
                        </div>
                    )}
                    {Object.keys(exteriorFeatures).length > 0 && (
                        <div className="exterior-features-section">
                            <h2>Exterior Features</h2>
                            <p>Roof: {exteriorFeatures.roof}</p>
                        </div>
                    )}
                    {Object.keys(buildingInfo).length > 0 && (
                        <div className="building-info-section">
                            <h2>Building Information</h2>
                            <p>Building Type: {buildingInfo.building_type}</p>
                            <p>Construction Type: {buildingInfo.construction_type.join(', ')}</p>
                        </div>
                    )}
                    {Object.keys(propertyFeatures).length > 0 && (
                        <div className="property-features-section">
                            <h2>Property Features</h2>
                            <p>Amenities: {propertyFeatures.amenities.join(', ')}</p>
                            <p>Communication: {propertyFeatures.communication}</p>
                            <p>Living Area: {propertyFeatures.living_sq_ft} sq ft</p>
                            <p>Security Features: {propertyFeatures.security_features}</p>
                        </div>
                    )}
                    {Object.keys(lotInfo).length > 0 && (
                        <div className="lot-info-section">
                            <h2>Lot Information</h2>
                            <p>Lot Acres: {lotInfo.lot_acres}</p>
                            <p>Lot Description: {lotInfo.lot_description}</p>
                            <p>Lot Size (Min): {lotInfo.lot_size_area_minimum_units}</p>
                            <p>Lot Size (Max): {lotInfo.lot_size_area_maximum_units}</p>
                            <p>Lot Size Source: {lotInfo.lot_size_source}</p>
                            <p>Zoning: {lotInfo.zoning}</p>
                        </div>
                    )}
                    {Object.keys(utilityInfo).length > 0 && (
                        <div className="utility-info-section">
                            <h2>Utility Information</h2>
                            <p>Energy Features: {utilityInfo.energy_features}</p>
                            <p>Sewer/Septic: {utilityInfo.sewer_septic}</p>
                            <p>Utilities: {utilityInfo.utilities}</p>
                        </div>
                    )}
                    {Object.keys(waterInfo).length > 0 && (
                        <div className="water-info-section">
                            <h2>Water Information</h2>
                            <p>Water: {waterInfo.water}</p>
                        </div>
                    )}
                    {Object.keys(multiUnitInfo).length > 0 && (
                        <div className="multi-unit-info-section">
                            <h2>Multi-Unit Information</h2>
                            <p>Stories: {multiUnitInfo.stories}</p>
                        </div>
                    )}
                    {Object.keys(schoolInfo).length > 0 && (
                        <div className="school-info-section">
                            <h2>School Information</h2>
                            <p>Elementary School: {schoolInfo.elementary_school}</p>
                            <p>Elementary School District: {schoolInfo.elementary_school_district}</p>
                            <p>Middle School: {schoolInfo.middle_school}</p>
                            <p>High School: {schoolInfo.high_school}</p>
                            <p>High School District: {schoolInfo.high_school_district}</p>
                        </div>
                    )}
                </>
                {rooms.length > 0 && (
                    <div className="rooms-section">
                        <h2>Rooms</h2>
                        {isCompactView ? (
                            <table className="compact-table">
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Dimensions</th>
                                    <th>Wall Material</th>
                                    <th>Description</th>
                                </tr>
                                </thead>
                                <tbody>
                                {rooms.map((room, index) => (
                                    <tr key={index}>
                                        <td>{room.name}</td>
                                        <td>{`${room.dimensions.length}m x ${room.dimensions.width}m x ${room.dimensions.height}m`}</td>
                                        <td>{room.wall_material}</td>
                                        <td>{room.description}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            rooms.map((room, index) => (
                                <div className="card" key={index}>
                                    <img src={homeImage} alt="Room" className="room-image" />
                                    <div className="card-content">
                                        <h3>{room.name}</h3>
                                        <p>Dimensions: {`${room.dimensions.length}m x ${room.dimensions.width}m x ${room.dimensions.height}m`}</p>
                                        <p>Wall Material: {room.wall_material}</p>
                                        <p>Description: {room.description}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
                {Object.keys(hvac).length > 0 && (
                    <div className="hvac-section">
                        <h2>HVAC System</h2>
                        <div className="card">
                            <img src={homeImage} alt="HVAC" className="hvac-image" />
                            <div className="card-content">
                                <h3>{hvac.type}</h3>
                                <p>Age: {hvac.age} years</p>
                                <h4>Maintenance History:</h4>
                                <ul>
                                    {hvac.maintenance_history.map((record, index) => (
                                        <li key={index}>{record.date}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
                {Object.keys(plumbing).length > 0 && (
                    <div className="plumbing-section">
                        <h2>Plumbing</h2>
                        <div className="card">
                            <img src={homeImage} alt="Plumbing" className="plumbing-image" />
                            <div className="card-content">
                                <h3>Pipes</h3>
                                <p>Material: {plumbing.pipes.material}</p>
                                <p>Locations: {plumbing.pipes.locations.join(', ')}</p>
                                <h3>Water Heater</h3>
                                <p>Type: {plumbing.water_heater.type}</p>
                                <p>Age: {plumbing.water_heater.age} years</p>
                                <p>Specifications: Capacity - {plumbing.water_heater.specifications.capacity}, Power - {plumbing.water_heater.specifications.power}</p>
                            </div>
                        </div>
                    </div>
                )}
                {Object.keys(electrical).length > 0 && (
                    <div className="electrical-section">
                        <h2>Electrical System</h2>
                        <div className="card">
                            <img src={homeImage} alt="Electrical" className="electrical-image" />
                            <div className="card-content">
                                <h3>Circuit Breaker</h3>
                                <p>Manufacturer: {electrical.circuit_breaker.manufacturer}</p>
                                <p>Model: {electrical.circuit_breaker.model}</p>
                                <p>Age: {electrical.circuit_breaker.age} years</p>
                                <h3>Wiring</h3>
                                <p>Type: {electrical.wiring.type}</p>
                                <p>Age: {electrical.wiring.age} years</p>
                                <h3>Appliances</h3>
                                <ul>
                                    {electrical.appliances.map((appliance, index) => (
                                        <li key={index}>
                                            {appliance.name} - {appliance.manufacturer} {appliance.model} (Age: {appliance.age} years)
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
                {Object.keys(roofAndInsulation).length > 0 && (
                    <div className="roof-insulation-section">
                        <h2>Roof and Insulation</h2>
                        <div className="card">
                            <img src={homeImage} alt="Roof and Insulation" className="roof-insulation-image" />
                            <div className="card-content">
                                <h3>Roof</h3>
                                <p>Type: {roofAndInsulation.roof.type}</p>
                                <p>Age: {roofAndInsulation.roof.age} years</p>
                                <h3>Insulation</h3>
                                <p>Type: {roofAndInsulation.insulation.type}</p>
                                <p>R-value: {roofAndInsulation.insulation.r_value}</p>
                            </div>
                        </div>
                    </div>
                )}
                {smartDevices.length > 0 && (
                    <div className="smart-devices-section">
                        <h2>Smart Devices</h2>
                        {isCompactView ? (
                            <table className="compact-table">
                                <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Manufacturer</th>
                                    <th>Model</th>
                                    <th>Connected</th>
                                </tr>
                                </thead>
                                <tbody>
                                {smartDevices.map((device, index) => (
                                    <tr key={index}>
                                        <td>{device.name}</td>
                                        <td>{device.manufacturer}</td>
                                        <td>{device.model}</td>
                                        <td>{device.connected ? 'Yes' : 'No'}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            smartDevices.map((device, index) => (
                                <div className="card" key={index}>
                                    <img src={homeImage} alt="Smart Device" className="smart-device-image" />
                                    <div className="card-content">
                                        <h3>{device.name}</h3>
                                        <p>Manufacturer: {device.manufacturer}</p>
                                        <p>Model: {device.model}</p>
                                        <p>Connected: {device.connected ? 'Yes' : 'No'}</p>
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
                </div>
            )}
        </div>
    );
};

export default HomeModalContent;
