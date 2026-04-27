import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";

import Layout from "./Layout";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/Homepage";
import ProfilePage from "./pages/ProfilePage";
import DashboardPage from "./pages/DashboardPage";
import ResourcePage from "./pages/ResourcePage";
import InterviewForm from "./pages/InterviewFormPage";
import ResumeAnalysisPage from "./pages/ResumeAnalysisPage";
import InterviewPage from "./pages/InterviewPage";
import LandingPageV2 from "./pages/LandingPageV2";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import PortalPage from "./pages/PortalPage";
import CodeEditorWindow from "./components/CodeEditor/CodeEditorWindow";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AIAgentDownModal } from "./components/AIAgentDownModal";

import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminInterviews from "./pages/admin/AdminInterviews";
import AdminResources from "./pages/admin/AdminResources";

// Redirect logged-in users from public pages
function PublicRoute({ children }) {
  const { authUser } = useAuthStore();
  // console.log({ authUser });
  return authUser ? <Navigate to="/dashboard" replace /> : children;
}

// Protect routes that require authentication
function PrivateRoute({ children }) {
  const { authUser } = useAuthStore();
  return authUser ? children : <Navigate to="/get-started" replace />;
}

// Protect routes that require Super Admin role
function SuperAdminRoute({ children }) {
  const { authUser } = useAuthStore();
  return authUser?.role === "SUPERADMIN" ? (
    children
  ) : (
    <Navigate to="/dashboard" replace />
  );
}


function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  //console.log({ authUser });

  const router = createBrowserRouter([
    {
      path: "/get-started",
      element: (
        <PublicRoute>
          <LoginPage />
        </PublicRoute>
      ),
    },
    {
      path: "/",
      element: authUser ? <Layout /> : <LandingPageV2 />,
      children: [
        { index: true, element: authUser ? <DashboardPage /> : <LandingPageV2 /> },
        { path: "dashboard", element: <PrivateRoute><DashboardPage /></PrivateRoute> },
        { path: "profile", element: <PrivateRoute><ProfilePage /></PrivateRoute> },
        { path: "resources", element: <PrivateRoute><ResourcePage /></PrivateRoute> },
        { path: "portal", element: <PrivateRoute><PortalPage /></PrivateRoute> },
        { path: "analyser", element: <PrivateRoute><ResumeAnalysisPage /></PrivateRoute> },
      ],
    },
    { path: "/home", element: <LandingPageV2 /> },
    { path: "/evom", element: <LandingPageV2 /> },
    {
      path: "/start-interview",
      element: (
        <PrivateRoute>
          <InterviewForm />
        </PrivateRoute>
      ),
    },
    {
      path: "/interview",
      element: (
        <PrivateRoute>
          <InterviewPage />
        </PrivateRoute>
          ),
    },
    {
      path: "/code-test",
      element: <CodeEditorWindow />,
    },
    {
      path: "/admin",
      element: (
        <SuperAdminRoute>
          <AdminLayout />
        </SuperAdminRoute>
      ),
      children: [
        {
          index: true,
          element: <Navigate to="dashboard" replace />,
        },
        {
          path: "dashboard",
          element: <AdminDashboard />,
        },
        {
          path: "users",
          element: <AdminUsers />,
        },
        {
          path: "interviews",
          element: <AdminInterviews />,
        },
        {
          path: "resources",
          element: <AdminResources />,
        },
      ],
    },
  ]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ErrorBoundary>
        <div>
          <RouterProvider router={router} />
          <Toaster />
          <AIAgentDownModal />
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
