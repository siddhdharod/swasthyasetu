import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  ChevronLeft,
  ChevronRight,
  Database,
  FileQuestion,
  LayoutDashboard,
  Lightbulb,
  Menu,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { label: "Overview", icon: LayoutDashboard, href: "/dashboard" },
  {
    label: "Problem Submission",
    icon: FileQuestion,
    href: "/dashboard/problems",
  },
  { label: "Idea Generator", icon: Lightbulb, href: "/dashboard/ideas" },
  { label: "Collaboration", icon: Users, href: "/dashboard/collaboration" },
  { label: "Data Sandbox", icon: Database, href: "/dashboard/sandbox" },
];

// Defined outside DashboardLayout so React doesn't treat it as a new component
// type on every render (which would cause full remounts of sidebar children).
function Sidebar({
  collapsed,
  mobile,
  user,
  currentPath,
  onCollapse,
  onClose,
}: {
  collapsed: boolean;
  mobile?: boolean;
  user: { name: string; email: string } | null;
  currentPath: string;
  onCollapse: () => void;
  onClose: () => void;
}) {
  return (
    <div
      className={`flex flex-col h-full glass-card ${
        mobile ? "w-64" : collapsed ? "w-16" : "w-56"
      } transition-all duration-300`}
    >
      {/* Sidebar header */}
      <div
        className={`flex items-center p-4 border-b border-border/50 ${collapsed && !mobile ? "justify-center" : "justify-between"}`}
      >
        {(!collapsed || mobile) && (
          <span className="font-display font-semibold text-sm gradient-text">
            Dashboard
          </span>
        )}
        {!mobile && (
          <button
            type="button"
            onClick={onCollapse}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors text-muted-foreground hover:text-foreground"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* User info */}
      {(!collapsed || mobile) && user && (
        <div className="px-4 py-3 border-b border-border/50">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold mb-2 gradient-btn">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <p className="text-xs font-medium text-foreground truncate">
            {user.name}
          </p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
      )}

      {/* Nav items */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? currentPath === "/dashboard"
              : currentPath.startsWith(item.href);

          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => mobile && onClose()}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "gradient-btn text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-white/20"
              } ${collapsed && !mobile ? "justify-center" : ""}`}
              title={collapsed && !mobile ? item.label : undefined}
            >
              <item.icon
                className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-white" : "group-hover:scale-110 transition-transform"}`}
              />
              {(!collapsed || mobile) && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <div className="min-h-screen pt-16 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex sticky top-16 h-[calc(100vh-4rem)] flex-col">
        <Sidebar
          collapsed={collapsed}
          mobile={false}
          user={user}
          currentPath={currentPath}
          onCollapse={() => setCollapsed((c) => !c)}
          onClose={() => setMobileOpen(false)}
        />
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-16 h-[calc(100vh-4rem)] z-50 lg:hidden"
            >
              <Sidebar
                collapsed={false}
                mobile
                user={user}
                currentPath={currentPath}
                onCollapse={() => setCollapsed((c) => !c)}
                onClose={() => setMobileOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 p-4 border-b border-border/50 glass-card">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-white/20"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-semibold text-sm gradient-text">Dashboard</span>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className={`ml-auto p-2 rounded-lg hover:bg-white/20 ${mobileOpen ? "block" : "hidden"}`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 lg:p-6 xl:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
