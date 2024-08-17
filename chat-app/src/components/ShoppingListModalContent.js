import React, { useState } from 'react';
import './DefaultModalContent.css'; // Reference to the stylesheet
import defaultImage from './defaultImage.jpg'; // Default image for all instances

const ShoppingListModalContent = ({ node, sunburstGraphRef, onRequestClose }) => {
    const { details } = node;
    const orders = details?.orders || [];
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
                        {details.description && <p>{details.description}</p>}
                    </>
                )}
                <a href="#" className="toggle-link" onClick={toggleView}>
                    {isCompactView ? 'Expanded View' : 'Compact View'}
                </a>
            </div>
            <div className={`content ${isCompactView ? 'compact' : ''}`}>
                {orders.length > 0 && (
                    <div className="orders-section">
                        <h2>Orders</h2>
                        {isCompactView ? (
                            <table className="compact-table">
                                <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Order Date</th>
                                    <th>Delivery Date</th>
                                    <th>Total Price</th>
                                    <th>Items</th>
                                </tr>
                                </thead>
                                <tbody>
                                {orders.map(order => (
                                    <tr key={order.order_id}>
                                        <td>{order.order_id}</td>
                                        <td>{order.order_date}</td>
                                        <td>{order.delivery_date}</td>
                                        <td>{order.currency} {order.total_price}</td>
                                        <td>
                                            <ul>
                                                {order.items.map(item => (
                                                    <li key={item.item_id}>
                                                        {item.name} ({item.quantity})
                                                    </li>
                                                ))}
                                            </ul>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        ) : (
                            orders.map(order => (
                                <div className="card" key={order.order_id}>
                                    <img src={defaultImage} alt="Order" className="order-image" />
                                    <div className="card-content">
                                        <h3>Order ID: {order.order_id}</h3>
                                        {order.order_date && (
                                            <p>Order Date: {order.order_date}</p>
                                        )}
                                        {order.delivery_date && (
                                            <p>Delivery Date: {order.delivery_date}</p>
                                        )}
                                        {order.total_price && order.currency && (
                                            <p>Total Price: {order.currency} {order.total_price}</p>
                                        )}
                                        {order.delivery_address && (
                                            <p>Delivery Address: {order.delivery_address}</p>
                                        )}
                                        {order.recurrence && (
                                            <div>
                                                <p>Recurrence: {order.recurrence.frequency}</p>
                                                {order.recurrence.start_date && (
                                                    <p>Start Date: {order.recurrence.start_date}</p>
                                                )}
                                                {order.recurrence.end_date && (
                                                    <p>End Date: {order.recurrence.end_date}</p>
                                                )}
                                            </div>
                                        )}
                                        {order.notes && (
                                            <p>Notes: {order.notes}</p>
                                        )}
                                        {order.order_url && (
                                            <a href={order.order_url} className="button" target="_blank" rel="noopener noreferrer">View Order</a>
                                        )}
                                        <div className="order-items">
                                            <h4>Items:</h4>
                                            <ul>
                                                {order.items.map(item => (
                                                    <li key={item.item_id}>
                                                        {item.name}: {item.currency} {item.price_per_unit} x {item.quantity} ({item.category})
                                                        {item.notes && <p>Notes: {item.notes}</p>}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
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

export default ShoppingListModalContent;
