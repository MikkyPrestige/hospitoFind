import { useState, useEffect, useCallback } from "react";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import { UserData } from "@/types/user";

export const useAdminUsers = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const axiosPrivate = useAxiosPrivate();

    const fetchUsers = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await axiosPrivate.get("/admin/users");
            setUsers(response.data);
        } catch (err) {
            console.error("Failed to fetch users", err);
            toast.error("Could not load user directory. Please ensure your session is active.");
        } finally {
            setIsLoading(false);
        }
    }, [axiosPrivate]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const createUser = async (formData: any): Promise<boolean> => {
        try {
            await axiosPrivate.post("/admin/users", formData);
            toast.success("User created successfully!");
            await fetchUsers();
            return true;
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Error creating user");
            return false;
        }
    };

    const toggleRole = async (userId: string, currentRole: string) => {
        const newRole = currentRole === "admin" ? "user" : "admin";
        if (!window.confirm(`Are you sure you want to change this user to ${newRole.toUpperCase()}?`)) return;

        try {
            await axiosPrivate.patch("/admin/users/role", { userId, newRole });
            toast.success(`Role updated to ${newRole}`);
            await fetchUsers(); // Refresh to guarantee UI matches database
        } catch (err) {
            toast.error("Failed to update user role securely.");
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
            toast.error("Failed to update status. Please try again.");
        }
    };

    const deleteUser = async (id: string, username: string) => {
        if (!window.confirm(`PERMANENTLY DELETE ${username}? This cannot be undone.`)) return;
        try {
            await axiosPrivate.delete(`/admin/users/${id}`);
            setUsers(prev => prev.filter(u => u._id !== id));
            toast.success("User permanently removed from the system.");
        } catch (err) {
            toast.error("Failed to execute deletion securely.");
        }
    };

    return {
        users,
        isLoading,
        createUser,
        toggleRole,
        toggleStatus,
        deleteUser
    };
};