import { Route, Routes } from "react-router-dom";
import { lazy } from "react";

const Home = lazy(() => import("@/pages/home/home"));
const LogIn = lazy(() => import("@/forms/login/logInForm"));
const SignUp = lazy(() => import("@/forms/signUp/signUpForm"));

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LogIn />} />
      <Route path="/signUp" element={<SignUp />} />
    </Routes>
  );
}