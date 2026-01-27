import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

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

// Redirect logged-in users from public pages
function PublicRoute({ children }) {
  const { authUser } = useAuthStore();
  console.log({ authUser });
  return authUser ? <Navigate to="/dashboard" replace /> : children;
}

// Protect routes that require authentication
function PrivateRoute({ children }) {
  const { authUser } = useAuthStore();
  return authUser ? children : <Navigate to="/get-started" replace />;
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
      element: authUser ? <Navigate to="/dashboard" replace /> : <LandingPageV2 />,
    },
    {
      path: "/home",
      element: <LandingPageV2 />,
    },
    {
      path: "/evom",
      element: <LandingPageV2 />,
    },
    {
      path: "/start-interview",
      element: (
        <PrivateRoute>
          <InterviewForm />
        </PrivateRoute>
      ),
    },
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          index: true,
          element: (
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          ),
        },
        {
          path: "dashboard",
          element: (
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          ),
        },
        {
          path: "profile",
          element: (
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          ),
        },
        {
          path: "resources",
          element: (
            <PrivateRoute>
              <ResourcePage />
            </PrivateRoute>
          ),
        },
        {
          path: "portal",
          element: (
            <PrivateRoute>
              <PortalPage />
            </PrivateRoute>
          ),
        },
        {
          path: "analyser",
          element: (
            <PrivateRoute>
              <ResumeAnalysisPage />
            </PrivateRoute>
          ),
        },
      ],
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
  ]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div>
      <RouterProvider router={router} />
      <Toaster />
    </div>
  );
}

export default App;
