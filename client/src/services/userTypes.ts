export interface User {
  // id: string
  name: string
  username: string
  email: string
  password: string
  // profileDp: File | null
}

export type Login = {
  username: string
  password: string
}

export interface AuthState {
  // id: string | null
  name: string | null
  username: string | null
  email: string | null
  password: string | null
  // profileDp: File | null
  accessToken: string | null
}

export interface AuthAction {
  type: "REGISTER" | "LOGIN" | "REFRESH" | "UPDATE" | "PASSWORD-UPDATE" | "DELETE" | "LOGOUT"
  payload?: {
    // id?: string
    name?: string
    username?: string
    email?: string
    password?: string
    newPassword?: string
    // profileDp?: File
    accessToken?: string
  }
}

export interface AuthContextType {
  state: AuthState
  dispatch: React.Dispatch<AuthAction>
}