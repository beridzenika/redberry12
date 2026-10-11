import { useState, useEffect, useMemo, useRef } from "react";

import {
    getInitialProfileValues,
    sanitizeMobileNumber,
    validateFullName,
    validateGeorgianMobileNumber,
} from "../../utils/profileUtils";

import { useAuthContext } from "../../hooks/useAuthContext";
import AuthInput from "../Forms/AuthInput";

import "./BookingCheckout.css";

export const getInitialValues = (user) => ({
    ...getInitialProfileValues(user),
    cardNumber: "",
    expiry: "",
    cvv: "",
});

function validateCardNumber(value) {
    return /^\d{16}$/.test(value.replace(/\D/g, ""));
}

function validateExpiry(value) {
    const match = value.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);

    if (!match) return false;

    const month = Number(match[1]);
    const year = 2000 + Number(match[2]);

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    return (
        year > currentYear ||
        (year === currentYear && month > currentMonth)
    );
}

function getErrorMessage(error) {
    if (Array.isArray(error)) {
        return error[0] ?? "";
    }

    return error ?? "";
}

function BookingCheckoutForm({
    session,
    selectedSeats,
    subtotal,
    onSubmit,
    onBack,
    submitting = false,
    fieldErrors = {},
    submitError = "",
    onClearErrors,
}) {
    const { user } = useAuthContext();

    const [values, setValues] = useState(() =>
        getInitialValues(user)
    );

    const [localFieldErrors, setLocalFieldErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);

    const submissionLock = useRef(false);

    useEffect(() => {
        setValues((current) => ({
            ...current,
            fullName: user?.fullName || "",
            email: user?.email || "",
            mobileNumber: user?.mobileNumber || "",
        }));
    }, [user?.fullName, user?.email, user?.mobileNumber]);

    const errors = useMemo(() => {
        const mobileNumber = sanitizeMobileNumber(
            values.mobileNumber.trim()
        );

        const validationErrors = {
            fullName:
                validateFullName(values.fullName),

            email:
                !values.email.trim()
                    ? "Email is required"
                    : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                          values.email.trim()
                      )
                      ? "Please enter a valid email address"
                      : "",

            mobileNumber:
                !mobileNumber
                    ? "Mobile number is required"
                    : !/^\d+$/.test(mobileNumber)
                      ? "Please enter a valid Georgian mobile number"
                      : !mobileNumber.startsWith("5")
                        ? "Georgian mobile numbers must start with 5"
                        : mobileNumber.length !== 9
                          ? "Mobile number must be exactly 9 digits"
                          : validateGeorgianMobileNumber(
                                values.mobileNumber
                            ),

            cardNumber:
                !values.cardNumber
                    ? "Card number is required"
                    : !validateCardNumber(values.cardNumber)
                      ? "Card number must contain exactly 16 digits"
                      : "",

            expiry:
                !values.expiry
                    ? "Expiry date is required"
                    : !validateExpiry(values.expiry)
                      ? "Enter a valid future date in MM/YY format"
                      : "",

            cvv:
                !values.cvv
                    ? "CVV is required"
                    : !/^\d{3}$/.test(values.cvv)
                      ? "CVV must contain exactly 3 digits"
                      : "",
        };

        return Object.fromEntries(
            Object.entries(validationErrors).map(
                ([field, validationError]) => [
                    field,
                    getErrorMessage(fieldErrors[field]) ||
                        getErrorMessage(localFieldErrors[field]) ||
                        validationError,
                ]
            )
        );
    }, [values, fieldErrors, localFieldErrors]);

    const isFormValid = Object.values(errors).every(
        (error) => !error
    );

    const showSuccess = (field) =>
        Boolean(values[field]) && !errors[field];

    function handleChange(event) {
        const { name, value } = event.target;
        let nextValue = value;

        if (name === "cardNumber") {
            const digits = value.replace(/\D/g, "").slice(0, 16);
            nextValue = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
        }

        if (name === "expiry") {
            const digits = value.replace(/\D/g, "").slice(0, 4);

            nextValue =
                digits.length > 2
                    ? `${digits.slice(0, 2)}/${digits.slice(2)}`
                    : digits;
        }

        if (name === "cvv") {
            nextValue = value.replace(/\D/g, "").slice(0, 3);
        }

        setValues((current) => ({
            ...current,
            [name]: nextValue,
        }));

        setLocalFieldErrors((current) => ({
            ...current,
            [name]: "",
        }));

        // Clear server-side errors after the user edits a field.
        onClearErrors?.();
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (submissionLock.current || submitting) {
            return;
        }

        setSubmitted(true);

        if (!isFormValid) {
            return;
        }

        submissionLock.current = true;

        try {
            await onSubmit({
                customer: {
                    fullName: values.fullName.trim(),
                    email: values.email.trim(),
                    mobileNumber: sanitizeMobileNumber(
                        values.mobileNumber.trim()
                    ),
                },
                payment: {
                    cardNumber: values.cardNumber.replace(/\D/g, ""),
                    expiry: values.expiry,
                    cvv: values.cvv,
                },
            });
        } catch (error) {
            console.error("Checkout submission failed:", error);
        } finally {
            submissionLock.current = false;
        }
    }

    return (
        <section className="booking-checkout">
            <form
                id="booking-checkout-form"
                className="auth-form booking-checkout-form"
                noValidate
                onSubmit={handleSubmit}
            >
                {submitError && (
                    <div
                        className="booking-submit-error"
                        role="alert"
                    >
                        {submitError}
                    </div>
                )}

                <AuthInput
                    id="booking-full-name"
                    name="fullName"
                    label="Full Name"
                    placeholder="e.g. Jane Doe"
                    value={values.fullName}
                    error={
                        submitted || values.fullName
                            ? errors.fullName
                            : ""
                    }
                    success={showSuccess("fullName")}
                    onChange={handleChange}
                    autoComplete="name"
                />

                <div className="booking-form-row">
                    <AuthInput
                        id="booking-email"
                        name="email"
                        label="Email"
                        type="email"
                        placeholder="e.g. jane@example.com"
                        value={values.email}
                        error={
                            submitted || values.email
                                ? errors.email
                                : ""
                        }
                        success={showSuccess("email")}
                        onChange={handleChange}
                        autoComplete="email"
                    />

                    <AuthInput
                        id="booking-mobile"
                        name="mobileNumber"
                        label="Mobile Number"
                        type="tel"
                        placeholder="e.g. 555 123 456"
                        value={values.mobileNumber}
                        error={
                            submitted || values.mobileNumber
                                ? errors.mobileNumber
                                : ""
                        }
                        success={showSuccess("mobileNumber")}
                        onChange={handleChange}
                        autoComplete="tel"
                    />
                </div>

                <hr className="page-line" />

                <AuthInput
                    id="booking-card-number"
                    name="cardNumber"
                    label="Card Number"
                    placeholder="e.g. 1234 4567 8901 2345"
                    value={values.cardNumber}
                    error={
                        submitted || values.cardNumber
                            ? errors.cardNumber
                            : ""
                    }
                    success={showSuccess("cardNumber")}
                    onChange={handleChange}
                    autoComplete="cc-number"
                />

                <div className="booking-form-row">
                    <AuthInput
                        id="booking-expiry"
                        name="expiry"
                        label="Expiry"
                        placeholder="e.g. 12/34"
                        value={values.expiry}
                        error={
                            submitted || values.expiry
                                ? errors.expiry
                                : ""
                        }
                        success={showSuccess("expiry")}
                        onChange={handleChange}
                        autoComplete="cc-exp"
                    />

                    <AuthInput
                        id="booking-cvv"
                        name="cvv"
                        label="CVV"
                        type="text"
                        placeholder="e.g. 123"
                        value={values.cvv}
                        error={
                            submitted || values.cvv
                                ? errors.cvv
                                : ""
                        }
                        success={showSuccess("cvv")}
                        onChange={handleChange}
                        autoComplete="cc-csc"
                    />
                </div>
            </form>
        </section>
    );
}

export default BookingCheckoutForm;