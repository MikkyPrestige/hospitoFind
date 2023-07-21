import { Avatar } from "./avatar";
import { Link } from "react-router-dom";
import Error404 from "@/assets/images/error-404.gif";
import Header from "@/layouts/header/nav";

const Error404Page = () => {
  return (
    <>
      <Header />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <Avatar image={Error404} alt="Error 404" style={{ width: "70%", height: "80%", borderRadius: "1.2rem", objectFit: "contain" }} />
        <Link to="/" style={{ textDecoration: "none", color: "#000", marginTop: "1rem" }}>Go back to home</Link>
      </div>
    </>
  )
}

export default Error404Page;