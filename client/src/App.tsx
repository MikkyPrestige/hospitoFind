import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary"
import { Fallback } from "@/components/fallback"
import { Header } from "@/layouts/header/nav"
import { Footer } from "./layouts/footer/footer"
import { AppRoutes } from "./routes"
// import SearchForm from "./components/searchForm"
// import UpdateForm from "./pages/upDateForm"
// import DeleteBtn from "./components/deleteBtn"
// import Editor from "./markDown/editor"

function App() {

  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <Suspense fallback={<p>Loading...</p>}>
        <Header />
        <AppRoutes />
        {/* <Footer /> */}
        {/* <SearchForm /> */}
        {/* <UpdateForm /> */}
        {/* <Editor /> */}
        {/* <DeleteBtn /> */}
      </Suspense>
    </ErrorBoundary>
  )
}

export default App
