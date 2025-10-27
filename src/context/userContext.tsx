import { useContext, createContext, useReducer } from "react";
import { AuthState, AuthAction, AuthContextType } from "@/services/user";

const initialState: AuthState = {
  username: localStorage.getItem("username") || null,
  name: localStorage.getItem("name") || null,
  email: localStorage.getItem("email") || null,
  password: null,
  newPassword: null,
  accessToken: localStorage.getItem("accessToken") || null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "REGISTER":
      localStorage.setItem("username", action.payload?.username || "");
      localStorage.setItem("name", action.payload?.name || "");
      localStorage.setItem("email", action.payload?.email || "");
      return {
        ...state,
        username: action.payload?.username || state.username,
        name: action.payload?.name || state.name,
        email: action.payload?.email || state.email,
      }
    case "LOGIN":
      // Retrieve the access token from the cookie
      const accessTokenCookie = document.cookie.split("; ").find((cookies) => cookies.startsWith("accessToken="))
      const accessToken = accessTokenCookie?.split("=")[1] || ""
      localStorage.setItem("username", (action.payload?.username || ""));
      localStorage.setItem("name", (action.payload?.name || ""));
      localStorage.setItem("email", (action.payload?.email || ""));
      localStorage.setItem("accessToken", accessToken);
      return {
        ...state,
        username: action.payload?.username || state.username,
        name: action.payload?.name || state.name,
        email: action.payload?.email || state.email,
        accessToken: accessToken || state.accessToken
      }
    case "REFRESH":
      localStorage.setItem("accessToken", action.payload?.accessToken || "");
      return {
        ...state,
        accessToken: action.payload?.accessToken || state.accessToken
      }
    case "UPDATE":
      localStorage.setItem("username", action.payload?.username || "");
      localStorage.setItem("name", action.payload?.name || "");
      localStorage.setItem("email", action.payload?.email || "");
      return {
        ...state,
        username: action.payload?.username || state.username,
        name: action.payload?.name || state.name,
        email: action.payload?.email || state.email,
      }
    case "PASSWORD-UPDATE":
      localStorage.setItem("username", action.payload?.username || "");
      return {
        ...state,
        username: action.payload?.username || state.username,
        password: action.payload?.password || state.password,
        newPassword: action.payload?.newPassword || state.newPassword
      }
    case "DELETE":
      document.cookie = `accessToken=; SameSite=None; Max-Age=0;`;
      localStorage.removeItem("username");
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      localStorage.removeItem("accessToken");
      return {
        ...state,
        username: null,
        name: null,
        email: null,
        accessToken: null
      }
    case "LOGOUT":
      document.cookie = `accessToken=; SameSite=None; Max-Age=0;`;
      localStorage.removeItem("username");
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      localStorage.removeItem("accessToken");
      return {
        ...state,
        username: null,
        name: null,
        email: null,
        accessToken: null
      }
    default:
      return state
  }
}

const ContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider >
  )
}

// const BASE_URL = "https://hospitofind-server.onrender.com";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

export { ContextProvider, useAuthContext, BASE_URL }