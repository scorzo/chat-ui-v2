import React, { useState, useEffect, useRef } from 'react';
import './FloatingChatWindow.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserCircle} from "@fortawesome/free-solid-svg-icons";

const FloatingChatWindow = ({ handleSendMessage, messages, sunburstGraphRef, handleNavigateToNode, toggleMenu, handleLogout, menuVisible }) => {
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    const sendMessage = async () => {
        if (inputValue.trim() !== '') {
            setInputValue('');  // Clear the input
            resetTextareaHeight(); // Reset textarea height
            await handleSendMessage(inputValue);
        }
    };

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
        autoResizeTextarea();
    };

    const autoResizeTextarea = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto'; // Reset the height
            textarea.style.height = `${textarea.scrollHeight}px`; // Set height based on scroll height
        }
    };

    const resetTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = '40px'; // Reset to the initial height
        }
    };

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    useEffect(() => {
        window.handleNavigateToNode = handleNavigateToNode;

        return () => {
            delete window.handleNavigateToNode;
        };
    }, [handleNavigateToNode]);

    const convertNewlinesToBreaksString = (text) => {
        return text.replace(/\n/g, '<br />');
    };

    return (
        <div className="FloatingChatWindow">
            <div className="header">
                <div className="user-info">
                    <FontAwesomeIcon icon={faUserCircle} size="2x" onClick={toggleMenu} className="user-icon" />
                    {menuVisible && (
                        <div className="preferences-menu">
                            <button onClick={() => window.open('http://localhost:3001/', 'AdminConsoleWindow')} className="menu-item">Admin Console</button>
                            <button onClick={handleLogout} className="menu-item">Log out</button>
                        </div>
                    )}
                </div>
            </div>
            <div className="messages">
                {messages.map((message, index) => (
                    <div key={index} className={`message ${message.position}`}>
                        {(message.type === 'text' || message.type === 'html') ? (
                            <span dangerouslySetInnerHTML={{ __html: convertNewlinesToBreaksString(message.text) }} />
                        ) : (
                            convertNewlinesToBreaksString(message.text)
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="input-container">
                <div className="rce-input-wrapper">
                    <textarea
                        ref={textareaRef}
                        className="rce-input"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyPress={async (event) => {
                            if (event.key === 'Enter' && !event.shiftKey) {
                                event.preventDefault(); // Prevent new line on Enter
                                await sendMessage();
                            }
                        }}
                        rows={1}
                    />
                    <label className="rce-floating-label">Type your message...</label>
                </div>
                <button onClick={async () => {
                    await sendMessage();
                }}>Send</button>
            </div>
        </div>
    );
};

export default FloatingChatWindow;
