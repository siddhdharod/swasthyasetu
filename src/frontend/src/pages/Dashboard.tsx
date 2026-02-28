import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  CheckCircle,
  Clock,
  Database,
  FileQuestion,
  Lightbulb,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import type { Problem } from "../backend.d";
import { useAuth } from "../context/AuthContext";
import { useActor } from "../hooks/useActor";

const ACTIVITY = [
  {
    icon: FileQuestion,
    text: "New problem submitted: ICU Patient Monitoring",
    time: "2 hours ago",
    color: "#FF7AAE",
  },
  {
    icon: Lightbulb,
    text: "3 ideas generated for Sepsis Detection",
    time: "5 hours ago",
    color: "#A259FF",
  },
  {
    icon: Users,
    text: "New thread: Drug Interaction Safety Protocol",
    time: "1 day ago",
    color: "#00FFFF",
  },
  {
    icon: Database,
    text: "Explored Genomics Research Dataset",
    time: "2 days ago",
    color: "#C362FF",
  },
];

export default function Dashboard() {
  const { user } = useAuth();
  const { actor, isFetching } = useActor();

  const { data: problems = [] } = useQuery<Problem[]>({
    queryKey: ["problems"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listProblems();
    },
    enabled: !!actor && !isFetching,
  });

  const stats = [
    {
      label: "Problems Submitted",
      value: Math.max(problems.length, 3),
      icon: FileQuestion,
      color: "#FF7AAE",
      href: "/dashboard/problems",
    },
    {
      label: "Ideas Generated",
      value: 12,
      icon: Lightbulb,
      color: "#A259FF",
      href: "/dashboard/ideas",
    },
    {
      label: "Collaborations",
      value: 5,
      icon: Users,
      color: "#00FFFF",
      href: "/dashboard/collaboration",
    },
    {
      label: "Datasets Explored",
      value: 8,
      icon: Database,
      color: "#C362FF",
      href: "/dashboard/sandbox",
    },
  ];

  const quickActions = [
    {
      title: "Submit a Problem",
      desc: "Share a healthcare challenge for AI refinement",
      href: "/dashboard/problems",
      icon: FileQuestion,
    },
    {
      title: "Generate Ideas",
      desc: "Create AI-powered solution ideas",
      href: "/dashboard/ideas",
      icon: Lightbulb,
    },
    {
      title: "Collaborate",
      desc: "Join or start a discussion thread",
      href: "/dashboard/collaboration",
      icon: Users,
    },
    {
      title: "Explore Data",
      desc: "Browse healthcare datasets",
      href: "/dashboard/sandbox",
      icon: Database,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-3.5 h-3.5 gradient-text" />
          <span className="overline-label gradient-text">Dashboard</span>
        </div>
        <h1 className="font-display font-black text-3xl lg:text-4xl tracking-tight">
          Welcome back,{" "}
          <span className="gradient-text">
            {user?.name?.split(" ")[0] ?? "there"}
          </span>
          ! 👋
        </h1>
        <p
          className="text-sm mt-1.5"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          Here's an overview of your SwasthyaSetu activity.
        </p>
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.4 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="glass-card rounded-2xl card-hover"
          >
            <Link to={stat.href} className="block p-5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: `${stat.color}20` }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div className="stat-number font-display font-black text-3xl gradient-text">
                {stat.value}
              </div>
              <div
                className="text-xs font-medium mt-1"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                {stat.label}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent activity + Quick actions */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent activity */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-4 h-4 gradient-text" />
            <h2 className="font-display font-bold text-lg">Recent Activity</h2>
          </div>
          <div className="space-y-4">
            {ACTIVITY.map((item, i) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="flex items-start gap-3"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: `${item.color}20` }}
                >
                  <item.icon
                    className="w-4 h-4"
                    style={{ color: item.color }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground leading-snug">
                    {item.text}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {item.time}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <CheckCircle className="w-4 h-4 gradient-text" />
            <h2 className="font-display font-bold text-lg">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, i) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.06 }}
              >
                <Link
                  to={action.href}
                  className="group block p-4 rounded-xl border border-border/50 hover:border-primary/40 transition-all hover:bg-white/10"
                >
                  <action.icon className="w-5 h-5 gradient-text mb-2 group-hover:scale-110 transition-transform" />
                  <p className="text-xs font-semibold text-foreground leading-tight">
                    {action.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-tight">
                    {action.desc}
                  </p>
                  <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary mt-2 transition-colors" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
