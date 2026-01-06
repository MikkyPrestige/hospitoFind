import { Link } from "react-router-dom";
import Logo from "@/assets/images/logo.svg";
import ThemeToggle from "@/components/themeToggle";
import { FiArrowLeft } from "react-icons/fi";
import { useTheme } from "@/context/themeContext";

const SimpleHeader = () => {
    const { theme } = useTheme();

    return (
        <header style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            padding: "1.5rem 5%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            zIndex: 10,
            background: "transparent"
        }}>

            <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", marginTop: "-1rem" }}>
                <img src={Logo} alt="HospitoFind" style={{ height: "65px", width: "65px" }} />
            </Link>

            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                <Link
                    to="/"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        fontSize: "1rem",
                        fontWeight: 500,
                        color: theme === 'dark' ? '#cbd5e1' : '#64748b',
                        textDecoration: "none",
                        transition: "color 0.2s",
                        marginBottom: "1rem"
                    }}
                >
                    <FiArrowLeft /> Back to Home
                </Link>
                <ThemeToggle />
            </div>
        </header>
    );
};

export default SimpleHeader;