import { ReactComponent as OpenIcon } from "../../assets/icons/Open.svg";
import "./Profile.css";

function ProfileTab({ user, isOpen }) {
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

    return (
        <div className="profile-tab">
            <div className="profile-user">
                <div className="profile-avatar-wrapper">
                    <div
                        className="profile-avatar bg-img"
                        style={
                            avatarUrl
                                ? { backgroundImage: `url(${avatarUrl})` }
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
                    />
                </div>

                <div className="text-label-m">
                    {displayName}
                </div>
            </div>

            <OpenIcon
                className={`profile-open-icon ${
                    isOpen ? "open-icon-rotated" : ""
                }`}
                aria-hidden="true"
            />
        </div>
    );
}

export default ProfileTab;