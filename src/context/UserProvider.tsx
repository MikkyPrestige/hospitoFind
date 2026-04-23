import { useContext, createContext, useReducer, ReactNode } from "react";
import { AuthState, AuthAction, AuthContextType } from "@/types/auth";

const initialState: AuthState = {
  _id: localStorage.getItem("_id") || localStorage.getItem("id") || null,
  username: localStorage.getItem("username") || null,
  name: localStorage.getItem("name") || null,
  email: localStorage.getItem("email") || null,
  role: (localStorage.getItem("role") as "user" | "admin") || null,
  auth0Id: localStorage.getItem("auth0Id") || null,
  createdAt: localStorage.getItem("createdAt") || null,
  updatedAt: localStorage.getItem("updatedAt") || null,
  accessToken: localStorage.getItem("accessToken") || null,
  password: null,
  newPassword: null,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN":
    case "REGISTER":
    case "UPDATE":
    case "REFRESH":
      if (action.payload) {
        Object.entries(action.payload).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            localStorage.setItem(key, value.toString());
          }
        });
      }

      const data = action.payload as AuthState;
      return {
        ...state,
        accessToken: data.accessToken,
        name: data.name,
        username: data.username,
        email: data.email,
        role: data.role,
        id: data.id,
        createdAt: data.createdAt,
        auth0Id: data.auth0Id || null,
      };

    case "LOGOUT":
    case "DELETE":
      const keysToRemove = [
        "accessToken",
        "username",
        "name",
        "email",
        "role",
        "id",
        "_id",
        "auth0Id",
        "createdAt",
        "updatedAt",
        "auth0.is_authenticated",
        "selectedLink"
      ];
      keysToRemove.forEach(key => localStorage.removeItem(key));
      return {
        ...initialState,
        _id: null,
        username: null,
        name: null,
        email: null,
        role: null,
        auth0Id: null,
        createdAt: null,
        updatedAt: null,
        accessToken: null,
        password: null,
        newPassword: null,
      };

    default:
      return state;
  }
};

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};


export const BASE_URL = import.meta.env.VITE_BASE_URL;

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within a ContextProvider");
  }
  return context;
};
