import { useEffect } from "react";
import { Navigate } from "react-router-dom";

import { useAuthContext } from "../../hooks/useAuthContext";
import { useModal } from "../../hooks/useModal";

const RequireAuth = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuthContext();
    const { openModal } = useModal();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            openModal("login");
        }
    }, [isLoading, isAuthenticated, openModal]);

    // Wait for the auth state to be restored from localStorage
    if (isLoading) {
        return null;
    }

    // User is definitely not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // User is authenticated
    return children;
};

export default RequireAuth;