// import { ErrorBoundary } from "react-error-boundary"
// import Fallback from "./components/fallback"
import SearchForm from "./components/searchForm"
import LoginForm from "./pages/loginForm"

function App() {

  return (
    <>
      {/* <ErrorBoundary FallbackComponent={Fallback}> */}
      <h1>App</h1>
      <SearchForm />
      <LoginForm />
      {/* </ErrorBoundary> */}
    </>
  )
}

export default App
