import React, { useState } from 'react';
import './DefaultModalContent.css';

import {
    FaBriefcase, FaBuilding, FaMapMarkerAlt, FaMoneyBillWave, FaClipboardList, FaLink,
    FaCalendarAlt, FaCheckCircle, FaHourglassHalf, FaRegTimesCircle
} from 'react-icons/fa'; // Importing icons from FontAwesome

const JobSearchModalContent = ({ node, onRequestClose }) => {
    const { details } = node || {}; // Ensure node is defined, fallback to an empty object
    const currentSearchResults = details?.current_search_results || {};
    const criteria = currentSearchResults?.criteria || {};

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
                        <h1>{criteria.keywords?.join(', ') || 'No Keywords'}</h1>
                        <p>{criteria.location || 'Any Location'}</p>
                    </>
                )}
                <a href="#" className="toggle-link" onClick={toggleView}>
                    {isCompactView ? 'Expanded View' : 'Compact View'}
                </a>
            </div>
            <div className={`content ${isCompactView ? 'compact' : ''}`}>
                {details && (
                    <>
                        {/* Current Job Search Results */}
                        <div className="section">
                            <h2>Current Job Search Results</h2>
                            {currentSearchResults.postings?.map((job, index) => (
                                <div key={index} className="job-posting">
                                    <FaBriefcase className="icon" />
                                    <h3>{job.title}</h3>
                                    <p><FaBuilding /> {job.company}</p>
                                    <p><FaMapMarkerAlt /> {job.location}</p>
                                    {job.salary_range && <p><FaMoneyBillWave /> {job.salary_range}</p>}
                                    <p>{job.description}</p>
                                    <p><FaClipboardList /> Requirements: {job.requirements.join(', ')}</p>
                                    <p><FaLink /> <a href={job.application_url} target="_blank" rel="noopener noreferrer">Apply Here</a></p>
                                </div>
                            ))}
                        </div>

                        {/* Job Applications */}
                        <div className="section">
                            <h2>Job Applications</h2>
                            <table className="generic-table">
                                <thead>
                                <tr>
                                    <th>Job Title</th>
                                    <th>Company</th>
                                    <th>Application Date</th>
                                    <th>Status</th>
                                    <th>Follow-Up Date</th>
                                </tr>
                                </thead>
                                <tbody>
                                {details.applications?.map((application, index) => (
                                    <tr key={index}>
                                        <td>{application.job_posting.title}</td>
                                        <td>{application.job_posting.company}</td>
                                        <td><FaCalendarAlt /> {application.application_date}</td>
                                        <td>
                                            {application.status === 'applied' && <FaHourglassHalf className="status-icon applied" />}
                                            {application.status === 'interviewing' && <FaCheckCircle className="status-icon interviewing" />}
                                            {application.status === 'rejected' && <FaRegTimesCircle className="status-icon rejected" />}
                                            {application.status}
                                        </td>
                                        <td>{application.follow_up_date || 'N/A'}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Insights */}
                        <div className="section">
                            <h2>Insights</h2>
                            <p>{details.insights}</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default JobSearchModalContent;
