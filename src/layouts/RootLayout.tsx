import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import Loading from "@/assets/images/loading.gif";

export default function RootLayout() {
    return (
        <Suspense
            fallback={
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                }}>
                    <img src={Loading} alt="Loading..." />
                </div>
            }
        >
            <Outlet />
        </Suspense>
    );
}
