import { Route, Routes } from "react-router-dom"
import { ErrorBoundary } from "react-error-boundary"
import { Fallback } from "@/components/fallback"
import { Header } from "@/layouts/header"
import { Home } from "@/pages/home/home"
// import SearchForm from "./components/searchForm"
// import LoginForm from "./pages/logInForm"
// import SignUp from "./pages/signUpForm"
// import UpdateForm from "./pages/upDateForm"
// import DeleteBtn from "./components/deleteBtn"
// import Editor from "./markDown/editor"

function App() {

  return (
    <>
      <ErrorBoundary FallbackComponent={Fallback}>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        {/* <SearchForm /> */}
        {/* <SignUp /> */}
        {/* <UpdateForm /> */}
        {/* <Editor /> */}
        {/* <LoginForm /> */}
        {/* <DeleteBtn /> */}
      </ErrorBoundary>
    </>
  )
}

export default App
