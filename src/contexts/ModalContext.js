import { createContext, useState, useCallback } from "react";

export const ModalContext = createContext();

export function ModalProvider({ children }) {
    const [modals, setModals] = useState({
        login: false,
        signin: false,
        booking: false,
    });

    const [bookingSessionId, setBookingSessionId] = useState(null);

    const openModal = useCallback((modalName, payload) => {
        if (modalName === "booking") {
            setBookingSessionId(payload?.sessionId ?? null);
        }

        setModals((prev) => ({
            ...prev,
            [modalName]: true,
        }));
    }, []);

    const closeModal = useCallback((modalName) => {
        setModals((prev) => ({
            ...prev,
            [modalName]: false,
        }));

        if (modalName === "booking") {
            setBookingSessionId(null);
        }
    }, []);

    const closeAllModals = useCallback(() => {
        setModals({
            login: false,
            signin: false,
            booking: false,
        });

        setBookingSessionId(null);
    }, []);

    return (
        <ModalContext.Provider
            value={{
                modals,
                openModal,
                closeModal,
                closeAllModals,
                bookingSessionId,
            }}
        >
            {children}
        </ModalContext.Provider>
    );
}