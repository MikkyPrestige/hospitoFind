import { Outlet } from "react-router-dom";
import Header from "./header/nav";
import Footer from "./footer/footer";

const MainLayout = () => {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    );
};
export default MainLayout;