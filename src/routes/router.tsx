import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import AuthProvider from "@/context/Auth0Provider";
import { Fallback } from "@/components/ui/Fallback";
import RootLayout from "@/layouts/RootLayout";
import MainLayout from "@/layouts/mainLayout";
import PersistLogin from "@/components/auth/persistLogin";
import RequireAuth from "@/components/auth/requireAuth";
import { ComponentPulse } from "@/components/ui/LoadingPulse";

const Home = lazy(() => import("@/pages/home/home"));
const About = lazy(() => import("@/pages/about/about"));
const FindHospital = lazy(() => import("@/pages/find/find"));
const LogIn = lazy(() => import("@/components/auth/LoginForm"));
const SignUp = lazy(() => import("@/components/auth/SignupForm"));
const Callback = lazy(() => import("@/pages/auth0/AuthCallback"));
const Dashboard = lazy(() => import("@/pages/profile/dashboard"));
const GlobalDirectory = lazy(() => import("@/pages/directory/globalDirectory"));
const RegionalDirectory = lazy(() => import("@/pages/directory/countryRegistry"));
const ShareHospitalList = lazy(() => import("@/components/hospital/ShareHospitalList"));
const HospitalDetails = lazy(() => import("@/components/hospital/hospitalDetails"));
const NewsData = lazy(() => import("@/pages/health/NewsData"));
const Outbreaks = lazy(() => import("@/pages/health/Outbreaks"));
const HealthTips = lazy(() => import("@/pages/health/HealthTips"));
const Policy = lazy(() => import("@/pages/legal/policy"));
const Terms = lazy(() => import("@/pages/legal/terms"));
const FAQPage = lazy(() => import("@/pages/legal/faq"));
const Error404 = lazy(() => import("@/pages/NotFound/Error404"));
const AdminDashboard = lazy(() => import("@/pages/admin/adminDashboard"));
const AdminPendingList = lazy(() => import("@/pages/admin/adminPendingList"));
const UserManagement = lazy(() => import("@/pages/admin/userManagement"));
const HospitalManagement = lazy(() => import("@/pages/admin/hospitalManagement"));
const Unauthorized = lazy(() => import("@/pages/admin/unauthorized"));
const VerifyEmail = lazy(() => import("@/pages/profile/verifyEmail"));
const EmailSent = lazy(() => import("@/pages/profile/emailSent"));
const ForgotPassword = lazy(() => import("@/components/user/ForgotPassword"));
const ResetPassword = lazy(() => import("@/components/user/ResetPassword"));

// Wrapper
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
            // PUBLIC ROUTES
            {
                element: <MainLayout />,
                children: [
                    { index: true, element: Loadable(Home)({}) },
                    { path: "about", element: Loadable(About)({}) },
                    { path: "health-news", element: Loadable(NewsData)({}) },
                    { path: "health-tips", element: Loadable(HealthTips)({}) },
                    { path: "disease-outbreaks", element: Loadable(Outbreaks)({}) },
                    { path: "policy", element: Loadable(Policy)({}) },
                    { path: "terms", element: Loadable(Terms)({}) },
                    { path: "faq", element: Loadable(FAQPage)({}) },
                    { path: "directory", element: Loadable(GlobalDirectory)({}) },
                    { path: "directory/:country", element: Loadable(RegionalDirectory)({}) },
                    { path: "hospital/:id", element: Loadable(HospitalDetails)({}) },
                    { path: "hospital/:country/:city/:slug", element: Loadable(HospitalDetails)({}) },
                    { path: "hospitals/share/:linkId", element: Loadable(ShareHospitalList)({}) },
                    { path: "hospitals/share/:linkId/:name", element: Loadable(HospitalDetails)({}) },
                    { path: "unauthorized", element: Loadable(Unauthorized)({}) },
                    {
                        path: "find-hospital",
                        children: [
                            { index: true, element: Loadable(FindHospital)({}) },
                            { path: ":country/:city/:slug", element: Loadable(HospitalDetails)({}) },
                            { path: ":name", element: Loadable(HospitalDetails)({}) },
                        ],
                    },
                ]
            },

            // AUTH PAGES
            { path: "login", element: Loadable(LogIn)({}) },
            { path: "signup", element: Loadable(SignUp)({}) },
            { path: "verify-email", element: Loadable(VerifyEmail)({}) },
            { path: "email-sent", element: <EmailSent /> },
            { path: "callback", element: Loadable(Callback)({}) },
            { path: "forgot-password", element: Loadable(ForgotPassword)({}) },
            { path: "reset-password/:resetToken", element: Loadable(ResetPassword)({}) },

            //  PROTECTED ROUTES
            {
                element: <PersistLogin />,
                children: [
                    {
                        children: [
                            {
                                element: <RequireAuth allowedRoles={["user", "admin"]} />,
                                children: [
                                    {
                                        path: "dashboard",
                                        children: [
                                            { index: true, element: Loadable(Dashboard)({}) },
                                            { path: ":name", element: Loadable(HospitalDetails)({}) },
                                        ],
                                    },
                                ],
                            }
                        ]
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

            {
                element: <MainLayout />,
                children: [
                    { path: "*", element: Loadable(Error404)({}) },
                ]
            }
        ],
    },
]);