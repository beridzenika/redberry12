import { useState } from "react";

import { useModal } from "../../hooks/useModal";
import { useAuth } from "../../hooks/useAuth";
import ModalOverlay from "../Modal/ModalOverlay";
import AuthInput from "./AuthInput";

import { ReactComponent as CloseIcon } from "../../assets/icons/Close.svg";

import "./Modals.css";

function LoginModal() {
    const { modals, openModal, closeModal } = useModal();
    const { login, loading, generalError, setGeneralError } 
        = useAuth();

    const [apiErrors, setApiErrors] = useState({});

    const [values, setValues] = useState({
        email: "",
        password: "",
    });
    const [submitted, setSubmitted] = useState(false);

    const resetForm = () => {
        setValues({
            email: "",
            password: "",
        });
        setSubmitted(false);
        setApiErrors({});
        setGeneralError("");
    };

    const handleClose = () => {
        resetForm();
        closeModal("login");
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setValues((prev) => ({
            ...prev,
            [name]: value,
        }));
        setApiErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
        if (generalError) {
            setGeneralError("");
        }
    };

    const errors = {
        email:
            apiErrors.email ||
            (!values.email
                ? "Email is required"
                : !/\S+@\S+\.\S+/.test(values.email)
                    ? "Enter a valid email"
                    : ""),

        password:
            apiErrors.password ||
            (!values.password
                ? "Password is required"
                : values.password.length < 3
                    ? "At least 3 characters"
                    : ""),
    };

    const showError = (field) =>
    submitted && Boolean(errors[field]);

    const showSuccess = (field) =>
        submitted &&
        Boolean(values[field]) &&
        !errors[field];


    const handleSubmit = async (event) => {
        event.preventDefault();

        setSubmitted(true);
        setApiErrors({});

        if(Object.values(errors).some(Boolean)) {
            return;
        }

        const result = await login(values.email, values.password);

        if (!result.success) {
            setApiErrors(result.fieldErrors || {});
            return;
        }

        handleClose();
    };

    return (
        <ModalOverlay
            open={modals.login}
            onClose={handleClose}
            labelledBy="login-modal-title"
        >
            <div className="auth-modal auth-modal-login">

                <header className="auth-header">
                    <div className="auth-title">
                        <h2
                            id="login-modal-title"
                            className="text-h2"
                        >
                            Login
                        </h2>

                        <p className="text-body-s text-gray">
                            Welcome back to Kino XII
                        </p>
                    </div>

                    <button
                        type="button"
                        className="icon-button"
                        onClick={handleClose}
                        aria-label="Close login dialog"
                    >
                        <CloseIcon aria-hidden="true" />
                    </button>
                </header>

                <form
                    className="auth-form"
                    noValidate
                    onSubmit={handleSubmit}
                >
                    <AuthInput
                        id="login-email"
                        name="email"
                        label="Email"
                        type="email"
                        placeholder="example@gmail.com"
                        value={values.email}
                        error={
                            showError("email")
                                ? errors.email
                                : ""
                        }
                        success={showSuccess("email")}
                        onChange={handleChange}
                        disabled={loading}
                        autoComplete="email"
                    />

                    <AuthInput
                        id="login-password"
                        name="password"
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={values.password}
                        error={
                            showError("password")
                                ? errors.password
                                : ""
                        }
                        success={showSuccess("password")}
                        onChange={handleChange}
                        disabled={loading}
                        autoComplete="current-password"
                    />
                    {generalError && (
                        <p
                            className="text-label-s text-red"
                            role="alert"
                        >
                            {generalError}
                        </p>
                    )}
                    <button
                        type="submit"
                        className={`auth-btn text-button ${
                            submitted ? "auth-btn-submitted" : ""
                        }`}
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Log in"}
                    </button>
                </form>

                <footer className="auth-footer">
                    <p className="text-body-m text-gray">
                        Don't have an account?{" "}

                        <button
                            type="button"
                            className="auth-link text-button text-red"
                            onClick={() => {
                                resetForm();
                                closeModal("login");
                                openModal("signin");
                            }}
                        >
                            Sign up
                        </button>
                    </p>
                </footer>

            </div>
        </ModalOverlay>
    );
}

export default LoginModal;
