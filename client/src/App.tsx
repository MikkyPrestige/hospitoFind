import { ErrorBoundary } from "react-error-boundary"
import HospitalList from "./components/hospitalList"

function App() {

  return (
    <>
      <ErrorBoundary fallback={<div>error.message</div>}>
        <h1>App</h1>
        <HospitalList />
      </ErrorBoundary>
    </>
  )
}

export default App
