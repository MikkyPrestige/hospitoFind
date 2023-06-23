import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary"
import { Fallback } from "@/components/fallback"
import { AppRoutes } from "./routes"

function App() {

  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <Suspense fallback={<p>Loading...</p>}>
        <AppRoutes />
      </Suspense>
    </ErrorBoundary>
  )
}

export default App
