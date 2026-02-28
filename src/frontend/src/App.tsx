import { Toaster } from "@/components/ui/sonner";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import AnimatedBackground from "./components/AnimatedBackground";
import DashboardLayout from "./components/DashboardLayout";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import Collaboration from "./pages/Collaboration";
import Dashboard from "./pages/Dashboard";
import DataSandbox from "./pages/DataSandbox";
import Home from "./pages/Home";
import IdeaGenerator from "./pages/IdeaGenerator";
import Login from "./pages/Login";
import ProblemSubmission from "./pages/ProblemSubmission";
import Register from "./pages/Register";

// Root layout
function RootLayout() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

function AppContent() {
  return (
    <>
      <AnimatedBackground />
      <Navbar />
      <Outlet />
      <Toaster position="bottom-right" />
    </>
  );
}

// Protected wrapper
function ProtectedWrapper({ children }: { children: React.ReactNode }) {
  const { user, isInitializing } = useAuth();

  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-full border-4 animate-spin"
            style={{
              borderColor:
                "var(--primary-start) transparent var(--primary-end) transparent",
            }}
          />
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}

// Route definitions
const rootRoute = createRootRoute({
  component: RootLayout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: Login,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: Register,
});

// Dashboard layout route
function DashboardLayoutWrapper() {
  return (
    <ProtectedWrapper>
      <DashboardLayout />
    </ProtectedWrapper>
  );
}

const dashboardLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: DashboardLayoutWrapper,
});

const dashboardIndexRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/",
  component: Dashboard,
});

const problemsRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/problems",
  component: ProblemSubmission,
});

const ideasRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/ideas",
  component: IdeaGenerator,
});

const collaborationRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/collaboration",
  component: Collaboration,
});

const sandboxRoute = createRoute({
  getParentRoute: () => dashboardLayoutRoute,
  path: "/sandbox",
  component: DataSandbox,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  dashboardLayoutRoute.addChildren([
    dashboardIndexRoute,
    problemsRoute,
    ideasRoute,
    collaborationRoute,
    sandboxRoute,
  ]),
]);

const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
