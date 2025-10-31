import { Link } from 'react-router-dom'

type ErrorFallbackProps = {
  error?: Error
  resetErrorBoundary?: () => void
}

export const Fallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  return (
    <div
      role="alert"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        height: "100vh",
      }}
    >
      <h1 style={{ fontSize: "1.8rem", fontWeight: 600, color: "#FF033E" }}>
        Oops! Something went wrong.
      </h1>
      <p style={{ fontSize: "1.2rem", textAlign: "center" }}>
        {error?.message || "An unexpected error occurred."}
      </p>

      <button
        onClick={() => resetErrorBoundary?.() ?? window.location.reload()}
        style={{
          border: "none",
          background: "#FF033E",
          color: "#fff",
          padding: "0.6rem 1.2rem",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Try again
      </button>
      <Link to='/' style={{
        textDecoration: "none",
        color: "#fff",
        backgroundColor: "#000",
        padding: "0.6rem 1.2rem",
        borderRadius: "8px",
      }}>Go back to home page</Link>
    </div>
  );
};
