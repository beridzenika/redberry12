import { ReactComponent as ErrorIcon } from "../../assets/icons/Error.svg";
import { ReactComponent as CheckIcon } from "../../assets/icons/Check.svg";

function AuthInput({
    id,
    name,
    label,
    type = "text",
    placeholder,
    value,
    error,
    success,
    onChange,
    autoComplete,
}) {
    const hasError = Boolean(error);

    return (
        <div
            className={`auth-input-holder ${
                hasError ? "text-red" : ""
            }`}
        >
            <label
                htmlFor={id}
                className="text-label-s"
            >
                {label}
            </label>

            <div
                className={`auth-input-wrapper ${
                    hasError ? "has-error" : ""
                } ${success ? "has-success" : ""}`}
            >
                <input
                    id={id}
                    name={name}
                    type={type}
                    value={value}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    aria-invalid={hasError}
                    aria-describedby={
                        hasError ? `${id}-error` : undefined
                    }
                    className="auth-input text-label-s"
                    onChange={onChange}
                />

                {hasError && (
                    <ErrorIcon
                        className="input-status-icon error-icon"
                        aria-hidden="true"
                    />
                )}

                {success && (
                    <CheckIcon
                        className="input-status-icon success-icon"
                        aria-hidden="true"
                    />
                )}
            </div>

            {hasError && (
                <p
                    id={`${id}-error`}
                    className="text-label-s text-red"
                    role="alert"
                >
                    {error}
                </p>
            )}
        </div>
    );
}

export default AuthInput;
