import { lazy, Suspense, ComponentType } from 'react'
import { ComponentPulse } from '@/components/ui/LoadingPulse'

const Home = lazy(() => import('@/pages/home/home'))
const About = lazy(() => import('@/pages/about/about'))
const FindHospital = lazy(() => import('@/pages/find/find'))
const LogIn = lazy(() => import('@/components/auth/LoginForm'))
const SignUp = lazy(() => import('@/components/auth/SignupForm'))
const Callback = lazy(() => import('@/pages/auth0/AuthCallback'))
const Dashboard = lazy(() => import('@/pages/profile/dashboard'))
const GlobalDirectory = lazy(() => import('@/pages/directory/globalDirectory'))
const RegionalDirectory = lazy(
  () => import('@/pages/directory/countryRegistry')
)
const ShareHospitalList = lazy(
  () => import('@/components/hospital/ShareHospitalList')
)
const HospitalDetails = lazy(
  () => import('@/components/hospital/hospitalDetails')
)
const NewsData = lazy(() => import('@/pages/health/NewsData'))
const Outbreaks = lazy(() => import('@/pages/health/Outbreaks'))
const HealthTips = lazy(() => import('@/pages/health/HealthTips'))
const Policy = lazy(() => import('@/pages/legal/policy'))
const Terms = lazy(() => import('@/pages/legal/terms'))
const FAQPage = lazy(() => import('@/pages/legal/faq'))
const Error404 = lazy(() => import('@/pages/NotFound/Error404'))
const AdminDashboard = lazy(() => import('@/pages/admin/adminDashboard'))
const AdminPendingList = lazy(() => import('@/pages/admin/adminPendingList'))
const UserManagement = lazy(() => import('@/pages/admin/userManagement'))
const HospitalManagement = lazy(
  () => import('@/pages/admin/hospitalManagement')
)
const SymptomMappings = lazy(() => import('@/pages/admin/SymptomMappings'))
const Unauthorized = lazy(() => import('@/pages/admin/unauthorized'))
const VerifyEmail = lazy(() => import('@/pages/profile/verifyEmail'))
const EmailSent = lazy(() => import('@/pages/profile/emailSent'))
const ForgotPassword = lazy(() => import('@/components/user/ForgotPassword'))
const ResetPassword = lazy(() => import('@/components/user/ResetPassword'))

export const Loadable =
  (Component: ComponentType) => (props: Record<string, unknown>) => (
    <Suspense fallback={<ComponentPulse />}>
      <Component {...props} />
    </Suspense>
  )

export {
  Home,
  About,
  FindHospital,
  LogIn,
  SignUp,
  Callback,
  Dashboard,
  GlobalDirectory,
  RegionalDirectory,
  ShareHospitalList,
  HospitalDetails,
  NewsData,
  Outbreaks,
  HealthTips,
  Policy,
  Terms,
  FAQPage,
  Error404,
  AdminDashboard,
  AdminPendingList,
  UserManagement,
  HospitalManagement,
  SymptomMappings,
  Unauthorized,
  VerifyEmail,
  EmailSent,
  ForgotPassword,
  ResetPassword,
}
