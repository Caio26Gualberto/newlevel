import React, { createContext, useEffect, useState } from 'react';
import { IAlertNewLevel } from '../interfaces/newLevelInterfaces';
import AlertNewLevel from '../components/AlertNewLevel';

interface ApiContextType {
    setAlertMessage: (alertNewLevel: IAlertNewLevel) => void;
}

export const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [alert, setAlert] = useState<IAlertNewLevel | null>(null);

    const setAlertMessage = (alertNewLevel: IAlertNewLevel) => {
        setAlert({ ...alertNewLevel });
    };

    useEffect(() => {
        if (alert) {
            const timer = setTimeout(() => {
                setAlert(null);
            }, 4000);

            return () => {
                clearTimeout(timer);
            };
        }
    }, [alert]);
    return (
        <ApiContext.Provider value={{ setAlertMessage }}>
            {alert ? <AlertNewLevel severity={alert.severity} message={alert.message} title={alert.title}/> : null}
            {children}
        </ApiContext.Provider>
    );
};
