export interface User {
  name: string;
  username: string;
  email: string;
  password?: string;
  role?: "user" | "admin";
}

export interface Login {
  email: string;
  password: string;
}

export interface PasswordUpdate {
  username: string;
  password: string;
  newPassword: string;
}

export interface IdToken {
  email?: string;
  name?: string;
  nickname?: string;
  __raw?: string;
}

export interface AuthState {
  _id?: string | null;
  id?: string | null;
  username: string | null;
  name: string | null;
  email: string | null;
  role: "user" | "admin" | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  accessToken: string | null;
  password?: string | null;
  newPassword?: string | null;
}

export type AuthAction = {
  type: "LOGIN" | "REGISTER" | "UPDATE" | "REFRESH" | "PASSWORD-UPDATE" | "DELETE" | "LOGOUT";
  payload?: Partial<AuthState>;
};

export interface AuthContextType {
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
}

// admin interfaces for user management
export interface UserData {
    _id: string;
    username: string;
    email: string;
    role: "user" | "admin";
    isActive: boolean;
}