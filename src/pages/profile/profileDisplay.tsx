import { useAuthContext } from "@/context/UserProvider";
import style from "./styles/profileDisplay.module.css";

interface ProfileDisplayProps {
    onEditClick: () => void;
}

const ProfileDisplay = ({ onEditClick }: ProfileDisplayProps) => {
    const { state } = useAuthContext();
    const isSocialUser = !!state.auth0Id;

    const formatDate = (dateString?: string) => {
        if (!dateString) return "Recent";

        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "Recent";

        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const getAccountType = () => {
        if (state.auth0Id) {
            return state.auth0Id.toLowerCase().includes("google")
                ? "Google Account"
                : "Social Account";
        }
        return "Email & Password";
    };

    return (
        <div className={style.infoGrid}>
            <div className={style.infoItem}>
                <label>Full Name</label>
                <p>{state.name || "N/A"}</p>
            </div>

            <div className={style.infoItem}>
                <label>Username</label>
                <p>@{state.username}</p>
            </div>

            <div className={style.infoItem}>
                <label>Email Address</label>
                <p>{state.email}</p>
            </div>

            <div className={style.infoItem}>
                <label>Sign-in Method</label>
                <div>
                    <span className={style.badge}>{getAccountType()}</span>
                </div>
            </div>

            <div className={style.joinDate}>
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Member since {formatDate(state.createdAt || undefined)}</span>
            </div>

            {isSocialUser && (
                <div className={style.socialWarning}>
                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>
                        This profile is linked to your <strong>{getAccountType()}</strong>.
                        To update your primary details, please visit your provider's settings.
                    </p>
                </div>
            )}

            <div style={{ gridColumn: "1 / -1" }}>
                <button className={style.editBtn} onClick={onEditClick} disabled={isSocialUser}>
                    {isSocialUser ? "Profile Managed via Social" : "Edit Profile"}
                </button>
            </div>
        </div>
    );
};

export default ProfileDisplay;