import { useContext } from 'react'
import { AuthContext } from '@/context/UserProvider'

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within a ContextProvider')
  }
  return context
}
