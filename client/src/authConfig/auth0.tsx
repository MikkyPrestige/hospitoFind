import { Auth0Provider } from "@auth0/auth0-react"

const AuthProvider = ({ children }: any) => {
  // const onRedirectCallback = (appState: any) => {
  //   window.history.replaceState(
  //     appState && appState.returnTo ? appState.returnTo : window.location.pathname
  //   )
  // }

  return (
    <Auth0Provider
      domain="dev-gn5mgfsns0zgumu5.us.auth0.com"
      clientId="fM9v7vcb7ntUCpzMt2W3ZGamGDakKXsZ"
      authorizationParams={{
        redirect_uri: "http://localhost:5173"
      }}
    // onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  )
}

export default AuthProvider
