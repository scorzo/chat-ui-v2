import React from 'react';
import './DefaultModalContent.css';

const ResumeModalContent = ({ node, onRequestClose }) => {
    const { details } = node || {}; // Ensure node is defined, fallback to an empty object

    return (
        <div className="modal-container">
            <div className="header">
                {details && details.contact_information && (
                    <>
                        <h1>{details.contact_information.name}</h1>
                        <p>
                            {details.contact_information.job_title} •
                            {details.contact_information.city}, {details.contact_information.state_zip} •
                            {details.contact_information.phone_number} •
                            {details.contact_information.email} •
                            <a href={details.contact_information.linkedin_url} target="_blank" rel="noopener noreferrer">
                                LinkedIn
                            </a>
                        </p>
                    </>
                )}
            </div>
            <div className="content">
                {details && (
                    <>
                        {/* Resume Summary */}
                        <div className="section">
                            <h2>Resume Summary</h2>
                            <p>{details.resume_summary?.summary}</p>
                        </div>

                        {/* Work Experience */}
                        <div className="section">
                            <h2>Work Experience</h2>
                            {details.work_experience?.map((job, index) => (
                                <div key={index} className="work-experience-item">
                                    <h3>{job.job_title}</h3>
                                    <p>{job.company}, {job.location}</p>
                                    <p>{job.start_date} - {job.end_date || 'Present'}</p>
                                    <p>{job.work_experience_summary}</p>
                                </div>
                            ))}
                        </div>

                        {/* Education */}
                        <div className="section">
                            <h2>Education</h2>
                            {details.education?.map((edu, index) => (
                                <div key={index} className="education-item">
                                    <h3>{edu.degree}</h3>
                                    <p>{edu.college_name}, {edu.location}</p>
                                    <p>Graduation Year: {edu.graduation_year}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ResumeModalContent;
