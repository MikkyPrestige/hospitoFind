import { useState } from 'react';
import { useAuthContext } from '@/context/userContext';
import useUpdate from '@/hooks/user/update';
import usePasswordUpdate from '@/src/hooks/user/updatePassword';
import useDelete from '@/hooks/user/delete';
import { FiUser, FiLock, FiTrash2, FiAlertTriangle } from 'react-icons/fi';
import styles from './style/scss/accountSettings/accountSettings.module.scss';

const AccountSettings = () => {
    const { state } = useAuthContext();
    const { update, loading: upLoading } = useUpdate();
    const { updatePassword, loading: passLoading } = usePasswordUpdate();
    const { deleteUser, loading: delLoading } = useDelete();

    // Form States
    const [profileForm, setProfileForm] = useState({
        username: state.username || '',
        name: state.name || '',
        email: state.email || ''
    });

    const [passForm, setPassForm] = useState({
        username: state.username || '',
        password: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [deleteConfirm, setDeleteConfirm] = useState({ password: '' });

    // Handlers
    const handleUpdateProfile = (e: React.FormEvent) => {
        e.preventDefault();
        update(profileForm as any);
    };

    const handleUpdatePassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (passForm.newPassword !== passForm.confirmPassword) return alert("Passwords do not match");
        updatePassword(passForm);
    };

    const handleDeleteAccount = (e: React.FormEvent) => {
        e.preventDefault();
        if (window.confirm("Are you absolutely sure? This cannot be undone.")) {
            deleteUser(state.username || '', deleteConfirm.password);
        }
    };

    return (
        <div className={styles.settingsWrapper}>
            <h1>Account Settings</h1>

            {/* PROFILE INFO SECTION */}
            <section className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                    <FiUser /> <h2>Profile Information</h2>
                </div>
                <form onSubmit={handleUpdateProfile}>
                    <div className={styles.inputGroup}>
                        <label>Full Name</label>
                        <input type="text" value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Email</label>
                        <input type="email" value={profileForm.email} onChange={e => setProfileForm({ ...profileForm, email: e.target.value })} />
                    </div>
                    <button type="submit" disabled={upLoading}>{upLoading ? 'Saving...' : 'Update Profile'}</button>
                </form>
            </section>

            {/* SECURITY SECTION */}
            <section className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                    <FiLock /> <h2>Security & Password</h2>
                </div>
                <form onSubmit={handleUpdatePassword}>
                    <div className={styles.inputGroup}>
                        <label>Current Password</label>
                        <input type="password" required onChange={e => setPassForm({ ...passForm, password: e.target.value })} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>New Password</label>
                        <input type="password" required onChange={e => setPassForm({ ...passForm, newPassword: e.target.value })} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Confirm New Password</label>
                        <input type="password" required onChange={e => setPassForm({ ...passForm, confirmPassword: e.target.value })} />
                    </div>
                    <button type="submit" disabled={passLoading}>{passLoading ? 'Updating...' : 'Change Password'}</button>
                </form>
            </section>

            {/* DANGER ZONE */}
            <section className={`${styles.sectionCard} ${styles.dangerZone}`}>
                <div className={styles.sectionHeader}>
                    <FiAlertTriangle /> <h2>Danger Zone</h2>
                </div>
                <p>Once you delete your account, there is no going back. Please be certain.</p>
                <form onSubmit={handleDeleteAccount}>
                    <input
                        type="password"
                        placeholder="Enter password to confirm deletion"
                        required
                        onChange={e => setDeleteConfirm({ password: e.target.value })}
                    />
                    <button type="submit" className={styles.deleteBtn} disabled={delLoading}>
                        <FiTrash2 /> {delLoading ? 'Deleting...' : 'Delete My Account'}
                    </button>
                </form>
            </section>
        </div>
    );
};

export default AccountSettings;