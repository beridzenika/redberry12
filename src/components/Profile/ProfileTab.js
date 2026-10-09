import { ReactComponent as OpenIcon } from "../../assets/icons/Open.svg";
import "./Profile.css";

function ProfileTab({ user, isOpen }) {
    const displayName = user?.username || user?.fullName || "User";
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
                                {displayName.charAt(0).toUpperCase()}
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