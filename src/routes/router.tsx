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
const ExplorePage = lazy(() => import("@/pages/explore/explorePage"));
const CountryDetailPage = lazy(() => import("@/pages/explore/countryDetails"));
const ShareHospitalList = lazy(() => import("@/hospitalsConfig/shareHospitalList"));
const HospitalDetails = lazy(() => import("@/components/hospitalDetails"));
const NewsData = lazy(() => import("@/health/page/newsData"));
const Outbreaks = lazy(() => import("@/health/page/outbreaks"));
const HealthTips = lazy(() => import("@/health/page/healthTips"));
const Policy = lazy(() => import("@/pages/policy"));
const FAQPage = lazy(() => import("@/pages/faq/FAQPage"));
const Error404 = lazy(() => import("@/components/error404"));

// dashboard logic
const DashboardWithAuth = () => {
    const { state } = useAuthContext();
    return state.username ? <Dashboard /> : <SignUp />;
};

export const router = createBrowserRouter([
    // Auth0 callback route
    {
        path: "/callback",
        element: (
            <AuthProvider>
                <Callback />
            </AuthProvider>
        ),
        errorElement: <Fallback />,
    },

    // Main application routes
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
                path: "find-hospital",
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

            { path: "hospital/:country/:city/:slug", element: <HospitalDetails /> },
            { path: "hospital/:id", element: <HospitalDetails /> },
            { path: "hospitals/share/:linkId", element: <ShareHospitalList /> },
            { path: "hospitals/share/:linkId/:name", element: <HospitalInfo /> },
            { path: "country", element: <ExplorePage /> },
            { path: "country/:country", element: <CountryDetailPage /> },
            { path: "news", element: <NewsData />, errorElement: <Fallback / > },
            { path: "health-tips", element: <HealthTips />, errorElement: <Fallback / > },
            { path: "outbreaks", element: <Outbreaks />, errorElement: <Fallback /> },
            { path: "policy", element: <Policy />, errorElement: <Fallback /> },
            { path: "faq", element: <FAQPage />, errorElement: <Fallback /> },
            { path: "*", element: <Error404 />, errorElement: <Fallback /> },
        ],
    },
]);
