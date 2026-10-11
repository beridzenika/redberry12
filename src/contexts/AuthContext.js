import {
    createContext,
    useState,
    useCallback,
    useEffect,
} from "react";

import { getCurrentUser } from "../services/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const checkAuth = async () => {
            const savedToken =
                localStorage.getItem("authToken");

            if (!savedToken) {
                setIsLoading(false);
                return;
            }

            setToken(savedToken);

            try {
                const response = await getCurrentUser(savedToken);

                const currentUser = response.user ?? response;

                if (!cancelled) {
                    setUser(currentUser);

                    localStorage.setItem(
                        "authUser",
                        JSON.stringify(currentUser)
                    );
                }
            } catch (error) {
                if (cancelled) return;

                if (
                    error.status === 401 ||
                    error.status === 403
                ) {
                    localStorage.removeItem("authToken");
                    localStorage.removeItem("authUser");
                    setToken(null);
                    setUser(null);
                }
            } finally {
                if (!cancelled) {
                    setIsLoading(false);
                }
            }
        };

        checkAuth();

        return () => {
            cancelled = true;
        };
    }, []);

    const login = useCallback((userData, authToken) => {
        localStorage.setItem("authToken", authToken);
        localStorage.setItem(
            "authUser",
            JSON.stringify(userData)
        );

        setToken(authToken);
        setUser(userData);
    }, []);

    const updateUser = useCallback((userData) => {
        setUser((currentUser) => {
            if (!currentUser) return currentUser;

            const updatedUser = {
                ...currentUser,
                ...userData,
            };

            localStorage.setItem(
                "authUser",
                JSON.stringify(updatedUser)
            );

            return updatedUser;
        });
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);

        localStorage.removeItem("authToken");
        localStorage.removeItem("authUser");
    }, []);

    const isAuthenticated = Boolean(token && user);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated,
                isLoading,
                login,
                updateUser,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}