import React, { useState, useEffect } from 'react';
import './DefaultModalContent.css'; // Reference to the stylesheet
import './HouseholdMaintenanceModalContent.css'; // Reference to the stylesheet
import defaultImage from './defaultImage.jpg'; // Default image for all instances
import axios from 'axios';

const HouseholdMaintenanceModalContent = ({ node, sunburstGraphRef, onRequestClose }) => {

    const { details } = node;

    const [isCompactView, setIsCompactView] = useState(true);
    const [tasks, setTasks] = useState(details?.tasks || []);
    const [newTask, setNewTask] = useState({});
    const [editedTask, setEditedTask] = useState(null);

    useEffect(() => {
        if (details?.tasks) {
            setTasks(details.tasks);
        }
    }, [details]);

    const toggleView = (event) => {
        event.preventDefault();
        setIsCompactView(!isCompactView);
    };

    const handleInputChange = (e, task, setTask) => {
        const { name, value } = e.target;
        if (name === 'tools_required') {
            setTask({ ...task, [name]: value.split(',').map(tool => tool.trim()) });
        } else {
            setTask({ ...task, [name]: value });
        }
    };

    const handleAddTask = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_ENDPOINT}/nodes/${node.node_id}/tasks`, newTask);
            setTasks([...tasks, response.data]);
            setNewTask({});
        } catch (error) {
            console.error("There was an error adding the task!", error);
        }
    };

    const handleEditTask = (task) => setEditedTask(task);

    const handleSaveTask = async () => {
        try {
            const response = await axios.put(`${process.env.REACT_APP_API_ENDPOINT}/nodes/${node.node_id}/tasks/${editedTask.task_id}`, editedTask);
            const updatedTasks = tasks.map((task) => (task.task_id === editedTask.task_id ? response.data : task));
            setTasks(updatedTasks);
            setEditedTask(null);
        } catch (error) {
            console.error("There was an error saving the task!", error);
        }
    };

    const handleDeleteTask = async (task_id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_ENDPOINT}/nodes/${node.node_id}/tasks/${task_id}`);
            setTasks(tasks.filter(task => task.task_id !== task_id));
        } catch (error) {
            console.error("There was an error deleting the task!", error);
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
                {tasks.length > 0 && (
                    <div className="tasks-section">
                        <h2>Maintenance Tasks</h2>
                        {tasks.map(task => (
                            <div className="card" key={task.task_id}>
                                <img src={defaultImage} alt="Task" className="task-image" />
                                <div className="card-content">
                                    {editedTask && editedTask.task_id === task.task_id ? (
                                        <>
                                            <input
                                                type="text"
                                                name="name"
                                                value={editedTask.name}
                                                onChange={(e) => handleInputChange(e, editedTask, setEditedTask)}
                                            />
                                            <input
                                                type="text"
                                                name="description"
                                                value={editedTask.description}
                                                onChange={(e) => handleInputChange(e, editedTask, setEditedTask)}
                                            />
                                            <input
                                                type="date"
                                                name="scheduled_date"
                                                value={editedTask.scheduled_date}
                                                onChange={(e) => handleInputChange(e, editedTask, setEditedTask)}
                                            />
                                            <input
                                                type="number"
                                                name="projected_cost"
                                                value={editedTask.projected_cost}
                                                onChange={(e) => handleInputChange(e, editedTask, setEditedTask)}
                                            />
                                            <textarea
                                                name="tools_required"
                                                value={Array.isArray(editedTask?.tools_required) ? editedTask.tools_required.join(', ') : editedTask?.tools_required || ''}
                                                onChange={(e) => handleInputChange(e, editedTask, setEditedTask)}
                                            />
                                            <button onClick={handleSaveTask}>Save</button>
                                        </>
                                    ) : (
                                        <>
                                            <h3>{task.name}</h3>
                                            {task.scheduled_date && (
                                                <p>Scheduled Date: {task.scheduled_date}</p>
                                            )}
                                            {task.projected_cost && (
                                                <p>Projected Cost: ${task.projected_cost}</p>
                                            )}
                                            {task.tools_required && task.tools_required.length > 0 && (
                                                <p>Tools Required: {task.tools_required.join(', ')}</p>
                                            )}
                                            {task.contractor_details && (
                                                <div>
                                                    <h4>Contractor Details:</h4>
                                                    <p>Name: {task.contractor_details.name}</p>
                                                    <p>Contact: {task.contractor_details.contact_number}</p>
                                                    {task.contractor_details.email && (
                                                        <p>Email: {task.contractor_details.email}</p>
                                                    )}
                                                    {task.contractor_details.company_url && (
                                                        <a href={task.contractor_details.company_url} target="_blank" rel="noopener noreferrer">Company Website</a>
                                                    )}
                                                </div>
                                            )}
                                            <button onClick={() => handleEditTask(task)}>Edit</button>
                                            <button onClick={() => handleDeleteTask(task.task_id)}>Delete</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="add-task-section">
                    <h2>Add New Task</h2>
                    <div className="card">
                        <div className="card-content">
                            <input
                                type="text"
                                name="name"
                                placeholder="Task Name"
                                value={newTask.name || ''}
                                onChange={(e) => handleInputChange(e, newTask, setNewTask)}
                            />
                            <input
                                type="text"
                                name="description"
                                placeholder="Description"
                                value={newTask.description || ''}
                                onChange={(e) => handleInputChange(e, newTask, setNewTask)}
                            />
                            <input
                                type="date"
                                name="scheduled_date"
                                placeholder="Scheduled Date"
                                value={newTask.scheduled_date || ''}
                                onChange={(e) => handleInputChange(e, newTask, setNewTask)}
                            />
                            <input
                                type="number"
                                name="projected_cost"
                                placeholder="Projected Cost"
                                value={newTask.projected_cost || ''}
                                onChange={(e) => handleInputChange(e, newTask, setNewTask)}
                            />
                            <textarea
                                name="tools_required"
                                placeholder="Tools Required"
                                value={newTask.tools_required || ''}
                                onChange={(e) => handleInputChange(e, newTask, setNewTask)}
                            />
                            <button onClick={handleAddTask}>Add Task</button>
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

export default HouseholdMaintenanceModalContent;
