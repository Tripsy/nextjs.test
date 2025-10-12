'use client';

import React, {createContext, useContext, useRef} from 'react';
import {Toast} from 'primereact/toast';

type ToastOptions = {
    severity: 'success' | 'info' | 'warn' | 'error';
    summary: string;
    detail?: string;
    life?: number;
};

type ToastContextType = {
    showToast: (options: ToastOptions) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

function ToastProvider({children}: { children: React.ReactNode }) {
    const toastRef = useRef<Toast>(null);

    const showToast = (options: ToastOptions) => {
        toastRef.current?.show({
            ...options,
            life: options.life ?? 3000, // default to 3 seconds
        });
    };

    return (
        <ToastContext.Provider value={{showToast}}>
            <Toast ref={toastRef} position="top-right"/>
            {children}
        </ToastContext.Provider>
    );
}

function useToast() {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }

    return context;
}

export {ToastProvider, useToast};