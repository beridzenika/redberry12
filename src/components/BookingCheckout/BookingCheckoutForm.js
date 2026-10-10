
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

    if (!match) {
        return false;
    }

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

function BookingCheckoutForm({ onSubmit }) {
    const { user } = useAuthContext();
    const [values, setValues] = useState(() => getInitialValues(user));
    const [fieldErrors, setFieldErrors] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

        return {
            fullName:
                fieldErrors.fullName ||
                validateFullName(values.fullName),

            mobileNumber:
                fieldErrors.mobileNumber ||
                validateGeorgianMobileNumber(values.mobileNumber),

            mobileNumber:
                fieldErrors.mobileNumber ||
                (!mobileNumber
                    ? "Mobile number is required"
                    : !/^\d+$/.test(mobileNumber)
                        ? "Please enter a valid Georgian mobile number"
                        : !mobileNumber.startsWith("5")
                            ? "Georgian mobile numbers must start with 5"
                            : mobileNumber.length !== 9
                                ? "Mobile number must be exactly 9 digits"
                                : ""),

            cardNumber:
                fieldErrors.cardNumber ||
                (!values.cardNumber
                    ? "Card number is required"
                    : !validateCardNumber(values.cardNumber)
                        ? "Card number must contain exactly 16 digits"
                        : ""),

            expiry:
                fieldErrors.expiry ||
                (!values.expiry
                    ? "Expiry date is required"
                    : !validateExpiry(values.expiry)
                        ? "Enter a valid future date in MM/YY format"
                        : ""),

            cvv:
                fieldErrors.cvv ||
                (!values.cvv
                    ? "CVV is required"
                    : !/^\d{3}$/.test(values.cvv)
                        ? "CVV must contain exactly 3 digits"
                        : ""),
        };
    }, [values, fieldErrors]);

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

        // Clear any previous field-specific error when the user edits it.
        setFieldErrors((current) => ({
            ...current,
            [name]: "",
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (submissionLock.current || isSubmitting) {
            return;
        }

        setSubmitted(true);

        if (!isFormValid) {
            return;
        }

        submissionLock.current = true;
        setIsSubmitting(true);

        try {
            await onSubmit({
                customer: {
                    fullName: values.fullName.trim(),
                    email: values.email.trim(),
                    mobileNumber: values.mobileNumber.trim(),
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
            setIsSubmitting(false);
        }
    }

    return (
        <section className="booking-checkout">
            <form
                className="auth-form booking-checkout-form"
                noValidate
                onSubmit={handleSubmit}
            >
                <AuthInput
                    id="booking-full-name"
                    name="fullName"
                    label="Full Name"
                    placeholder="e.g Text"
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
                        placeholder="e.g Text"
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
                        placeholder="e.g Text"
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
                    placeholder="e.g Text"
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
                        placeholder="e.g Text"
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
                        type="password"
                        placeholder="e.g Text"
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

                {/* Submission is handled by the parent component. */}
                <button
                    type="submit"
                    hidden
                    disabled={isSubmitting}
                >
                    Submit
                </button>
            </form>
        </section>
    );
}

export default BookingCheckoutForm;