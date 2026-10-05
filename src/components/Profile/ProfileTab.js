import { ReactComponent as OpenIcon } from "../../assets/icons/Open.svg";
import './Profile.css'

function ProfileTab({ user }) {
    const displayName = user?.username || user?.fullName || "User";

    const avatarUrl =
        user?.avatar &&
        user.avatar !== "string"
            ? user.avatar
            : null;

    return (
        <div className="profile-tab">
            <div className="user-profile">
                <div className="profile-avatar-wrapper">
                    <div
                        className="profile-avatar"
                        style={
                            avatarUrl ? { backgroundImage: `url(${avatarUrl})`,} :
                            undefined}
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
                <span className="text-label-m">
                    {displayName}
                </span>    
            </div>
            <OpenIcon
                className="profile-open-icon"
                aria-hidden="true"
            />
        </div>
    );
}

export default ProfileTab;
