import { Route, Routes } from "react-router-dom";
import { lazy } from "react";
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
const HospitalDetails = lazy(() => import("@/components/hospitalDetails"))
const Policy = lazy(() => import("@/pages/policy"))
const Error404 = lazy(() => import("@/components/error404"));
const News = lazy(() => import("@/health/newsData"))

export const AppRoutes = () => {
  const { state } = useAuthContext();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/find">
        <Route index element={<FindHospital />} />
        <Route path=":name" element={<HospitalInfo />} />
      </Route>
      <Route path="/login" element={<LogIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/dashboard">
        <Route index element={state.username ? <Dashboard /> : <SignUp />} />
        <Route path=":name" element={<HospitalInfo />} />
      </Route>
      <Route path="/hospital/:id" element={<HospitalDetails />} />
      <Route path="/callback" element={<Callback />} />
      <Route>
        <Route path="/hospitals/share/:linkId" element={<ShareHospitalList />} />
        <Route path="/hospitals/share/:linkId/:name" element={<HospitalInfo />} />
      </Route>
      <Route path="/policy" element={<Policy />} />
      <Route path="/news" element={<News />} />
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
}