import { Route, Routes } from "react-router-dom";
import { lazy } from "react";

const Home = lazy(() => import("@/pages/home/home"));
const About = lazy(() => import("@/pages/about/about"));
const LogIn = lazy(() => import("@/forms/login/logInForm"));
const SignUp = lazy(() => import("@/forms/signUp/signUpForm"));
const Dashboard = lazy(() => import("@/pages/profile/dashboard"));
const HospitalInfo = lazy(() => import("@/components/hospitalsConfig/info"));
// const Profile = lazy(() => import("@/hooks/profile"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
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