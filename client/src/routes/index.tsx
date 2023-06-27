import { Route, Routes } from "react-router-dom";
import { lazy } from "react";

const Home = lazy(() => import("@/pages/home/home"));
const About = lazy(() => import("@/pages/about/about"));
const FindHospital = lazy(() => import("@/pages/find/find"));
const LogIn = lazy(() => import("@/userConfig/login/logInForm"));
const SignUp = lazy(() => import("@/userConfig/signUp/signUpForm"));
const Dashboard = lazy(() => import("@/pages/profile/dashboard"));
const HospitalInfo = lazy(() => import("@/hospitalsConfig/info"));
// const Profile = lazy(() => import("@/hooks/profile"));

export const AppRoutes = () => {
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
        <Route index element={<Dashboard />} />
        <Route path=":name" element={<HospitalInfo />} />
      </Route>
      {/* <Route path="/profile/:username" element={<Profile />} /> */}
    </Routes>
  );
}