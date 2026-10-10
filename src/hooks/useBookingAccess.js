import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useAuthContext } from "./useAuthContext";
import { useModal } from "./useModal";

export function useBookingAccess() {
    const { isAuthenticated, user } = useAuthContext();
    const { openModal } = useModal();
    const navigate = useNavigate();

    const canBook =
        isAuthenticated && Boolean(user?.profileComplete);

    const requestBooking = useCallback(
        (sessionId) => {
            if (!sessionId) {
                return false;
            }

            if (!isAuthenticated) {
                navigate("/", { state: { openLogin: true } });
                return false;
            }

            if (!user?.profileComplete) {
                navigate("/profile");
                return false;
            }

            openModal("booking", { sessionId });
            return true;
        },
        [isAuthenticated, user, navigate, openModal]
    );

    return { canBook, requestBooking };
}