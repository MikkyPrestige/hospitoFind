// import { ErrorBoundary } from "react-error-boundary"
// import Fallback from "./components/fallback"
// import SearchForm from "./components/searchForm"
import LoginForm from "./pages/logInForm"
import SignUp from "./pages/signUpForm"
import UpdateForm from "./pages/upDateForm"
import DeleteBtn from "./components/deleteBtn"

function App() {

  return (
    <>
      {/* <ErrorBoundary FallbackComponent={Fallback}> */}
      <h1>App</h1>
      {/* <SearchForm /> */}
      <SignUp />
      <UpdateForm />
      <LoginForm />
      <DeleteBtn />
      {/* </ErrorBoundary> */}
    </>
  )
}

export default App
