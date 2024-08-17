import React, { createContext, useContext, useState } from 'react';

const CustomContext = createContext();

export const CustomContextProvider = ({ children }) => {
    const [routeLocal, setRouteLocal] = useState(false);
    const [sessionId, setSessionId] = useState(null);

    const updateRouteLocal = (value) => {
        console.log("Updating routeLocal to:", value);
        setRouteLocal(value);
    };

    return (
        <CustomContext.Provider value={{ routeLocal, setRouteLocal: updateRouteLocal, sessionId, setSessionId }}>
            {children}
        </CustomContext.Provider>
    );
};

export const useCustomContext = () => useContext(CustomContext);
