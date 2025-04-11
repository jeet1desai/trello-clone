import React from 'react';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import Layout from '../layout';

// Import your pages
const Home = React.lazy(() => import('../pages/home'));
const Login = React.lazy(() => import('../pages/auth/login'));
const Register = React.lazy(() => import('../pages/auth/register'));
const Dashboard = React.lazy(() => import('../pages/dashboard'));
const NotFound = React.lazy(() => import('../pages/notFound'));
const Boards = React.lazy(() => import('../pages/boards'));
const BoardDetail = React.lazy(() => import('../pages/boards/board'));
const Workspaces = React.lazy(() => import('../pages/workspaces'));
const WorkspaceDetail = React.lazy(() => import('../pages/workspaces/workspace'));
const ForgotPassword = React.lazy(() => import('../pages/auth/forgotPassword'));
const VerifyEmail = React.lazy(() => import('../pages/auth/verifyEmail'));
const ProfilePage = React.lazy(() => import('../pages/profile'));

interface RouteProps {
  element: React.ReactNode;
}

// PrivateRoute component - redirects to login if not authenticated
const PrivateRoute: React.FC<RouteProps> = ({ element }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  return <>{isAuthenticated ? element : <Navigate to="/login" replace />}</>;
};

// Public routes - accessible whether logged in or not
const PublicRoute: React.FC<RouteProps> = ({ element }) => {
  return <>{element}</>;
};

// Auth routes - redirect to dashboard if already logged in
const AuthRoute: React.FC<RouteProps> = ({ element }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  return <>{!isAuthenticated ? element : <Navigate to="/dashboard" replace />}</>;
};

// Create router
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <PublicRoute element={<Home />} />,
      },
      {
        path: 'login',
        element: <AuthRoute element={<Login />} />,
      },
      {
        path: 'register',
        element: <AuthRoute element={<Register />} />,
      },
      {
        path: 'forgot-password',
        element: <AuthRoute element={<ForgotPassword />} />,
      },
      {
        path: 'verify-email',
        element: <PublicRoute element={<VerifyEmail />} />,
      },
      {
        path: 'dashboard',
        element: <PrivateRoute element={<Dashboard />} />,
      },
      {
        path: 'boards',
        element: <PrivateRoute element={<Boards />} />,
      },
      {
        path: 'board/:id',
        element: <PrivateRoute element={<BoardDetail />} />,
      },
      {
        path: 'workspaces',
        element: <PrivateRoute element={<Workspaces />} />,
      },
      {
        path: 'workspace/:id',
        element: <PrivateRoute element={<WorkspaceDetail />} />,
      },
      {
        path: 'profile',
        element: <PrivateRoute element={<ProfilePage />} />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

export default router; 