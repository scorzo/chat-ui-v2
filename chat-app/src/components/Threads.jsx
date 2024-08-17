import React, { useEffect } from 'react';
import './Threads.css'; // Import the CSS file

function Threads({ activeThreadLookupId, setActiveThreadLookupId, fetchThreadMessages, fetchThreads, threads }) {

    // within this component

        // initialization
        // 1. useEffect() hook is used to call fetchThreads()

        // clicking on a thread
        // 1. setActiveThreadLookupId() is called to set the active thread ID
        // 2. fetchThreadMessages() is called to populate the messages array

    // clicking "new thread button" outside of this component:
        // 1. createNewThread()
                // calls setActiveThreadLookupId()
                // calls fetchThreads() which populates the threads array
        // 2. setMessages([]) which populates the messages array to empty

    // posting a message to a thread that does not yet exist:
        // handleSendMessage(input_text) event handler
        // 1. setMessages([...messages, newMessage]);
        // 2. lookup_id = createNewThread()
            // calls setActiveThreadLookupId()
            // calls fetchThreads() which populates the threads array
        // 3. receives lookup_id from createNewThread()
        // 4. calls chat api to post the streaming message




    // call only on initialization
    useEffect(() => {
        fetchThreads();
        console.log(`Fetch Threads triggered: activeThreadLookupId: ${activeThreadLookupId}`);
    }, []);

    return (
        <div className="threads-container">
            <div className="thread-list">
                <ul>
                    {Object.entries(threads).reverse().map(([id, threadInfo]) => (
                        <li key={id}>
                            <a href="#" onClick={async () => {
                                setActiveThreadLookupId(id);
                                await fetchThreadMessages(id); // Fetch messages when a thread is selected
                            }} className={`thread-item ${id === activeThreadLookupId ? 'active' : ''}`}>
                                <span className="thread-item-text">{threadInfo.thread_name}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );


}

export default Threads; // Ensure this line is present
