export interface User {
  name: string
  username: string
  email: string
  password: string
}

export type Login = {
  username: string
  password: string
}

export interface AuthState {
  user: string | null
  accessToken: string | null
}

export interface AuthAction {
  type: "REGISTER" | "LOGIN" | "REFRESH" | "UPDATE" | "DELETE" | "LOGOUT"
  payload?: {
    user?: string
    accessToken?: string
  }
}

export interface AuthContextType {
  state: AuthState
  dispatch: React.Dispatch<AuthAction>
}