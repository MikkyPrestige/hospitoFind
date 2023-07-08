import { useContext, createContext, useReducer } from "react";
import { AuthState, AuthAction, AuthContextType } from "@/services/userTypes";

const initialState: AuthState = {
  // id: localStorage.getItem("id") || null,
  username: localStorage.getItem("username") || null,
  name: localStorage.getItem("name") || null,
  email: localStorage.getItem("email") || null,
  // profileDp: JSON.parse(localStorage.getItem("profileDp") || "null"),
  accessToken: localStorage.getItem("accessToken") || null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "REGISTER":
      // localStorage.setItem("id", action.payload?.id || "")
      localStorage.setItem("username", action.payload?.username || "");
      localStorage.setItem("name", action.payload?.name || "");
      localStorage.setItem("email", action.payload?.email || "");
      // localStorage.setItem("profileDp", JSON.stringify(action.payload?.profileDp || null));
      return {
        ...state,
        // id: action.payload?.id || state.id,
        username: action.payload?.username || state.username,
        name: action.payload?.name || state.name,
        email: action.payload?.email || state.email,
        // profileDp: action.payload?.profileDp || state.profileDp
      }
    case "LOGIN":
      // Retrieve the access token from the cookie
      const accessTokenCookie = document.cookie.split("; ").find((cookies) => cookies.startsWith("accessToken="))
      const accessToken = accessTokenCookie?.split("=")[1] || ""
      // localStorage.setItem("id", (action.payload?.id || ""));
      localStorage.setItem("username", (action.payload?.username || ""));
      localStorage.setItem("name", (action.payload?.name || ""));
      localStorage.setItem("email", (action.payload?.email || ""));
      // localStorage.setItem("profileDp", JSON.stringify(action.payload?.profileDp || null));
      localStorage.setItem("accessToken", accessToken);
      return {
        ...state,
        // id: action.payload?.id || state.id,
        username: action.payload?.username || state.username,
        name: action.payload?.name || state.name,
        email: action.payload?.email || state.email,
        // profileDp: action.payload?.profileDp || state.profileDp,
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
      // localStorage.setItem("profileDp", JSON.stringify(action.payload?.profileDp || null));
      return {
        ...state,
        username: action.payload?.username || state.username,
        name: action.payload?.name || state.name,
        email: action.payload?.email || state.email,
        // profileDp: action.payload?.profileDp || state.profileDp
      }
    case "PASSWORD-UPDATE":
      localStorage.setItem("username", action.payload?.username || "");
      return {
        ...state,
        username: action.payload?.username || state.username,
      }
    case "DELETE":
      // remove access token from cookie
      document.cookie = `accessToken=; SameSite=None; Max-Age=0;`;
      localStorage.removeItem("username");
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      // localStorage.removeItem("profileDp");
      localStorage.removeItem("accessToken");
      return {
        ...state,
        // id: null,
        username: null,
        name: null,
        email: null,
        // profileDp: null,
        accessToken: null
      }
    case "LOGOUT":
      // remove access token from cookie
      document.cookie = `accessToken=; SameSite=None; Max-Age=0;`;
      localStorage.removeItem("username");
      localStorage.removeItem("name");
      localStorage.removeItem("email");
      // localStorage.removeItem("profileDp");
      localStorage.removeItem("accessToken");
      return {
        ...state,
        // id: null,
        username: null,
        name: null,
        email: null,
        // profileDp: null,
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

const BASE_URL = "http://localhost:5000";

const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

export { ContextProvider, useAuthContext, BASE_URL }