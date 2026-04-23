export type UserRole = "user" | "admin";

export interface User {
  name: string;
  username: string;
  email: string;
  password?: string;
  role?: UserRole;
  auth0Id?: string;
}

export interface UserData {
    _id: string;
    username: string;
    email: string;
    role: UserRole;
    isActive: boolean;
}

export interface ProfileDisplayProps {
    onEditClick: () => void;
}

export interface UpdateUserProps {
  onSuccess?: () => void;
}