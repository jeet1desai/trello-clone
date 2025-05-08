import React from "react";
import { Navigate, createBrowserRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import Layout from "../layout";
import { PRIVATE_ROUTE, PUBLIC_ROUTE } from "../utils/enums/route";

// Import your pages
const Home = React.lazy(() => import("../pages/home"));
const Login = React.lazy(() => import("../pages/auth/login"));
const Register = React.lazy(() => import("../pages/auth/register"));
const Dashboard = React.lazy(() => import("../pages/dashboard"));
const NotFound = React.lazy(() => import("../pages/notFound"));
const Boards = React.lazy(() => import("../pages/boards"));
const BoardDetail = React.lazy(() => import("../pages/boards/board"));
const Workspaces = React.lazy(() => import("../pages/workspaces"));
const WorkspaceDetail = React.lazy(
  () => import("../pages/workspaces/workspace")
);
const ForgotPassword = React.lazy(() => import("../pages/auth/forgotPassword"));
const VerifyEmail = React.lazy(() => import("../pages/auth/verifyEmail"));
const ProfilePage = React.lazy(() => import("../pages/profile"));
const InviteMember = React.lazy(() => import("../pages/boards/invite-member"));
const PrivacyPolicy = React.lazy(() => import("../pages/policy/privacy"));
const TermPolicy = React.lazy(() => import("../pages/policy/terms"));
const ContactUs = React.lazy(() => import("../pages/contactUs"));
const Invitations = React.lazy(() => import("../pages/invitations"));

interface RouteProps {
  element: React.ReactNode;
}

// PrivateRoute component - redirects to login if not authenticated
const PrivateRoute: React.FC<RouteProps> = ({ element }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  return (
    <>
      {isAuthenticated ? element : <Navigate to={PUBLIC_ROUTE.LOGIN} replace />}
    </>
  );
};

// Public routes - accessible whether logged in or not
const PublicRoute: React.FC<RouteProps> = ({ element }) => {
  return <>{element}</>;
};

// Auth routes - redirect to dashboard if already logged in
const AuthRoute: React.FC<RouteProps> = ({ element }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  return (
    <>
      {!isAuthenticated ? (
        element
      ) : (
        <Navigate to={PRIVATE_ROUTE.DASHBOARD} replace />
      )}
    </>
  );
};

// Create router
const router = createBrowserRouter([
  {
    path: PUBLIC_ROUTE.HOME,
    element: <Layout />,
    children: [
      {
        index: true,
        element: <PublicRoute element={<Home />} />,
      },
      {
        path: PUBLIC_ROUTE.PRIVACY_POLICY,
        element: <PublicRoute element={<PrivacyPolicy />} />,
      },
      {
        path: PUBLIC_ROUTE.TERM_POLICY,
        element: <PublicRoute element={<TermPolicy />} />,
      },
      {
        path: PUBLIC_ROUTE.CONTACT_US,
        element: <PublicRoute element={<ContactUs />} />,
      },
      {
        path: PUBLIC_ROUTE.LOGIN,
        element: <AuthRoute element={<Login />} />,
      },
      {
        path: PUBLIC_ROUTE.REGISTRATION,
        element: <AuthRoute element={<Register />} />,
      },
      {
        path: PUBLIC_ROUTE.FORGOT_PASSWORD,
        element: <AuthRoute element={<ForgotPassword />} />,
      },
      {
        path: PUBLIC_ROUTE.VERIFY_USER_EMAIL,
        element: <PublicRoute element={<VerifyEmail />} />,
      },
      {
        path: PRIVATE_ROUTE.DASHBOARD,
        element: <PrivateRoute element={<Dashboard />} />,
      },
      {
        path: PRIVATE_ROUTE.BOARDS,
        element: <PrivateRoute element={<Boards />} />,
      },
      {
        path: PRIVATE_ROUTE.BOARD,
        element: <PrivateRoute element={<BoardDetail />} />,
      },
      {
        path: PRIVATE_ROUTE.WORKSPACES,
        element: <PrivateRoute element={<Workspaces />} />,
      },
      {
        path: PRIVATE_ROUTE.WORKSPACE,
        element: <PrivateRoute element={<WorkspaceDetail />} />,
      },
      {
        path: PRIVATE_ROUTE.USER_PROFILE,
        element: <PrivateRoute element={<ProfilePage />} />,
      },
      {
        path: PRIVATE_ROUTE.INVITATION,
        element: <PrivateRoute element={<InviteMember />} />,
      },
      {
        path: PRIVATE_ROUTE.INVITATIONS,
        element: <PrivateRoute element={<Invitations />} />,
      },
      {
        path: PUBLIC_ROUTE.NOT_FOUND,
        element: <NotFound />,
      },
    ],
  },
]);

export default router;
