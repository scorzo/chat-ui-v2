import React, { useState, useEffect, useRef, useCallback } from 'react';
import SplitPane from 'react-split-pane';
import './App.css';
import 'react-chat-elements/dist/main.css'; // Import chat elements style

import Threads from './components/Threads'; // Ensure you import the Threads component
import NodeGraph from './components/NodeGraph'; // Update path if necessary
import FloatingChatWindow from './components/FloatingChatWindow'; // Import FloatingChatWindow component

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faColumns } from '@fortawesome/free-solid-svg-icons';

import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

import { jwtDecode } from "jwt-decode";


// Variables with initial values
let assistant_id = '';

// Define file_ids in a central location - example ['file-aWJB3NOKHiJnfKgTyKrWgjo8'];
const file_ids = [];

// Function to set the active assistant ID
function setActiveAssistantId(newAssistantId) {
    assistant_id = newAssistantId;
    console.log(`Updated assistant_id: ${assistant_id}`);
}

const Sidebar = ({ position, content, isCollapsed, toggleSidebar, createNewThread, fetchThreadMessages, setMessages }) => (
    <div className={`sidebar ${position} ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">



            <button className="toggle-button" onClick={toggleSidebar}>
                <FontAwesomeIcon icon={faColumns} />
            </button>
            {!isCollapsed && (
                <button className="new-thread-button" onClick={async () => {
                    await createNewThread();  // Await createNewThread to ensure it completes
                    setMessages([]);
                }}>
                    <FontAwesomeIcon icon={faPen} />
                </button>
            )}
        </div>
        {!isCollapsed && (
            <div className="sidebar-content">
                {content || (position === "left" ? "" : "Right Sidebar")}
            </div>
        )}
    </div>
);

function App() {
    const [messages, setMessages] = useState([]);
    const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
    const [nodesData, setNodesData] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [menuVisible, setMenuVisible] = useState(false); // Manage visibility of preferences menu
    const sunburstGraphRef = useRef(); // Add a reference for SunburstGraph

    const fetchNodesData = async () => {
        try {
            // Get the JWT token from localStorage
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                throw new Error('No JWT token found. Please log in.');
            }

            // Include the token in the Authorization header
            const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/nodes`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setNodesData(data);
        } catch (error) {
            console.error('Error fetching nodes data:', error);
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            fetchNodesData();
        }
    }, [isLoggedIn]);

    const [threads, setThreads] = useState([]); // Add state for threads

    const fetchThreads = useCallback(async () => {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 seconds timeout

            // Get the JWT token from localStorage
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                throw new Error('No JWT token found. Please log in.');
            }

            // Include the token in the Authorization header
            const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/threads_get_all`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                signal: controller.signal
            });



            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setThreads(data);
        } catch (error) {
            console.error("Failed to fetch threads:", error);
        }
    }, []); // Empty dependencies array since there are no external dependencies

    const [activeThreadLookupId, setActiveThreadLookupId] = useState(null);

    const createNewThread = async () => {
        // Get the JWT token from localStorage
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            throw new Error('No JWT token found. Please log in.');
        }

        // Include the token in the Authorization header
        const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/thread_create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });

        const { lookup_id, thread_id } = await response.json();
        setActiveThreadLookupId(lookup_id); // triggers re-render of Threads component
        fetchThreads(); // triggers re-render of Threads component by setting threads prop
        return lookup_id; // Return the new lookup_id
    };

    const fetchThreadMessages = async (threadLookupId) => {
        if (!threadLookupId) {
            console.log("No threadLookupId provided, skipping fetch.");
            return;
        }

        // Get the JWT token from localStorage
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            throw new Error('No JWT token found. Please log in.');
        }

        // Construct the API URL
        const apiUrl = `${process.env.REACT_APP_API_ENDPOINT}/thread_messages_get?lookup_id=${threadLookupId}`;

        // Include the token in the Authorization header
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });

        const data = await response.json();
        const formattedMessages = data.map(msg => ({
            position: msg.role.toLowerCase() === 'user' ? 'right' : 'left',
            type: 'text',
            text: msg.text,
            date: new Date(msg.date),
            sender: msg.role,
        }));

        console.log("calling setMessages with Id:", threadLookupId);
        setMessages(formattedMessages);
    };

    const handleSendMessage = async (customMessageText, role = 'user', skipRun = false) => {
        console.log("handleSendMessage called with:", customMessageText, role, skipRun);

        let currentThreadLookupId = activeThreadLookupId;

        const textToSend = customMessageText.trim();
        if (textToSend) {
            const wasThreadEmpty = messages.length === 0; // Check if the thread was empty before adding new message

            const newMessage = {
                position: 'right',
                type: 'text',
                text: textToSend,
                date: new Date(),
                sender: role,
            };
            setMessages([...messages, newMessage]);

            try {
                console.log('Active thread lookup ID:', currentThreadLookupId);

                if (!currentThreadLookupId) {
                    try {
                        console.log('Creating new activeThreadLookupId');
                        currentThreadLookupId = await createNewThread();
                        console.log('New activeThreadLookupId:', currentThreadLookupId);
                    } catch (error) {
                        console.error('Error creating new thread:', error);
                        return;
                    }
                }

                // Get the JWT token from localStorage
                const token = localStorage.getItem('jwtToken');
                if (!token) {
                    throw new Error('No JWT token found. Please log in.');
                }

                // Include the token in the Authorization header
                const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/chat`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        query: textToSend,
                        assistant_id: assistant_id,
                        lookup_id: currentThreadLookupId
                    }),
                });


                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let result = '';

                const processStream = async () => {
                    let fullResult = ''; // Store the full result here

                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) {
                            if (sunburstGraphRef.current) {
                                console.log('SunburstGraph ref is available. Calling refresh...');
                                sunburstGraphRef.current.refresh();
                                console.log('Refresh method called on SunburstGraph.');
                            } else {
                                console.log('SunburstGraph ref is not available.');
                            }
                            break;
                        }
                        result = decoder.decode(value, { stream: true });
                        fullResult += result;

                        setMessages((prevMessages) => {
                            const lastMessage = prevMessages[prevMessages.length - 1];
                            if (lastMessage && lastMessage.sender === 'assistant') {
                                lastMessage.text = fullResult; // Update with full result
                                return [...prevMessages.slice(0, -1), lastMessage];
                            } else {
                                return [
                                    ...prevMessages,
                                    {
                                        position: 'left',
                                        type: 'text',
                                        text: fullResult, // Use full result
                                        date: new Date(),
                                        sender: 'assistant',
                                    }
                                ];
                            }
                        });
                    }
                };

                await processStream(); // Ensure processStream completes

                if (wasThreadEmpty) {
                    // async call to rename thread api
                    try {
                        // Get the JWT token from localStorage
                        const token = localStorage.getItem('jwtToken');
                        if (!token) {
                            throw new Error('No JWT token found. Please log in.');
                        }

                        // Include the token in the Authorization header
                        const response = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/thread_rename`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`,
                            },
                            body: JSON.stringify({ lookup_id: currentThreadLookupId })
                        });


                        if (!response.ok) {
                            throw new Error('Failed to rename thread');
                        }

                        const data = await response.json();
                        console.log('Thread renamed successfully:', data);

                        // update the state or UI with the new thread name
                        fetchThreads();

                    } catch (error) {
                        console.error('Error renaming thread:', error);
                    }
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
    };

    // Function to handle navigation to the node - used for links in messages
    const handleNavigateToNode = (nodeName) => {
        if (sunburstGraphRef && sunburstGraphRef.current) {
            sunburstGraphRef.current.navigateToNode(nodeName);
        } else {
            console.log('SunburstGraph ref is not defined');
        }
    };

    const handleLoginSuccess = async (response) => {
        try {
            // Log the entire response object to inspect its structure
            console.log('Full login response object:', response);

            // Check possible locations for ID token and user data
            const idToken = response.credential || response.tokenId || null;
            console.log('Extracted ID token:', idToken);

            if (idToken) {
                // Send the ID token to your backend for validation
                console.log('Sending ID token to backend for validation...');
                const backendResponse = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id_token: idToken }),
                });
                console.log('Backend response status:', backendResponse.status);

                if (!backendResponse.ok) {
                    throw new Error(`HTTP error! status: ${backendResponse.status}`);
                }

                // Get the JWT from the backend response
                const data = await backendResponse.json();
                console.log('Data received from backend:', data);
                const jwtToken = data.token;
                console.log('JWT token received:', jwtToken);

                // Store the JWT in localStorage or any other secure storage
                localStorage.setItem('jwtToken', jwtToken);
                console.log('JWT token stored in localStorage');

                // Decode the JWT to extract user information
                const decodedToken = jwtDecode(jwtToken);
                console.log('Decoded JWT token:', decodedToken);

                // Update state with user information from the decoded token
                const userData = {
                    userId: decodedToken.user_id,
                    email: decodedToken.email,
                    name: decodedToken.name,
                };
                console.log('User data extracted from JWT:', userData);

                setIsLoggedIn(true);
                setUser(userData);  // Update state with user info
                console.log('Login state updated to true.');
            } else {
                console.warn('ID token not found in response.');
            }

        } catch (error) {
            console.error('Login failed:', error);
            // Handle login failure (e.g., show a notification to the user)
        }
    };

    const handleLogout = () => {
        // 1. Perform Google logout
        googleLogout(); // This logs the user out from Google

        // 2. Remove the JWT token from localStorage
        localStorage.removeItem('jwtToken');

        // 3. Clear any user-related state in your application
        setIsLoggedIn(false);
        setUser(null); // Clear user profile information

        // 4. Optionally, you can redirect the user to a login page or home page
        // window.location.href = '/login';  // Uncomment to redirect after logout
    };



    const toggleMenu = () => {
        setMenuVisible(!menuVisible); // Toggle visibility of the preferences menu
    };


    const toggleLeftSidebar = () => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed);

    return (
        <div className="App">
            {!isLoggedIn ? (
                <div className="login-main">
                    <div className="login-flex">
                        <div className="login-logo">
                            <FontAwesomeIcon icon={faUserCircle} size="3x" />
                        </div>
                    </div>
                    <div className="login-card">
                        <h1 className="login-heading">Sign In</h1>

                        <div className="login-banner login-critical hidden" id="login-password-disabled-error-banner">
                            <div className="login-alert-content">
                                <h3 className="login-heading-4">Reset your password</h3>
                                <p className="login-spacing-top-s">To ensure your account is secure, we have sent you an email to reset your password. Once updated, try signing in again.</p>
                            </div>
                        </div>

                        <div className="login-banner login-critical hidden" id="login-password-scrambled-error-banner">
                            <div className="login-alert-content">
                                <h3 className="login-heading-4">Reset your password</h3>
                                <p className="login-spacing-top-s">Please <a href="/trouble-signing-in" title="reset your password" target="_self" className="login-sign-up-instead-lnk">reset your password</a> to ensure your account is secure. Once updated, try signing in again.</p>
                            </div>
                        </div>

                        <div id="login-notification-div" className="login-banner login-critical login-notify-failure login-notification-container">
                            <p id="login-notification-message"></p>
                        </div>

                        <form id="login-sign-in-form" className="login-spacing-top-xl">
                            <div className="login-input-group">
                                <label htmlFor="login-username" className="login-input-label">
                                    <h6 className="login-heading-6">Email or username</h6>
                                </label>
                                <input type="text" className="login-input-field" name="username" id="login-username" autoFocus autoComplete="off" autoCapitalize="off" spellCheck="true" />
                                <span id="login-input-error-username" className="login-input-validation-error"></span>
                            </div>
                            <div className="login-input-group">
                                <label htmlFor="login-password" className="login-input-label">
                                    <h6 className="login-heading-6">Password</h6>
                                </label>
                                <input type="password" className="login-input-field" name="password" id="login-password" autoCapitalize="off" spellCheck="true" />
                                <span id="login-input-error-password" className="login-input-validation-error"></span>
                            </div>
                            <div className="login-input-group">
                                <div className="login-flex login-space-between">
                                    <div>
                                        <input type="checkbox" className="login-input-checkbox" id="login-remember-me-checkbox" checked />
                                        <label htmlFor="login-remember-me-checkbox" className="login-stay-signed-in">Stay signed in</label>
                                    </div>
                                    <a className="login-forgot-password-link" href="/trouble-signing-in">Forgot password?</a>
                                </div>
                                <div className="login-banner login-warning" id="login-do-not-remember-message" style={{ display: 'none' }}>
                                    <span>You will be logged out after 30 minutes of inactivity.</span>
                                </div>
                            </div>

                            <div id="login-cloudflareTurnstile">
                                <input type="hidden" name="cf-turnstile-response" id="cf-chl-widget-response" />
                            </div>

                            <div className="login-input-group">
                                <button type="submit" className="login-btn login-primary">
                                    Sign In
                                </button>
                            </div>

                            <input type="hidden" name="csrfToken" value="IDw0hoCvLjNEEGClsqdvPkMMcMWgIaRajnNr8=" />
                        </form>

                        <p className="login-text-center login-text-subdued">or</p>

                        <div className="login-google-container">
                            <GoogleLogin
                                onSuccess={handleLoginSuccess}
                                onError={(error) => console.error('Login failed:', error)}
                                className="login-btn login-secondary login-google-sign-in"
                            >
                                <div className="login-google-logo">
                                    <img className="login-btn-logo" src="https://assets.getpostman.com/common-share/google-logo-icon-sign-in.svg" width="16px" height="16px" alt="Google Logo" />
                                </div>
                                <div className="login-google-text">Sign In with Google</div>
                            </GoogleLogin>
                        </div>

                    </div>
                    <div className="login-text-center login-create-free-account-link-div">
                        <a href="/signup" title="Create free account" className="login-create-free-account-link">Create free account</a>
                    </div>
                </div>
            ) : (
                <>
                    {/* Floating chat window */}
                    <FloatingChatWindow
                        handleSendMessage={handleSendMessage}
                        messages={messages}
                        sunburstGraphRef={sunburstGraphRef} // Pass the ref to FloatingChatWindow
                        handleNavigateToNode={handleNavigateToNode}
                        toggleMenu={toggleMenu} // Pass toggleMenu as a prop
                        menuVisible={menuVisible} // Pass menuVisible as a prop
                        handleLogout={handleLogout} // Pass handleLogout as a prop
                    />

                    {/* Main layout */}
                    <SplitPane split="vertical" minSize={50} defaultSize={isLeftSidebarCollapsed ? 50 : 265}>
                        <Sidebar
                            position="left"
                            content={
                                <div className="sidebar-content-inner">
                                    <Threads
                                        activeThreadLookupId={activeThreadLookupId}
                                        setActiveThreadLookupId={setActiveThreadLookupId}
                                        fetchThreadMessages={fetchThreadMessages}
                                        fetchThreads={fetchThreads} // Pass fetchThreads as a prop
                                        threads={threads} // Pass threads as a prop
                                    />
                                </div>
                            }
                            isCollapsed={isLeftSidebarCollapsed}
                            toggleSidebar={toggleLeftSidebar}
                            createNewThread={createNewThread} // Pass createNewThread as a prop
                            fetchThreadMessages={fetchThreadMessages} // Pass fetchThreadMessages as a prop
                            setMessages={setMessages} // Pass setMessages as a prop
                        />
                        {nodesData ?
                            <NodeGraph
                                nodesData={nodesData}
                                sunburstGraphRef={sunburstGraphRef}
                                fetchNodesData={fetchNodesData} // Pass the fetchNodesData function
                            />
                            : <div>Loading...</div>}
                    </SplitPane>
                </>
            )}
        </div>
    );
}

export default App;
