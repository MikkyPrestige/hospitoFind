import { Link, useLocation } from "react-router-dom";

const AdminBreadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter((x) => x);

    if (pathnames.length <= 1) return null;

    return (
        <nav aria-label="breadcrumb" style={{ padding: "1rem 0", marginBottom: "1rem" }}>
            <ol style={{
                display: "flex",
                listStyle: "none",
                margin: 0,
                padding: 0,
                gap: "10px",
                fontSize: "0.85rem",
                alignItems: "center"
            }}>
                <li>
                    <Link to="/admin" style={{ color: "#0e3db7", textDecoration: "none", fontWeight: 500, fontSize: "1.5rem" }}>
                        Admin
                    </Link>
                </li>

                {pathnames.map((value, index) => {
                    if (value.toLowerCase() === "admin") return null;

                    const last = index === pathnames.length - 1;
                    const to = `/${pathnames.slice(0, index + 1).join("/")}`;

                    const isId = /^[0-9a-fA-F]{24}$/.test(value);
                    let displayName = value.charAt(0).toUpperCase() + value.slice(1).replace("-", " ");

                    if (isId) displayName = "Details";

                    return (
                        <li key={to} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span style={{ color: "#ccc", fontSize: "1.5rem", fontWeight: 800, }}>/</span>
                            {last ? (
                                <span style={{ color: "#666", fontWeight: 600, fontSize: "1.5rem" }}>{displayName}</span>
                            ) : (
                                <Link to={to} style={{ color: "#0e3db7", textDecoration: "none" }}>
                                    {displayName}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default AdminBreadcrumbs;