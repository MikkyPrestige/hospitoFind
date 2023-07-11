import { Route, Routes } from "react-router-dom";
import { lazy } from "react";
import { useAuthContext } from "@/contexts/userContext";

const Home = lazy(() => import("@/pages/home/home"));
const About = lazy(() => import("@/pages/about/about"));
const FindHospital = lazy(() => import("@/pages/find/find"));
const LogIn = lazy(() => import("@/userConfig/login/logInForm"));
const SignUp = lazy(() => import("@/userConfig/signUp/signUpForm"));
const Dashboard = lazy(() => import("@/pages/profile/dashboard"));
const HospitalInfo = lazy(() => import("@/hospitalsConfig/info"));
const ShareHospitalList = lazy(() => import("@/hospitalsConfig/shareHospitalList"));
const Error404 = lazy(() => import("@/components/error404"));
// const Profile = lazy(() => import("@/hooks/profile"));

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
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/dashboard">
        <Route index element={state.username ? <Dashboard /> : <SignUp />} />
        <Route path=":name" element={<HospitalInfo />} />
      </Route>
      <Route>
        <Route path="/hospitals/share/:linkId" element={<ShareHospitalList />} />
        <Route path="/hospitals/share/:linkId/:name" element={<HospitalInfo />} />
      </Route>

      <Route path="*" element={<Error404 />} />
      {/* <Route path="/profile/:username" element={<Profile />} /> */}
    </Routes>
  );
}