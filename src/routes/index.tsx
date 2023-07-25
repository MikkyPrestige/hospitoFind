import { Route, Routes } from "react-router-dom";
import { lazy } from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Home = lazy(() => import("@/pages/home/home"));
const About = lazy(() => import("@/pages/about/about"));
const FindHospital = lazy(() => import("@/pages/find/find"));
const Callback = lazy(() => import("@/config/callback"));
const Dashboard = lazy(() => import("@/pages/profile/dashboard"));
const HospitalInfo = lazy(() => import("@/hospitalsConfig/info"));
const ShareHospitalList = lazy(() => import("@/hospitalsConfig/shareHospitalList"));
const Error404 = lazy(() => import("@/components/error404"));

export const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/find">
        <Route index element={<FindHospital />} />
        <Route path=":name" element={<HospitalInfo />} />
      </Route>
      <Route path="/dashboard">
        {!isLoading && <Route index element={isAuthenticated ? <Dashboard /> : <Callback />} />}
        <Route path=":name" element={<HospitalInfo />} />
      </Route>
      <Route path="/callback" element={<Callback />} />
      <Route>
        <Route path="/hospitals/share/:linkId" element={<ShareHospitalList />} />
        <Route path="/hospitals/share/:linkId/:name" element={<HospitalInfo />} />
      </Route>
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
}