import { useRef, useState } from "react";
import { Link } from "react-router-dom";

import ProfileTab from "./ProfileTab";
import { useDismiss } from "../../hooks/useDismiss";
import { useLogout } from "../../hooks/useLogout";

import { ReactComponent as CheckIcon } from "../../assets/icons/Check.svg";
import { ReactComponent as ProfileIcon } from "../../assets/icons/Profile.svg";
import { ReactComponent as TicketIcon } from "../../assets/icons/Ticket.svg";
import { ReactComponent as LogOutIcon } from "../../assets/icons/LogOut.svg";

import "./Profile.css";

function ProfileDropdown({ user }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const { handleLogout, loading, error,} = useLogout();

    const fullName = user?.fullName?.trim();
    const username = user?.username?.trim();

    const displayName = fullName
        ? fullName.split(/\s+/)[0]
        : username || "User";

    const avatarInitials = fullName
        ? fullName
            .split(/\s+/)
            .map((name) => name.charAt(0).toUpperCase())
            .join("")
        : (username?.charAt(0).toUpperCase() || "U");

    const avatarUrl =
        user?.avatar && user.avatar !== "string"
            ? user.avatar
            : null;

    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    useDismiss({
        ref: dropdownRef,
        open: isOpen,
        onDismiss: handleClose,
    });

    return (
        <div className="profile-dropdown-container" ref={dropdownRef}>
            <button
                type="button"
                className="profile-dropdown-trigger"
                onClick={handleToggle}
                aria-expanded={isOpen}
                aria-controls="profile-dropdown"
                aria-label="Open profile menu"
            >
                <ProfileTab user={user} isOpen={isOpen} />
            </button>

            {isOpen && (
                <div
                    id="profile-dropdown"
                    className="profile-dropdown"
                    aria-label="Profile menu"
                >
                    <div className="profile-user">
                        <div className="profile-avatar-wrapper">
                            <div
                                className="profile-avatar bg-img"
                                style={
                                    avatarUrl
                                        ? {
                                              backgroundImage: `url(${avatarUrl})`,
                                          }
                                        : undefined
                                }
                            >
                                {!avatarUrl && (
                                    <span className="text-label-s">
                                        {avatarInitials}
                                    </span>
                                )}
                            </div>
                            <span
                                className={`profile-status ${
                                    user?.profileComplete
                                        ? "status-complete"
                                        : ""
                                }`}
                                aria-label={
                                    user?.profileComplete
                                        ? "Profile complete"
                                        : "Profile incomplete"
                                }
                            />
                        </div>
                        <div className="profile-header">
                            <div className="text-label-m">
                                {displayName}
                            </div>

                            {user?.email && (
                                <span className="text-body-s text-gray">
                                    {user.email}
                                </span>
                            )}
                        </div>
                    </div>

                    {user?.profileComplete ? (
                        <div
                            className="profile-status-badge badge-status-complete"
                            role="status"
                        >
                            <span className="text-label-m">
                                Profile Complete
                            </span>
                            <CheckIcon
                                className="success-icon"
                                aria-hidden="true"
                            />
                        </div>
                    ) : (
                        <div
                            className="profile-status-badge"
                            role="status"
                        >
                            <div className="text-label-m">
                                Profile incomplete
                            </div>
                            <span className="text-body-s text-gray">
                                Please complete your profile to enable
                                booking
                            </span>
                        </div>
                    )}

                    <nav
                        className="profile-dropdown-link-holder"
                        aria-label="Account navigation"
                    >
                        <Link
                            to="/profile"
                            className="profile-dropdown-link"
                            onClick={handleClose}
                        >
                            <ProfileIcon aria-hidden="true" />
                            <span className="text-label-m">
                                My Profile
                            </span>
                        </Link>
                        <Link
                            to="/tickets"
                            className="profile-dropdown-link"
                            onClick={handleClose}
                        >
                            <TicketIcon aria-hidden="true" />
                            <span className="text-label-m">
                                My Tickets
                            </span>
                        </Link>
                    </nav>
                    <hr className="page-line" />
                    <button
                        type="button"
                        className="profile-dropdown-footer"
                        onClick={handleLogout}
                        disabled={loading}
                    >
                        <LogOutIcon
                            className="error-icon"
                            aria-hidden="true"
                        />
                        <span className="text-label-m text-red">
                            {loading ? "Logging out..." : "Log out"}
                        </span>
                    </button>
                    {error && (
                        <p role="alert">
                            {error}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}

export default ProfileDropdown;