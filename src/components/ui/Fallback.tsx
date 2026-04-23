import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ErrorFallbackProps } from "@/types/ui";
import SimpleHeader from '@/layouts/header/simpleHeader';
import SimpleFooter from '@/layouts/footer/simpleFooter';
import style from './styles/fallback.module.css';

export const Fallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const errorMessage = error?.message?.toLowerCase() || "";

    // handle state-sync errors gracefully
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
      <SimpleHeader />
      <div className={style.errorContainer} role="alert">
        <div className={style.contentCard}>
          <h1 className={style.title}>
            Oops! Something went wrong.
          </h1>
          <p className={style.message}>
            {error?.message || "An unexpected error occurred during synchronization."}
          </p>

          <div className={style.actions}>
            <button
              className={style.btnRetry}
              onClick={() => resetErrorBoundary?.() ?? window.location.reload()}
            >
              Try again
            </button>

            <Link to='/' className={style.btnHome}>
              Home
            </Link>
          </div>
        </div>
      </div>
      <SimpleFooter />
    </>
  );
};