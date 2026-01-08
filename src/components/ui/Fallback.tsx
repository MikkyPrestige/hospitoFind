import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SimpleHeader from '@/layouts/header/SimpleHeader';
import SimpleFooter from '@/layouts/footer/SimpleFooter';

type ErrorFallbackProps = {
  error ?: Error;
  resetErrorBoundary ?: () => void;
};

export const Fallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const errorMessage = error?.message?.toLowerCase() || "";
    const isStateError =
      errorMessage.includes("reading 'role'") ||
      errorMessage.includes("reading 'username'") ||
      errorMessage.includes("reading 'accesstoken'") ||
      errorMessage.includes("undefined") ||
      errorMessage.includes("null");

    if (isStateError) {
      const timer = setTimeout(() => {
        setShouldShow(true);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setShouldShow(true);
    }
  }, [error]);

  if (!shouldShow) return null;

  return (
    <>
    <SimpleHeader/>
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
        backgroundColor: "var(--color-bg-contrast)",
        padding: "2rem",
        borderRadius: "16px",
        boxShadow: "0 10px 25px rgba(255, 3, 62, 0.1)",
        maxWidth: "500px"
      }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 700, color: "var(--color-red)", margin: "0 0 1rem" }}>
          Oops! Something went wrong.
        </h1>
        <p style={{ fontSize: "1.1rem", color: "var(--color-gray)", marginBottom: "2rem", lineHeight: "1.5" }}>
          {error?.message || "An unexpected error occurred during synchronization."}
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => resetErrorBoundary?.() ?? window.location.reload()}
            style={{
              border: "none",
              background: "var(--color-red)",
              color: "var(--color-black)",
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
            color: "var(--color-black)",
            backgroundColor: "var(--color-bg-light)",
            padding: "0.8rem 1.5rem",
            borderRadius: "10px",
            fontWeight: 600,
          }}>
            Home
          </Link>
        </div>
      </div>
    </div>
    <SimpleFooter/>
    </>
  );
};