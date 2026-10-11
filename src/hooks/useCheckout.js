import { useCallback, useRef, useState } from "react";
import { createOrder } from "../services/api";

export function useCheckout({ token, onSuccess, onConflict }) {
    const [orderLoading, setOrderLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [submitError, setSubmitError] = useState("");

    const requestRef = useRef(false);

    const submitOrder = useCallback(
        async (orderData) => {
            if (requestRef.current) {
                return false;
            }

            if (!token) {
                setSubmitError("Please sign in again.");
                return false;
            }

            requestRef.current = true;
            setOrderLoading(true);
            setFieldErrors({});
            setSubmitError("");

            try {
                const response = await createOrder(orderData, token);
                const result = response?.data ?? response;

                onSuccess?.(result);

                return true;
            } catch (error) {
                const status =
                    error?.status ??
                    error?.statusCode ??
                    error?.response?.status;

                let payload =
                    error?.response?.data ??
                    error?.data ??
                    error?.response?.body ??
                    {};

                if (typeof payload === "string") {
                    try {
                        payload = JSON.parse(payload);
                    } catch {
                        payload = { message: payload };
                    }
                }

                const message =
                    payload?.message ??
                    error?.message ??
                    "Unable to complete your order. Please try again.";

                if (Number(status) === 422) {
                    const errors = payload?.errors ?? {};

                    if (Object.keys(errors).length > 0) {
                        setFieldErrors(errors);
                        setSubmitError(
                            payload?.message ??
                            "Please correct the highlighted fields."
                        );
                    } else {
                        // A 422 without field errors means the hold expired.
                        setSubmitError(
                            "Your hold time expired. Please re-select your seats."
                        );

                        onConflict?.(
                            "Your hold time expired. Please re-select your seats.",
                            payload
                        );
                    }
                } else if (Number(status) === 409) {
                    setSubmitError(message);
                    onConflict?.(message, payload);
                } else if (Number(status) === 403) {
                    setSubmitError(
                        payload?.message ??
                        "This seat reservation belongs to another account."
                    );
                } else {
                    setSubmitError(message);
                }

                return false;
            } finally {
                requestRef.current = false;
                setOrderLoading(false);
            }
        },
        [token, onSuccess, onConflict]
    );

    const clearErrors = useCallback(() => {
        setFieldErrors({});
        setSubmitError("");
    }, []);

    return {
        submitOrder,
        orderLoading,
        fieldErrors,
        submitError,
        setFieldErrors,
        setSubmitError,
        clearErrors,
    };
}