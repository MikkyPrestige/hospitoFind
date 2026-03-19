import { useState, useEffect } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import {
    FiSearch, FiRefreshCcw, FiTrash2, FiUserPlus,
    FiX, FiFilter, FiPower, FiShield
} from "react-icons/fi";
import { toast } from "react-toastify";
import styles from "./styles/scss/userManagement/userManagement.module.scss";
import { UserData } from "@/src/types/user";

const UserManagement = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        username: "", email: "", password: "", role: "user"
    });

    const axiosPrivate = useAxiosPrivate();

    const fetchUsers = async () => {
        try {
            setIsLoading(true);
            const response = await axiosPrivate.get("/admin/users");
            setUsers(response.data);
        } catch (err) {
            console.error("Failed to fetch users", err);
            toast.error("Could not load user directory");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axiosPrivate.post("/admin/users", formData);
            toast.success("User created successfully!");
            setShowModal(false);
            setFormData({ username: "", email: "", password: "", role: "user" });
            fetchUsers();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Error creating user");
        }
    };

    const toggleRole = async (userId: string, currentRole: string) => {
        const newRole = currentRole === "admin" ? "user" : "admin";
        if (!window.confirm(`Are you sure you want to change this user to ${newRole.toUpperCase()}?`)) return;
        try {
            await axiosPrivate.patch("/admin/users/role", { userId, newRole });
            toast.success(`Role updated to ${newRole}`);
            fetchUsers();
        } catch (err) {
            toast.error("Failed to update role");
        }
    };

    const toggleStatus = async (userId: string) => {
        try {
            const response = await axiosPrivate.patch(`/admin/users/${userId}`);
            const newStatus = response.data.isActive;
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user._id === userId ? { ...user, isActive: newStatus } : user
                )
            );
            toast.success(newStatus ? "User activated" : "User suspended");
        } catch (err) {
            console.error(err);
            toast.error("Failed to update status");
        }
    };

    const handleDeleteUser = async (id: string, username: string) => {
        if (!window.confirm(`PERMANENTLY DELETE ${username}? This cannot be undone.`)) return;
        try {
            await axiosPrivate.delete(`/admin/users/${id}`);
            setUsers(prev => prev.filter(u => u._id !== id));
            toast.success("User permanently removed");
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    const filteredUsers = users.filter(u => {
        const username = (u.username || "").toLowerCase();
        const email = (u.email || "").toLowerCase();
        const search = searchTerm.toLowerCase();
        const matchesSearch = username.includes(search) || email.includes(search);
        const matchesRole = roleFilter === "all" || u.role === roleFilter;

        const isActive = u.isActive !== false;
        const matchesStatus =
            statusFilter === "all" ? true :
                statusFilter === "active" ? isActive : !isActive;

        return matchesSearch && matchesRole && matchesStatus;
    });

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.titleRow}>
                    <div>
                        <h1>User Management</h1>
                        <p>Manage access levels and security for platform members</p>
                    </div>
                    <button className={styles.addBtn} onClick={() => setShowModal(true)}>
                        <FiUserPlus /> Create User
                    </button>
                </div>

                <div className={styles.controls}>
                    <div className={styles.searchBar}>
                        <FiSearch />
                        <input
                            type="text"
                            placeholder="Search users..."
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className={styles.filterGroup}>
                        <div className={styles.filterBox}>
                            <FiFilter />
                            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
                                <option value="all">All Roles</option>
                                <option value="admin">Admins Only</option>
                                <option value="user">Standard Users</option>
                            </select>
                        </div>
                        <div className={styles.filterBox}>
                            <FiShield />
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                                <option value="all">All Status</option>
                                <option value="active">Active Members</option>
                                <option value="suspended">Suspended</option>
                            </select>
                        </div>
                    </div>
                </div>
            </header>

            <div className={styles.tableWrapper}>
                {isLoading ? (
                    <div className={styles.loading}>Loading user registry...</div>
                ) : (
                    <table className={styles.userTable}>
                        <thead>
                            <tr>
                                <th>User Account</th>
                                <th>Email Address</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th style={{ textAlign: 'right' }}>Management</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user._id} className={user.isActive === false ? styles.suspendedRow : ""}>
                                    <td>
                                        <div className={styles.userInfo}>
                                            <div className={styles.avatar}>
                                                {(user.username?.[0] || "?").toUpperCase()}
                                            </div>
                                            <span className={styles.username}>{user.username || "Anonymous"}</span>
                                        </div>
                                    </td>
                                    <td className={styles.emailCell}>{user.email}</td>
                                    <td>
                                        <span className={`${styles.roleBadge} ${styles[user.role]}`}>
                                            {user.role.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => toggleStatus(user._id)}
                                            className={user.isActive !== false ? styles.activeStatus : styles.suspendedStatus}
                                            title={user.isActive !== false ? "Suspend User" : "Activate User"}
                                        >
                                            <FiPower /> {user.isActive !== false ? "Active" : "Suspended"}
                                        </button>
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <div className={styles.actionBtns}>
                                            <button onClick={() => toggleRole(user._id, user.role)} title="Change Role" className={styles.roleBtn}>
                                                <FiRefreshCcw />
                                            </button>
                                            <button onClick={() => handleDeleteUser(user._id, user.username)} className={styles.deleteBtn} title="Delete Account">
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2>Add System User</h2>
                            <FiX onClick={() => setShowModal(false)} className={styles.closeIcon} />
                        </div>
                        <form onSubmit={handleCreateUser} className={styles.modalForm}>
                            <div className={styles.inputGroup}>
                                <label>Username</label>
                                <input type="text" placeholder="e.g. jdoe_admin" required
                                    onChange={e => setFormData({ ...formData, username: e.target.value })} />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Email Address</label>
                                <input type="email" placeholder="e.g. admin@hospitofind.com" required
                                    onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Temporary Password</label>
                                <input type="password" placeholder="••••••••" required
                                    onChange={e => setFormData({ ...formData, password: e.target.value })} />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Initial Role</label>
                                <select onChange={e => setFormData({ ...formData, role: e.target.value })}>
                                    <option value="user">Standard User</option>
                                    <option value="admin">Administrator</option>
                                </select>
                            </div>
                            <button type="submit" className={styles.submitBtn}>Initialize Account</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;