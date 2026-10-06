import {
    createContext,
    useState,
    useCallback,
    useEffect,
} from "react";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedToken =
            localStorage.getItem("authToken");

        const savedUser =
            localStorage.getItem("authUser");

        if (savedToken && savedUser) {
            try {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
            } catch {
                localStorage.removeItem("authToken");
                localStorage.removeItem("authUser");
            }
        }

        setIsLoading(false);
    }, []);

    const login = useCallback((userData, authToken) => {
        setUser(userData);
        setToken(authToken);

        localStorage.setItem(
            "authToken",
            authToken
        );

        localStorage.setItem(
            "authUser",
            JSON.stringify(userData)
        );
    }, []);

    const updateUser = useCallback((userData) => {
        setUser((currentUser) => {
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

    const isAuthenticated = Boolean(
        token && user
    );

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