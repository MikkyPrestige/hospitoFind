import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "@/components/ui/ThemeToggle"
import style from "./styles/adminBreadcrumbs.module.css";

const AdminBreadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter((x) => x);

    if (pathnames.length <= 1) return null;

    return (
        <nav aria-label="breadcrumb" className={style.nav}>
            <ol className={style.list}>
                <li>
                    <Link to="/admin" className={`${style.link} ${style.adminRoot}`}>
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
                        <li key={to} className={style.listItem}>
                            <span className={style.separator}>/</span>
                            {last ? (
                                <span className={style.currentPath}>{displayName}</span>
                            ) : (
                                 <Link to={to} className={style.link}>
                                    {displayName}
                                </Link>
                            )}
                        </li>
                    );
                })}
                <ThemeToggle />
            </ol>
        </nav>
    );
};

export default AdminBreadcrumbs;