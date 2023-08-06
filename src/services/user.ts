export interface User {
  name: string
  username: string
  email: string
  password: string
}

export type Login = {
  email: string
  password: string
}

export interface AuthState {
  name: string | null
  username: string | null
  email: string | null
  accessToken: string | null
}

export interface AuthAction {
  type: "REGISTER" | "LOGIN" | "REFRESH" | "UPDATE" | "PASSWORD-UPDATE" | "DELETE" | "LOGOUT"
  payload?: {
    name?: string
    username?: string
    email?: string
    password?: string
    newPassword?: string
    accessToken?: string
  }
}

export interface AuthContextType {
  state: AuthState
  dispatch: React.Dispatch<AuthAction>
}