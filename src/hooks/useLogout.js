import { useState, useCallback } from "react";
import { logOutUser } from "../services/api";
import { useAuthContext } from "./useAuthContext";

export function useLogout() {
    const { token, logout } = useAuthContext();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogout = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            if (token) {
                await logOutUser(token);
            }
        } catch (error) {
            setError(error.message || "Logout failed");
        } finally {
            logout();
            setLoading(false);
        }
    }, [token, logout]);

    return { handleLogout, loading, error };
}