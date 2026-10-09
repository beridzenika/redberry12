import { useEffect, useState } from "react";

import { useModal } from "../../hooks/useModal";
import { useAuth } from "../../hooks/useAuth";
import ModalOverlay from "../Modal/ModalOverlay";
import AuthInput from "./AuthInput";

import { ReactComponent as CloseIcon } from "../../assets/icons/Close.svg";
import { ReactComponent as UploadIcon } from "../../assets/icons/LogOut.svg";

import "./Modals.css";

function SigninModal() {
    const {modals, openModal, closeModal, } = useModal();
    const { register, loading, generalError, setGeneralError } 
        = useAuth();

    const [apiErrors, setApiErrors] = useState({});
    const [avatarError, setAvatarError] = useState("");

    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);

    const resetForm = () => {
        setValues({
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        });
        setApiErrors({});
        setGeneralError("");
        setAvatarFile(null);
        setAvatarPreview((previousUrl) => {
            if (previousUrl) {
                URL.revokeObjectURL(previousUrl);
            }
            return null;
        });
    }

    const handleClose = () => {
        resetForm();
        closeModal("signin");
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
        if(generalError) {
            setGeneralError("");
        }
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
            setAvatarError("Please upload a JPG, PNG, or WEBP image.");
            return;
        }

        setAvatarError("");
        setAvatarFile(file);

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
            apiErrors.username || 
            (!values.username
                ? "Username is required"
                : values.username.length < 3
                    ? "Username must be at least 3 characters"
                    : ""),
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
        confirmPassword:
            !values.confirmPassword
                ? "Please confirm your password"
                : values.confirmPassword !== values.password
                    ? "Passwords do not match"
                    : "",
    };

    const showError = (field) =>
        Boolean(values[field]) && Boolean(errors[field]);

    const showSuccess = (field) =>
        Boolean(values[field]) && !errors[field];

    const isFormValid =
        Boolean(values.username) &&
        Boolean(values.email) &&
        Boolean(values.password) &&
        Boolean(values.confirmPassword) &&
        !errors.username &&
        !errors.email &&
        !errors.password &&
        !errors.confirmPassword;

    const handleSubmit = async (event) => {
        event.preventDefault();

        setApiErrors({});
        
        if(Object.values(errors).some(Boolean)) {
            return;
        }
        
        const result = await register(
            avatarFile, 
            values.username, 
            values.email, 
            values.password,
            values.confirmPassword,
        );

        if(!result.success) {
            setApiErrors(result.fieldErrors || {});
            return;
        }
        handleClose();
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
                                className={`avatar-preview bg-img ${
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
                            disabled={loading}
                            onChange={handleAvatarChange}
                        />
                    </div>
                    {avatarError && (
                        <p className="text-label-s text-red" role="alert">
                            {avatarError}
                        </p>
                    )}
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
                        disabled={loading}
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
                        disabled={loading}
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
                            disabled={loading}
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
                            disabled={loading}
                            autoComplete="new-password"
                        />
                    </div>
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
                        className="auth-btn text-button"
                        disabled={loading || !isFormValid}
                    >
                        {loading ? "Signing up..." : "Sign up"}
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
