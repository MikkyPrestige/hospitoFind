import { createBrowserRouter } from 'react-router-dom'
import AuthProvider from '@/context/Auth0Provider'
import { Fallback } from '@/components/ui/Fallback'
import RootLayout from '@/layouts/RootLayout'
import MainLayout from '@/layouts/mainLayout'
import PersistLogin from '@/components/auth/persistLogin'
import RequireAuth from '@/components/auth/requireAuth'
import GuestRoute from '@/components/auth/GuestRoute'
import {
  Loadable,
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
} from './lazyComponents'

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <RootLayout />
      </AuthProvider>
    ),
    errorElement: <Fallback />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { index: true, element: Loadable(Home)({}) },
          { path: 'about', element: Loadable(About)({}) },
          { path: 'health-news', element: Loadable(NewsData)({}) },
          { path: 'health-tips', element: Loadable(HealthTips)({}) },
          { path: 'disease-outbreaks', element: Loadable(Outbreaks)({}) },
          { path: 'policy', element: Loadable(Policy)({}) },
          { path: 'terms', element: Loadable(Terms)({}) },
          { path: 'faq', element: Loadable(FAQPage)({}) },
          { path: 'directory', element: Loadable(GlobalDirectory)({}) },
          {
            path: 'directory/:country',
            element: Loadable(RegionalDirectory)({}),
          },
          { path: 'hospital/:id', element: Loadable(HospitalDetails)({}) },
          {
            path: 'hospital/:country/:city/:slug',
            element: Loadable(HospitalDetails)({}),
          },
          {
            path: 'hospitals/share/:linkId',
            element: Loadable(ShareHospitalList)({}),
          },
          {
            path: 'hospitals/share/:linkId/:name',
            element: Loadable(HospitalDetails)({}),
          },
          { path: 'unauthorized', element: Loadable(Unauthorized)({}) },
          {
            path: 'find-hospital',
            children: [
              { index: true, element: Loadable(FindHospital)({}) },
              {
                path: ':country/:city/:slug',
                element: Loadable(HospitalDetails)({}),
              },
              { path: ':name', element: Loadable(HospitalDetails)({}) },
            ],
          },
        ],
      },
      {
        element: <GuestRoute />,
        children: [
          { path: 'login', element: Loadable(LogIn)({}) },
          { path: 'signup', element: Loadable(SignUp)({}) },
        ],
      },
      { path: 'verify-email', element: Loadable(VerifyEmail)({}) },
      { path: 'email-sent', element: <EmailSent /> },
      { path: 'callback', element: Loadable(Callback)({}) },
      { path: 'forgot-password', element: Loadable(ForgotPassword)({}) },
      {
        path: 'reset-password/:resetToken',
        element: Loadable(ResetPassword)({}),
      },
      {
        element: <PersistLogin />,
        children: [
          {
            children: [
              {
                element: <RequireAuth allowedRoles={['user', 'admin']} />,
                children: [
                  {
                    path: 'dashboard',
                    children: [
                      { index: true, element: Loadable(Dashboard)({}) },
                      { path: ':name', element: Loadable(HospitalDetails)({}) },
                    ],
                  },
                ],
              },
            ],
          },
          {
            element: <RequireAuth allowedRoles={['admin']} />,
            children: [
              { path: 'admin', element: Loadable(AdminDashboard)({}) },
              {
                path: 'admin/pending',
                element: Loadable(AdminPendingList)({}),
              },
              { path: 'admin/users', element: Loadable(UserManagement)({}) },
              {
                path: 'admin/hospitals',
                element: Loadable(HospitalManagement)({}),
              },
              {
                path: 'admin/symptoms',
                element: Loadable(SymptomMappings)({}),
              },
            ],
          },
        ],
      },
      {
        element: <MainLayout />,
        children: [{ path: '*', element: Loadable(Error404)({}) }],
      },
    ],
  },
])
