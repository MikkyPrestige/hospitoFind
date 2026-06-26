import { Auth0Provider, AppState } from '@auth0/auth0-react'
import { useNavigate } from 'react-router-dom'

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()

  const domain = import.meta.env.VITE_Auth0_Domain
  const clientId = import.meta.env.VITE_Auth0_ClientID
  const redirectUri = import.meta.env.VITE_Auth0_RedirectURL

  const onRedirectCallback = (appState?: AppState) => {
    navigate(appState?.returnTo || window.location.pathname)
  }

  if (!(domain && clientId && redirectUri)) {
    return null
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: redirectUri,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  )
}

export default AuthProvider
