import { useContext, createContext, useReducer } from "react";
import { AuthState, AuthAction, AuthContextType } from "@/services/userTypes";

const initialState: AuthState = {
  user: localStorage.getItem("user") || null,
  accessToken: localStorage.getItem("accessToken") || null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "REGISTER":
      return {
        ...state,
        user: action.payload?.user || state.user,
        accessToken: action.payload?.accessToken || state.accessToken
      }
    case "LOGIN":
      // Retrieve the access token from the cookie
      const accessTokenCookie = document.cookie.split("; ").find((cookies) => cookies.startsWith("accessToken="))
      const accessToken = accessTokenCookie?.split("=")[1] || ""
      localStorage.setItem("user", action.payload?.user || "");
      localStorage.setItem("accessToken", accessToken);
      return {
        ...state,
        user: action.payload?.user || state.user,
        accessToken: accessToken || state.accessToken
      }
    case "REFRESH":
      localStorage.setItem("accessToken", action.payload?.accessToken || "");
      return {
        ...state,
        accessToken: action.payload?.accessToken || state.accessToken
      }
    case "UPDATE":
      localStorage.setItem("user", action.payload?.user || "");
      return {
        ...state,
        user: action.payload?.user || state.user
      }
    case "DELETE":
      return {
        ...state,
        user: null,
        accessToken: null
      }
    case "LOGOUT":
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      return {
        ...state,
        user: null,
        accessToken: null
      }
    default:
      return state
  }
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  )
}

const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export { AuthProvider, useAuthContext }