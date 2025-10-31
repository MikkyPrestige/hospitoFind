import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import AuthProvider from "@/config/auth0";
import { Fallback } from "@/components/fallback";
import RootLayout from "@/layouts/RootLayout";
import { useAuthContext } from "@/context/userContext";

const Home = lazy(() => import("@/pages/home/home"));
const About = lazy(() => import("@/pages/about/about"));
const FindHospital = lazy(() => import("@/pages/find/find"));
const LogIn = lazy(() => import("@/userConfig/loginForm"));
const SignUp = lazy(() => import("@/userConfig/signupForm"));
const Callback = lazy(() => import("@/userConfig/authCallback"));
const Dashboard = lazy(() => import("@/pages/profile/dashboard"));
const HospitalInfo = lazy(() => import("@/hospitalsConfig/info"));
const ShareHospitalList = lazy(() => import("@/hospitalsConfig/shareHospitalList"));
const HospitalDetails = lazy(() => import("@/components/hospitalDetails"));
const Policy = lazy(() => import("@/pages/policy"));
const News = lazy(() => import("@/health/newsData"));
const Error404 = lazy(() => import("@/components/error404"));

// dashboard logic
const DashboardWithAuth = () => {
    const { state } = useAuthContext();
    return state.username ? <Dashboard /> : <SignUp />;
};

//  router configuration
export const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <AuthProvider>
                <RootLayout />
            </AuthProvider>
        ),
        errorElement: <Fallback />,
        children: [
            { index: true, element: <Home />, errorElement: <Fallback /> },
            { path: "about", element: <About />, errorElement: <Fallback /> },
            {
                path: "find",
                children: [
                    { index: true, element: <FindHospital />, errorElement: <Fallback /> },
                    { path: ":name", element: <HospitalInfo />, errorElement: <Fallback /> },
                ],
            },
            { path: "login", element: <LogIn />, errorElement: <Fallback /> },
            { path: "signup", element: <SignUp />, errorElement: <Fallback /> },
            {
                path: "dashboard",
                children: [
                    { index: true, element: <DashboardWithAuth />, errorElement: <Fallback /> },
                    { path: ":name", element: <HospitalInfo />, errorElement: <Fallback /> },
                ],
            },
            { path: "hospital/:id", element: <HospitalDetails />, errorElement: <Fallback /> },
            { path: "callback", element: <Callback />, errorElement: <Fallback /> },
            { path: "hospitals/share/:linkId", element: <ShareHospitalList />, errorElement: <Fallback /> },
            { path: "hospitals/share/:linkId/:name", element: <HospitalInfo />, errorElement: <Fallback /> },
            { path: "policy", element: <Policy />, errorElement: <Fallback /> },
            { path: "news", element: <News />, errorElement: <Fallback /> },
            { path: "*", element: <Error404 />, errorElement: <Fallback /> },
        ],
    },
]);
