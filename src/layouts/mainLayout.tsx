import { Outlet, useLocation } from "react-router-dom";
import Header from "./header/Header";
import Footer from "./footer/Footer";
import AgentWidget from "@/components/agent/AgentWidget";

const MainLayout = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
            {!isHomePage && <AgentWidget />}
        </>
    );
};

export default MainLayout;