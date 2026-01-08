import { Link } from "react-router-dom";

const SimpleFooter = () => {
    const year = new Date().getFullYear();

    return (
        <footer style={{
            width: "100%",
            padding: "1.5rem",
            textAlign: "center",
            marginTop: "auto",
            position: "relative",
            zIndex: 10,
            fontSize: "0.85rem",
            color: "var(--color-gray)",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            alignItems: "center"
        }}>
            <div>
                © {year} HospitoFind. All rights reserved.
            </div>

            <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.8rem" }}>
                <Link to="/policy" style={{ textDecoration: "none", color: "inherit", opacity: 0.8 }}>
                    Privacy Policy
                </Link>
                <Link to="/terms" style={{ textDecoration: "none", color: "inherit", opacity: 0.8 }}>
                    Terms of Service
                </Link>
                <Link to="/faq" style={{ textDecoration: "none", color: "inherit", opacity: 0.8 }}>
                    Help
                </Link>
            </div>
        </footer>
    );
};

export default SimpleFooter;