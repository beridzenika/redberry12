import { createContext, useState, useCallback } from "react"

export const ModalContext = createContext();

export function ModalProvider({children}) {
    const [modals, setModals] = useState({
        login: false,
        signin: false,
    });
    
    const openModal = useCallback((modalName) => {
        setModals((prev) => ({...prev, [modalName]: true}));
    }, []);

    const closeModal = useCallback((modalName) => {
        setModals((prev) => ({...prev, [modalName]: false}));
    }, []);

    const closeAllModals = useCallback(() => {
        setModals({
            login: false,
            signin: false,
        });
    }, []);

    return (
        <ModalContext.Provider value={{ modals, openModal, closeModal, closeAllModals }}>
            {children}
        </ModalContext.Provider>
    );
}
