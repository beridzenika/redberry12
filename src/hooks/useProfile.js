import { useState } from "react";

import { updateProfile } from "../services/api";
import { useAuthContext } from "./useAuthContext";

export const useProfile = () => {
    const {
        token,
        updateUser,
    } = useAuthContext();

    const [loading, setLoading] = useState(false);
    const [generalError, setGeneralError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    const update = async ({
        fullName,
        mobileNumber,
        dateOfBirth,
        preferredVenueId,
    }) => {
        try {
            setLoading(true);
            setGeneralError("");
            setFieldErrors({});

            const response = await updateProfile({
                fullName,
                mobileNumber,
                dateOfBirth,
                preferredVenueId,
                token,
            });

            const updatedUser =
                response.data ?? response;

            updateUser(updatedUser);

            return {
                success: true,
                data: updatedUser,
            };
        } catch (error) {
            const errorMessage =
                error.message ||
                "Failed to update profile";

            setGeneralError(errorMessage);

            setFieldErrors(
                error.errors || {}
            );

            return {
                success: false,
                error: errorMessage,
                fieldErrors:
                    error.errors || {},
            };
        } finally {
            setLoading(false);
        }
    };

    return {
        update,
        loading,
        generalError,
        fieldErrors,
        setGeneralError,
        setFieldErrors,
    };
};