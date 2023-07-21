import { Link } from 'react-router-dom';

type ErrorProps = {
  error: string
}

export const Fallback = ({ error }: ErrorProps) => {
  return (
    <div role='alert' style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", height: "100vh" }}>
      <h1 style={{ fontSize: "1.8rem", fontWeight: 600, color: "#FF033E" }}>Oops! Something went wrong.</h1>
      <p style={{ fontSize: "1.2rem", fontWeight: 400, textAlign: "center" }}>{error}</p>
      <Link to='/' style={{ textDecoration: "none", color: "#000" }}>Go back to home page</Link>
    </div>
  );
};
