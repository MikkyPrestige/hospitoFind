import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

type ErrorFallbackProps = {
  error?: Error;
  resetErrorBoundary?: () => void;
};

export const Fallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Check if the error is a "Race Condition" error.
    const errorMessage = error?.message?.toLowerCase() || "";
    const isStateError =
      errorMessage.includes("reading 'role'") ||
      errorMessage.includes("reading 'username'") ||
      errorMessage.includes("reading 'accesstoken'") ||
      errorMessage.includes("undefined") ||
      errorMessage.includes("null");

    if (isStateError) {
      // Give the app 800ms to finish PersistLogin and auto-recover.
      const timer = setTimeout(() => {
        setShouldShow(true);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      // If it's a critical error (syntax, network, etc.), show it immediately.
      setShouldShow(true);
    }
  }, [error]);

  // If the app is still in "Race Condition" gap, render nothing (invisible).
  if (!shouldShow) return null;

  return (
    <div
      role="alert"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
        height: "100vh",
        padding: "2rem",
        fontFamily: "'Inter', sans-serif",
        textAlign: "center"
      }}
    >
      <div style={{
        backgroundColor: "#fff1f1",
        padding: "2rem",
        borderRadius: "16px",
        boxShadow: "0 10px 25px rgba(255, 3, 62, 0.1)",
        maxWidth: "500px"
      }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 700, color: "#FF033E", margin: "0 0 1rem" }}>
          Oops! Something went wrong.
        </h1>
        <p style={{ fontSize: "1.1rem", color: "#444", marginBottom: "2rem", lineHeight: "1.5" }}>
          {error?.message || "An unexpected error occurred during synchronization."}
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => resetErrorBoundary?.() ?? window.location.reload()}
            style={{
              border: "none",
              background: "#FF033E",
              color: "#fff",
              padding: "0.8rem 1.5rem",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: 600,
              transition: "transform 0.2s",
            }}
          >
            Try again
          </button>

          <Link to='/' style={{
            textDecoration: "none",
            color: "#fff",
            backgroundColor: "#111",
            padding: "0.8rem 1.5rem",
            borderRadius: "10px",
            fontWeight: 600,
          }}>
            Home
          </Link>
        </div>
      </div>
    </div>
  );
};