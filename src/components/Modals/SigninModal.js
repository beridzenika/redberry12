import { useEffect, useState } from "react";

import { useModal } from "../../hooks/useModal";
import ModalOverlay from "../Modal/ModalOverlay";
import AuthInput from "./AuthInput";

import { ReactComponent as CloseIcon } from "../../assets/icons/Close.svg";
import { ReactComponent as UploadIcon } from "../../assets/icons/LogOut.svg";

import "./Modals.css";

function SigninModal() {
    const {modals, openModal, closeModal, } = useModal();

    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [submitted, setSubmitted] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);

    const resetForm = () => {
        setValues({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        });
        setSubmitted(false);
    }
    const handleClose = () => {
        closeModal("signin");
        setAvatarPreview(null);
        resetForm();
    };

    const handleChange = (event) => {
        const { name, value } = event.target;

        setValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];
        if (!allowedTypes.includes(file.type)) {
            event.target.value = "";
            return;
        }

        const previewUrl = URL.createObjectURL(file);

        setAvatarPreview((previousUrl) => {
            if (previousUrl) {
                URL.revokeObjectURL(previousUrl);
            }
            return previewUrl;
        });
    };

    useEffect(() => {
        return () => {
            if (avatarPreview) {
                URL.revokeObjectURL(avatarPreview);
            }
        };
    }, [avatarPreview]);

    const errors = {
        username:
            !values.username
                ? "Username is required"
                : values.username.length < 3
                    ? "Username must be at least 3 characters"
                    : "",
                    // TODO: Unique
        email:
            !values.email
                ? "Email is required"
                : !/\S+@\S+\.\S+/.test(values.email)
                    ? "Enter a valid email"
                    : "",
        password:
            !values.password
                ? "Password is required"
                : values.password.length < 3
                    ? "At least 3 characters"
                    : "",
        confirmPassword:
            !values.confirmPassword
                ? "Please confirm your password"
                : values.confirmPassword !== values.password
                    ? "Passwords do not match"
                    : "",
    };

    const showError = (field) =>
        submitted && Boolean(errors[field]);

    const showSuccess = (field) =>
        submitted &&
        Boolean(values[field]) &&
        !errors[field];

    const handleSubmit = (event) => {
        event.preventDefault();

        setSubmitted(true);
    };

    return (
        <ModalOverlay
            open={modals.signin}
            onClose={handleClose}
            labelledBy="signin-modal-title"
        >
            <div className="auth-modal auth-modal-signup">
                <header className="auth-header">
                    <div className="auth-title">
                        <h2
                            id="signin-modal-title"
                            className="text-h2"
                        >
                            Sign up
                        </h2>
                        <p className="text-body-s text-gray">
                            Create your Kino XII account
                        </p>
                    </div>

                    <button
                        type="button"
                        className="icon-button"
                        onClick={handleClose}
                        aria-label="Close sign up dialog"
                    >
                        <CloseIcon aria-hidden="true" />
                    </button>
                </header>

                <form
                    className="auth-form"
                    noValidate
                    onSubmit={handleSubmit}
                >
                    <div className="avatar-upload">
                        <label
                            htmlFor="avatar"
                            className="avatar-upload-control"
                        >
                            <div
                                className={`avatar-preview ${
                                    avatarPreview
                                        ? "has-image"
                                        : ""
                                }`}
                                style={
                                    avatarPreview
                                        ? {
                                            backgroundImage:
                                                `url(${avatarPreview})`,
                                        }
                                        : undefined
                                }
                            >
                                {!avatarPreview && (
                                    <UploadIcon
                                        className="avatar-upload-icon"
                                        aria-hidden="true"
                                    />
                                )}
                            </div>

                            <div className="avatar-upload-text">
                                <span className="text-button">
                                    Upload avatar
                                </span>
                                <span className="text-body-s text-gray">
                                    Optional · JPG, PNG or WEBP
                                </span>
                            </div>
                        </label>

                        <input
                            id="avatar"
                            name="avatar"
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="visually-hidden"
                            onChange={handleAvatarChange}
                        />
                    </div>
                    <AuthInput
                        id="signup-username"
                        name="username"
                        label="Username"
                        placeholder="User"
                        value={values.username}
                        error={
                            showError("username")
                                ? errors.username
                                : ""
                        }
                        success={showSuccess("username")}
                        onChange={handleChange}
                        autoComplete="username"
                    />
                    <AuthInput
                        id="signup-email"
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
                        autoComplete="email"
                    />
                    <div className="password-holder">
                        <AuthInput
                            id="signup-password"
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
                            autoComplete="new-password"
                        />
                        <AuthInput
                            id="signup-confirm-password"
                            name="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            placeholder="••••••••"
                            value={values.confirmPassword}
                            error={
                                showError("confirmPassword")
                                    ? errors.confirmPassword
                                    : ""
                            }
                            success={showSuccess("confirmPassword")}
                            onChange={handleChange}
                            autoComplete="new-password"
                        />
                    </div>

                    <button
                        type="submit"
                        className={`auth-btn text-button ${
                            submitted
                                ? "auth-btn-submitted"
                                : ""
                        }`}
                    >
                        Sign up
                    </button>
                </form>

                <footer className="auth-footer">
                    <p className="text-body-m text-gray">
                        Already have an account?{" "}

                        <button
                            type="button"
                            className="auth-link text-button text-red"
                            onClick={() => {
                                resetForm();
                                closeModal("signin");
                                openModal("login");
                            }}
                        >
                            Log in
                        </button>
                    </p>
                </footer>

            </div>
        </ModalOverlay>
    );
}

export default SigninModal;
