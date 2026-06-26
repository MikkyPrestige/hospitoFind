import 'axios'

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipErrorToast?: boolean
  }
}
