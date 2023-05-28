// import { ErrorBoundary } from "react-error-boundary"
// import Fallback from "./components/fallback"
// import HospitalList from "./components/hospitalList"
import SearchForm from "./components/searchForm"

function App() {

  return (
    <>
      {/* <ErrorBoundary FallbackComponent={Fallback}> */}
      <h1>App</h1>
      {/* <HospitalList /> */}
      <SearchForm />
      {/* </ErrorBoundary> */}
    </>
  )
}

export default App
