// import { ErrorBoundary } from "react-error-boundary"
// import Fallback from "./components/fallback"
import HospitalList from "./components/hospitalList"

function App() {

  return (
    <>
      {/* <ErrorBoundary FallbackComponent={Fallback}> */}
      <h1>App</h1>
      <HospitalList />
      {/* </ErrorBoundary> */}
    </>
  )
}

export default App
