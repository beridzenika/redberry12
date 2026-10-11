import { createContext, useState, useCallback } from "react";

export const ModalContext = createContext();

export function ModalProvider({ children }) {
    const [modals, setModals] = useState({
        login: false,
        signin: false,
        booking: false,
        confirmation: false,
    });

    const [bookingSessionId, setBookingSessionId] = useState(null);
    const [confirmationData, setConfirmationData] = useState(null);

    const openModal = useCallback((modalName, payload) => {
        if (modalName === "booking") {
            setBookingSessionId(payload?.sessionId ?? null);
        }

        if (modalName === "confirmation") {
            setConfirmationData(payload?.order ?? payload ?? null);
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

        if (modalName === "confirmation") {
            setConfirmationData(null);
        }
    }, []);

    const closeAllModals = useCallback(() => {
        setModals({
            login: false,
            signin: false,
            booking: false,
            confirmation: false,
        });

        setBookingSessionId(null);
        setConfirmationData(null);
    }, []);

    return (
        <ModalContext.Provider
            value={{
                modals,
                openModal,
                closeModal,
                closeAllModals,
                bookingSessionId,
                confirmationData,
            }}
        >
            {children}
        </ModalContext.Provider>
    );
}