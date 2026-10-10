import { useEffect, useMemo, useState } from "react";

import {
    getInitialProfileValues,
    sanitizeMobileNumber,
    validateFullName,
    validateGeorgianMobileNumber,
} from "../../utils/profileUtils";

import { useAuthContext } from "../../hooks/useAuthContext";
import { useFilterOptions } from "../../hooks/useFilterOptions";
import { useProfile } from "../../hooks/useProfile";
import AuthInput from "./AuthInput";

import { ReactComponent as CalendarIcon } from "../../assets/icons/Calendar.svg";
import { ReactComponent as OpenIcon } from "../../assets/icons/Open.svg";

import "./Modals.css";

function ProfileForm() {
    const { user } = useAuthContext();

    const {
        update,
        loading,
        generalError,
        fieldErrors,
        setGeneralError,
        setFieldErrors,
    } = useProfile();

    const {
        data: filterOptions,
        loading: filterOptionsLoading,
        error: filterOptionsError,
    } = useFilterOptions();

    const [values, setValues] = useState(
        () => getInitialProfileValues(user)
    );

    const [initialValues, setInitialValues] = useState(
        () => getInitialProfileValues(user)
    );

    const [touched, setTouched] = useState({});

    useEffect(() => {
        const nextValues = getInitialProfileValues(user);

        setValues(nextValues);
        setInitialValues(nextValues);
        setTouched({});
    }, [user]);

    const venues = useMemo(() => {
        if (!filterOptions?.venues) {
            return [];
        }

        return [
            {
                value: "",
                label: "Select preferred venue",
            },
            ...filterOptions.venues.map((venue) => ({
                value: String(venue.id),
                label: venue.name,
            })),
        ];
    }, [filterOptions]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setValues((prev) => ({
            ...prev,
            [name]: value,
        }));

        setTouched((prev) => ({
            ...prev,
            [name]: true,
        }));

        setFieldErrors((prev) => ({
            ...prev,
            [name]: "",
        }));

        if (generalError) {
            setGeneralError("");
        }
    };

    const calculateAge = (dateOfBirth) => {
        if (!dateOfBirth) {
            return null;
        }

        const today = new Date();
        const birthDate = new Date(
            `${dateOfBirth}T00:00:00`
        );

        if (Number.isNaN(birthDate.getTime())) {
            return null;
        }

        let age =
            today.getFullYear() -
            birthDate.getFullYear();

        const monthDifference =
            today.getMonth() -
            birthDate.getMonth();

        if (
            monthDifference < 0 ||
            (
                monthDifference === 0 &&
                today.getDate() < birthDate.getDate()
            )
        ) {
            age--;
        }

        return age;
    };

    const errors = useMemo(() => {

        return {
            fullName:
                fieldErrors.fullName ||
                validateFullName(values.fullName),

            mobileNumber:
                fieldErrors.mobileNumber ||
                validateGeorgianMobileNumber(values.mobileNumber),

            dateOfBirth:
                fieldErrors.dateOfBirth ||
                (!values.dateOfBirth
                    ? "Date of birth is required"
                    : (() => {
                        const selectedDate = new Date(
                            `${values.dateOfBirth}T00:00:00`
                        );

                        const today = new Date();

                        if (
                            Number.isNaN(
                                selectedDate.getTime()
                            ) ||
                            selectedDate > today
                        ) {
                            return "Please enter a valid date of birth";
                        }

                        const age = calculateAge(
                            values.dateOfBirth
                        );

                        return age < 12
                            ? "You must be at least 12 years old to create an account"
                            : "";
                    })()),

            preferredVenueId:
                fieldErrors.preferredVenueId || "",

            email:
                fieldErrors.email || "",
        };
    }, [values, fieldErrors]);

    const showError = (field) =>
        Boolean(touched[field]) && Boolean(errors[field]);

    const showSuccess = (field) =>
        Boolean(touched[field]) &&
        Boolean(values[field]) &&
        !errors[field];

    const hasChanges = useMemo(
        () =>
            JSON.stringify(values) !==
            JSON.stringify(initialValues),
        [values, initialValues]
    );

    const isFormValid =
        Boolean(values.fullName.trim()) &&
        Boolean(values.email) &&
        Boolean(values.mobileNumber) &&
        Boolean(values.dateOfBirth) &&
        !errors.fullName &&
        !errors.email &&
        !errors.mobileNumber &&
        !errors.dateOfBirth;

    const age = calculateAge(values.dateOfBirth);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setTouched({
            fullName: true,
            mobileNumber: true,
            dateOfBirth: true,
            preferredVenueId: true,
        });

        if (
            loading ||
            filterOptionsLoading ||
            !hasChanges ||
            !isFormValid
        ) {
            return;
        }

        const result = await update({
            fullName: values.fullName.trim(),
            mobileNumber: sanitizeMobileNumber(
                values.mobileNumber
            ),
            dateOfBirth: values.dateOfBirth,
            preferredVenueId:
                values.preferredVenueId
                    ? Number(values.preferredVenueId)
                    : null,
        });

        if (!result.success) {
            return;
        }

        const updatedValues = {
            ...values,
            fullName: values.fullName.trim(),
            mobileNumber: values.mobileNumber.trim(),
            preferredVenueId: values.preferredVenueId
                ? String(values.preferredVenueId)
                : "",
        };

        setValues(updatedValues);
        setInitialValues(updatedValues);
        setTouched({});
    };

    const isLoading =
        loading || filterOptionsLoading;

    return (
        <div className="auth-modal auth-modal-profile">
            <form
                className="auth-form"
                noValidate
                onSubmit={handleSubmit}
            >
                <AuthInput
                    id="profile-full-name"
                    name="fullName"
                    label="Full Name"
                    type="text"
                    placeholder="Meri Sanikidze"
                    value={values.fullName}
                    error={
                        showError("fullName")
                            ? errors.fullName
                            : ""
                    }
                    success={showSuccess("fullName")}
                    onChange={handleChange}
                    disabled={isLoading}
                    autoComplete="name"
                />

                <div className="auth-input-holder">
                    <AuthInput
                        id="profile-email"
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
                        success={false}
                        onChange={handleChange}
                        disabled
                        autoComplete="email"
                    />

                    <p className="text-label-s text-gray">
                        Set at registration and cannot be changed
                    </p>
                </div>

                <AuthInput
                    id="profile-mobile-number"
                    name="mobileNumber"
                    label="Mobile Number"
                    type="tel"
                    placeholder="555 123 456"
                    value={values.mobileNumber}
                    error={
                        showError("mobileNumber")
                            ? errors.mobileNumber
                            : ""
                    }
                    success={showSuccess("mobileNumber")}
                    onChange={handleChange}
                    disabled={isLoading}
                    autoComplete="tel"
                />

                <div className="auth-input-holder">
                    <label
                        htmlFor="profile-date-of-birth"
                        className="text-label-s"
                    >
                        Date of Birth
                    </label>

                    <div
                        className={`auth-input-wrapper ${
                            showError("dateOfBirth")
                                ? "has-error"
                                : ""
                        } ${
                            showSuccess("dateOfBirth")
                                ? "has-success"
                                : ""
                        }`}
                    >
                        <input
                            id="profile-date-of-birth"
                            name="dateOfBirth"
                            type="date"
                            value={values.dateOfBirth}
                            onChange={handleChange}
                            className="auth-input text-label-s"
                            aria-invalid={showError(
                                "dateOfBirth"
                            )}
                            aria-describedby={
                                showError("dateOfBirth")
                                    ? "profile-date-of-birth-error"
                                    : undefined
                            }
                            disabled={isLoading}
                        />

                        <CalendarIcon
                            className="input-action-icon"
                            aria-hidden="true"
                        />
                    </div>

                    {showError("dateOfBirth") && (
                        <p
                            id="profile-date-of-birth-error"
                            className="text-label-s text-red"
                            role="alert"
                        >
                            {errors.dateOfBirth}
                        </p>
                    )}
                </div>

                {age !== null && age >= 12 && age < 16 && (
                    <p className="text-label-s text-gray">
                        You cannot buy tickets for 16+ or 18+ titles.
                    </p>
                )}

                <div className="auth-input-holder">
                    <label
                        htmlFor="profile-preferred-venue"
                        className="text-label-s"
                    >
                        Preferred Venue{" "}
                        <span>(optional)</span>
                    </label>

                    <div
                        className={`auth-input-wrapper ${
                            errors.preferredVenueId
                                ? "has-error"
                                : ""
                        }`}
                    >
                        <select
                            id="profile-preferred-venue"
                            name="preferredVenueId"
                            value={values.preferredVenueId}
                            onChange={handleChange}
                            className="auth-input text-label-s auth-select"
                            disabled={isLoading}
                            aria-invalid={Boolean(
                                errors.preferredVenueId
                            )}
                            aria-describedby={
                                errors.preferredVenueId
                                    ? "profile-preferred-venue-error"
                                    : undefined
                            }
                        >
                            {venues.map((venue) => (
                                <option
                                    key={venue.value}
                                    value={venue.value}
                                >
                                    {venue.label}
                                </option>
                            ))}
                        </select>

                        <OpenIcon
                            className="input-action-icon"
                            aria-hidden="true"
                        />
                    </div>

                    {errors.preferredVenueId && (
                        <p
                            id="profile-preferred-venue-error"
                            className="text-label-s text-red"
                            role="alert"
                        >
                            {errors.preferredVenueId}
                        </p>
                    )}

                    {filterOptionsError && (
                        <p
                            className="text-label-s text-red"
                            role="alert"
                        >
                            Failed to load venues. Please try again.
                        </p>
                    )}
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
                    disabled={
                        isLoading ||
                        !hasChanges ||
                        !isFormValid
                    }
                >
                    {loading
                        ? "Saving changes..."
                        : "Save Changes"}
                </button>
            </form>
        </div>
    );
}

export default ProfileForm;