import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import AuthProvider from "@/config/auth0";
import { Fallback } from "@/components/fallback";
import RootLayout from "@/layouts/RootLayout";
import PersistLogin from "@/components/auth/persistLogin";
import RequireAuth from "@/components/auth/requireAuth";
import { ComponentPulse } from "../components/utils/loadingPulse";

// Lazy imports
const Home = lazy(() => import("@/pages/home/home"));
const About = lazy(() => import("@/pages/about/about"));
const FindHospital = lazy(() => import("@/pages/find/find"));
const LogIn = lazy(() => import("@/userConfig/loginForm"));
const SignUp = lazy(() => import("@/userConfig/signupForm"));
const Callback = lazy(() => import("@/config/authCallback"));
const Dashboard = lazy(() => import("@/pages/profile/dashboard"));
const HospitalInfo = lazy(() => import("@/hospitalsConfig/info"));
const Directory = lazy(() => import("@/pages/explore/explorePage"));
const CountryDetailPage = lazy(() => import("@/pages/explore/countryDetails"));
const ShareHospitalList = lazy(() => import("@/hospitalsConfig/shareHospitalList"));
const HospitalDetails = lazy(() => import("@/components/hospitalDetails"));
const NewsData = lazy(() => import("@/health/page/newsData"));
const Outbreaks = lazy(() => import("@/health/page/outbreaks"));
const HealthTips = lazy(() => import("@/health/page/healthTips"));
const Policy = lazy(() => import("@/pages/legal/policy"));
const Terms = lazy(() => import("@/pages/legal/terms"));
const FAQPage = lazy(() => import("@/pages/legal/faq"));
const Error404 = lazy(() => import("@/components/error404"));
const AdminDashboard = lazy(() => import("@/pages/admin/adminDashboard"));
const AdminPendingList = lazy(() => import("@/pages/admin/adminPendingList"));
const UserManagement = lazy(() => import("@/pages/admin/userManagement"));
const HospitalManagement = lazy(() => import("@/pages/admin/hospitalManagement"));
const Unauthorized = lazy(() => import("@/pages/admin/unauthorized"));
const VerifyEmail = lazy(() => import("@/pages/profile/verifyEmail"));
const EmailSent = lazy(() => import("@/pages/profile/emailSent"));

// elper to wrap lazy components in Suspense automatically
const Loadable = (Component: any) => (props: any) => (
    <Suspense fallback={<ComponentPulse />}>
        <Component {...props} />
    </Suspense>
);

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
            // --- PUBLIC ROUTES ---
            { index: true, element: Loadable(Home)({}) },
            { path: "about", element: Loadable(About)({}) },
            { path: "login", element: Loadable(LogIn)({}) },
            { path: "signup", element: Loadable(SignUp)({}) },
            { path: "verify-email", element: Loadable(VerifyEmail)({}) },
            { path: "email-sent", element: <EmailSent /> },
            { path: "callback", element: Loadable(Callback)({}) },
            { path: "directory", element: Loadable(Directory)({}) },
            { path: "country/:country", element: Loadable(CountryDetailPage)({}) },
            { path: "health-news", element: Loadable(NewsData)({}) },
            { path: "health-tips", element: Loadable(HealthTips)({}) },
            { path: "disease-outbreaks", element: Loadable(Outbreaks)({}) },
            { path: "policy", element: Loadable(Policy)({}) },
            { path: "terms", element: Loadable(Terms)({}) },
            { path: "faq", element: Loadable(FAQPage)({}) },
            { path: "unauthorized", element: Loadable(Unauthorized)({}) },
            { path: "hospital/:id", element: Loadable(HospitalDetails)({}) },
            { path: "hospital/:country/:city/:slug", element: Loadable(HospitalDetails)({}) },
            { path: "hospitals/share/:linkId", element: Loadable(ShareHospitalList)({}) },
            { path: "hospitals/share/:linkId/:name", element: Loadable(HospitalInfo)({}) },
            {
                path: "find-hospital",
                children: [
                    { index: true, element: Loadable(FindHospital)({}) },
                    { path: ":name", element: Loadable(HospitalInfo)({}) },
                ],
            },

            // --- PROTECTED LAYERS ---
            {
                element: <PersistLogin />,
                children: [
                    {
                        element: <RequireAuth allowedRoles={["user", "admin"]} />,
                        children: [
                            {
                                path: "dashboard",
                                children: [
                                    { index: true, element: Loadable(Dashboard)({}) },
                                    { path: ":name", element: Loadable(HospitalInfo)({}) },
                                ],
                            },
                        ],
                    },
                    {
                        element: <RequireAuth allowedRoles={["admin"]} />,
                        children: [
                            { path: "admin", element: Loadable(AdminDashboard)({}) },
                            { path: "admin/pending", element: Loadable(AdminPendingList)({}) },
                            { path: "admin/users", element: Loadable(UserManagement)({}) },
                            { path: "admin/hospitals", element: Loadable(HospitalManagement)({}) },
                        ],
                    },
                ],
            },

            { path: "*", element: Loadable(Error404)({}) },
        ],
    },
]);