import { Avatar } from "./avatar";
import { Link } from "react-router-dom";
import Error404 from "@/assets/images/error-404.gif";
import Header from "@/layouts/header/nav";
import { Helmet } from "react-helmet-async";

const Error404Page = () => {
  return (
    <>
      <Helmet>
        <title>404 | Hospital Finder</title>
        <meta name="description" content="Page not found" />
        <meta name="keywords" content="hospital, doctor, appointment, health, care, medical, clinic, find, search, nearby, nearest" />
      </Helmet>
      <Header />
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "2rem",
        minHeight: "100vh",
        paddingTop: "8rem",
backgroundColor: "#f8f9fa",
      }}>
        <Avatar image={Error404} alt="Error 404" style={{ width: "100%", maxWidth: "600px", height: "auto", borderRadius: "1.2rem", objectFit: "contain" }} />
        <Link to="/" style={{
          textDecoration: "none",
          marginTop: "1.5rem",
          padding: "0.8rem 1.5rem",
          backgroundColor: "#007bff",
          color: "#fff",
          borderRadius: "0.5rem",
          fontWeight: "bold",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          transition: "background-color 0.3s ease",
        }}>Go Back</Link>
      </div >
    </>
  )
}

export default Error404Page;