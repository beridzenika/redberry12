import { useState } from "react";
import { loginUser, registerUser } from "../services/api";
import { useAuthContext } from "./useAuthContext";

export const useAuth = () => {
    const { login: setAuthUser } = useAuthContext();

    const [loading, setLoading] = useState(false);
    const [generalError, setGeneralError] = useState("");
    
    const handleAuth = async (request) => {
        try {
            setLoading(true);
            setGeneralError("");
            
            const response = await request();
            
            const {user, token} = response.data;
            setAuthUser(user, token);

            return {
                success: true,
                data: response.data,
            };
        } catch (error) {
            const errorMessage = 
                error.message || 'An error occured during authentication';
            setGeneralError(errorMessage);

            return {
                success: false,
                error: errorMessage,
                fieldErrors: error.errors || {},
            };
        } finally {
            setLoading(false);
        }
    }

    const login = async (email, password) => {
        return handleAuth(() => 
            loginUser(email, password)
        );
    };

    const register = async (avatar, username, email, password, confirmPassword) => {
        return handleAuth(() => 
            registerUser(avatar, username, email, password, confirmPassword)
        );
    };

    return { login, register, loading, generalError, setGeneralError, };
}