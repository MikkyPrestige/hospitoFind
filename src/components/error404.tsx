import { Avatar } from "./avatar";
// import { Link } from "react-router-dom";
import Error404 from "@/assets/images/error-404.gif";
import Header from "@/layouts/header/nav";
import Footer from "../layouts/footer/footer";
import { Helmet } from "react-helmet-async";

const Error404Page = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found | HospitoFind</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Header />
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        minHeight: "100vh",
        paddingTop: "5rem",
        backgroundColor: "#f8f9fa",
      }}>
        <Avatar image={Error404} alt="Error 404" style={{ width: "100%", maxWidth: "600px", height: "auto", borderRadius: "1.2rem", objectFit: "contain" }} />
        {/* <h1 style={{ fontSize: "2.5rem", marginTop: "1.5rem", color: "#343a40" }}>404 - Page Not Found</h1> */}
        <p style={{ fontSize: "1.5rem", color: "#6c757d", textAlign: "center", maxWidth: "600px" }}>
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
      </div >

      <Footer />
    </>
  )
}

export default Error404Page;