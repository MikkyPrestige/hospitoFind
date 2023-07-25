import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary"
import { Fallback } from "@/components/fallback"
import { AppRoutes } from "./routes"
import Loading from "@/assets/images/loading.gif";

function App() {

  return (
    <ErrorBoundary FallbackComponent={Fallback}>
      <Suspense fallback={
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh"
        }}>
          <img src={Loading} alt="Loading gif" /></div>
      }>
        <AppRoutes />
      </Suspense>
    </ErrorBoundary>
  )
}

export default App
