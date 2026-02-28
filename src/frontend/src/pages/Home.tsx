import { Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowRight,
  Brain,
  CheckCircle,
  Database,
  Globe,
  Heart,
  Lightbulb,
  Shield,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { type Variants, motion } from "motion/react";
import { useState } from "react";
import Footer from "../components/Footer";

/* ─── Motion presets ─── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.11,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const FEATURES = [
  {
    icon: Brain,
    title: "AI Problem Refinement",
    desc: "Submit raw healthcare problems and receive AI-polished, structured problem statements ready for innovation.",
    color: "#FF7AAE",
    darkColor: "#ff9cc4",
  },
  {
    icon: Lightbulb,
    title: "Idea Generation Engine",
    desc: "Generate 3 targeted, actionable solution ideas with AI-assessed feasibility scores for each challenge.",
    color: "#A259FF",
    darkColor: "#c084fc",
  },
  {
    icon: Users,
    title: "Expert Collaboration",
    desc: "Thread-based discussions with AI-generated summaries to keep healthcare teams aligned and productive.",
    color: "#0891b2",
    darkColor: "#00FFFF",
  },
  {
    icon: Database,
    title: "Data Sandbox",
    desc: "Explore curated healthcare datasets for research — from epidemiology to genomics.",
    color: "#C362FF",
    darkColor: "#d88bff",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    desc: "Enterprise-grade security protocols protecting sensitive health data with end-to-end encryption.",
    color: "#FF7AAE",
    darkColor: "#ff9cc4",
  },
  {
    icon: Globe,
    title: "Global Network",
    desc: "Connect with thousands of healthcare innovators, researchers, and practitioners worldwide.",
    color: "#A259FF",
    darkColor: "#c084fc",
  },
];

const STATS = [
  { value: "12,000+", label: "Innovators", icon: Users },
  { value: "3,400+", label: "Problems Solved", icon: CheckCircle },
  { value: "99.9%", label: "Uptime SLA", icon: Zap },
  { value: "50+", label: "Countries", icon: Globe },
];

const TRUST_PILLS = [
  { label: "HIPAA Compliant", icon: Shield },
  { label: "ISO 27001", icon: CheckCircle },
  { label: "15ms AI Response", icon: Zap },
  { label: "SOC 2 Type II", icon: Shield },
];

export default function Home() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setJoined(true);
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen">
      {/* ───────────── HERO ───────────── */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          {/* ── Overline badge ── */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex justify-center mb-8"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs font-bold tracking-widest uppercase">
              <Sparkles className="w-3 h-3 gradient-text flex-shrink-0" />
              <span className="gradient-text">
                AI-Powered Healthcare Innovation
              </span>
            </span>
          </motion.div>

          {/* ── Headline — two lines, massive, intentional break ── */}
          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-center font-display font-black leading-[0.95] tracking-tighter mb-7"
            style={{ fontSize: "clamp(3rem, 9vw, 7.5rem)" }}
          >
            <span className="block text-foreground">Revolutionize</span>
            <span className="block gradient-text">Healthcare</span>
            <span
              className="block text-foreground"
              style={{ fontSize: "clamp(2rem, 6vw, 5rem)" }}
            >
              with <span className="gradient-text">AI</span>
            </span>
          </motion.h1>

          {/* ── Subheadline ── */}
          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-center text-base sm:text-lg lg:text-xl max-w-xl mx-auto mb-10 leading-relaxed"
            style={{ color: "oklch(var(--muted-foreground))" }}
          >
            Submit problems, generate ideas, and collaborate with global experts
            — powered by AI built for healthcare.
          </motion.p>

          {/* ── CTA row ── */}
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap items-center justify-center gap-3 mb-14"
          >
            <Link
              to="/register"
              className="gradient-btn inline-flex items-center gap-2.5 px-8 py-3.5 rounded-2xl font-semibold text-white text-sm"
              style={{ boxShadow: "0 4px 20px rgba(162,89,255,0.3)" }}
            >
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("features")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="glass-card inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-semibold text-sm text-foreground/80 hover:text-foreground transition-colors"
            >
              See How It Works
            </button>
          </motion.div>

          {/* ── Trust pills ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="flex flex-wrap justify-center gap-2"
          >
            {TRUST_PILLS.map((p) => (
              <span
                key={p.label}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium glass-card"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                <p.icon className="w-3 h-3 gradient-text" />
                {p.label}
              </span>
            ))}
          </motion.div>

          {/* ── Hero visual: glowing central orb with orbiting feature icons ── */}
          <motion.div
            initial={{ opacity: 0, y: 48, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: 0.65,
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="relative mt-20 max-w-2xl mx-auto"
          >
            {/* Glass panel */}
            <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
              {/* Decorative gradient fill */}
              <div
                className="absolute inset-0 opacity-[0.06] pointer-events-none rounded-3xl"
                style={{
                  background:
                    "linear-gradient(135deg, var(--primary-start), var(--primary-end))",
                }}
              />

              {/* Central orb */}
              <div className="relative flex flex-col items-center gap-6">
                <div className="relative">
                  {/* Pulse rings */}
                  <div className="hero-pulse-ring" />
                  <div className="hero-pulse-ring" />
                  <div className="hero-pulse-ring" />
                  {/* Orb */}
                  <div
                    className="w-20 h-20 rounded-full gradient-btn flex items-center justify-center relative z-10"
                    style={{
                      boxShadow:
                        "0 0 0 8px rgba(162,89,255,0.08), 0 0 40px rgba(162,89,255,0.25)",
                    }}
                  >
                    <Activity className="w-9 h-9 text-white" />
                  </div>
                </div>

                {/* Three-step flow */}
                <div className="grid grid-cols-3 gap-3 w-full">
                  {[
                    {
                      icon: Brain,
                      label: "AI Refines",
                      sublabel: "Your problem",
                      color: "#FF7AAE",
                    },
                    {
                      icon: Lightbulb,
                      label: "Generates",
                      sublabel: "3 solutions",
                      color: "#A259FF",
                    },
                    {
                      icon: Users,
                      label: "Experts",
                      sublabel: "Collaborate",
                      color: "#00FFFF",
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.85 + i * 0.1,
                        duration: 0.45,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className="flex flex-col items-center gap-2 p-3 rounded-2xl text-center"
                      style={{ background: `${item.color}10` }}
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{ background: `${item.color}20` }}
                      >
                        <item.icon
                          className="w-4.5 h-4.5"
                          style={{
                            color: item.color,
                            width: "1.125rem",
                            height: "1.125rem",
                          }}
                        />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground leading-none">
                          {item.label}
                        </p>
                        <p
                          className="text-xs mt-0.5 leading-none"
                          style={{ color: "oklch(var(--muted-foreground))" }}
                        >
                          {item.sublabel}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom reflection glow */}
            <div
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 blur-2xl opacity-20 rounded-full pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, var(--primary-start), var(--primary-end))",
              }}
            />
          </motion.div>
        </div>
      </section>

      {/* ───────────── STATS ───────────── */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.45 }}
              className="glass-card rounded-2xl p-5 text-center card-hover"
            >
              <stat.icon className="w-4 h-4 gradient-text mx-auto mb-3" />
              <div className="stat-number font-display font-black text-2xl gradient-text mb-0.5">
                {stat.value}
              </div>
              <div
                className="text-xs font-medium"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ───────────── FEATURES ───────────── */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="overline-label gradient-text mb-3">
              Platform Capabilities
            </p>
            <h2 className="font-display font-black text-4xl sm:text-5xl mb-4 tracking-tight">
              Why <span className="gradient-text">SwasthyaSetu?</span>
            </h2>
            <p
              className="text-base sm:text-lg max-w-xl mx-auto leading-relaxed"
              style={{ color: "oklch(var(--muted-foreground))" }}
            >
              Every tool your healthcare team needs — from raw problem to
              deployed solution.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  delay: i * 0.07,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -6 }}
                className="glass-card rounded-3xl p-6 card-hover cursor-default group flex flex-col"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 flex-shrink-0"
                  style={{ background: `${feature.color}18` }}
                >
                  <feature.icon
                    className="w-5 h-5 transition-transform group-hover:scale-110"
                    style={{ color: feature.color }}
                  />
                </div>
                <h3 className="font-display font-bold text-base mb-2 text-foreground leading-snug">
                  {feature.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "oklch(var(--muted-foreground))" }}
                >
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── HOW IT WORKS ───────────── */}
      <section id="about" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card rounded-3xl p-8 lg:p-14 grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="overline-label gradient-text mb-4">How It Works</p>
              <h2 className="font-display font-black text-4xl leading-tight tracking-tight mb-8">
                From Problem to{" "}
                <span className="gradient-text">Innovation</span>
                <br />
                in 3 Steps
              </h2>
              <div className="space-y-6">
                {[
                  {
                    n: "01",
                    title: "Submit Your Problem",
                    desc: "Describe a healthcare challenge in plain language. Our AI refines it into a precise, actionable problem statement.",
                  },
                  {
                    n: "02",
                    title: "Generate AI Solutions",
                    desc: "Get 3 targeted solution ideas with feasibility scores, ranked by implementation complexity and impact.",
                  },
                  {
                    n: "03",
                    title: "Collaborate & Execute",
                    desc: "Bring together multidisciplinary teams in AI-summarized collaboration threads to move ideas into reality.",
                  },
                ].map((step, i) => (
                  <motion.div
                    key={step.n}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 + i * 0.1, duration: 0.45 }}
                    className="flex gap-5 items-start"
                  >
                    {/* Step number pill */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl gradient-btn flex items-center justify-center text-white font-display font-black text-sm">
                      {step.n}
                    </div>
                    <div className="pt-1">
                      <p className="font-semibold text-sm text-foreground mb-1">
                        {step.title}
                      </p>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "oklch(var(--muted-foreground))" }}
                      >
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative"
            >
              <div className="relative max-w-sm mx-auto">
                {/* Glow behind */}
                <div
                  className="absolute inset-0 rounded-3xl blur-3xl opacity-15 scale-95"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--primary-start), var(--primary-end))",
                  }}
                />
                <div className="relative glass-card rounded-3xl p-8 flex flex-col justify-center items-center gap-5">
                  {/* Central icon */}
                  <div
                    className="w-18 h-18 rounded-full gradient-btn flex items-center justify-center"
                    style={{
                      width: "4.5rem",
                      height: "4.5rem",
                      boxShadow: "0 0 32px rgba(162,89,255,0.3)",
                    }}
                  >
                    <Heart className="w-9 h-9 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="font-display font-black text-xl gradient-text mb-1">
                      Healthcare First
                    </p>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "oklch(var(--muted-foreground))" }}
                    >
                      Built by clinicians, engineers, and AI researchers with
                      one mission: improving global health outcomes.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 w-full">
                    {[
                      { v: "15ms", l: "AI Response" },
                      { v: "HIPAA", l: "Compliant" },
                      { v: "ISO 27001", l: "Certified" },
                      { v: "24/7", l: "Support" },
                    ].map((s) => (
                      <div
                        key={s.l}
                        className="text-center p-2.5 rounded-xl"
                        style={{ background: "rgba(162,89,255,0.07)" }}
                      >
                        <p className="stat-number font-bold text-sm gradient-text">
                          {s.v}
                        </p>
                        <p
                          className="text-xs mt-0.5"
                          style={{ color: "oklch(var(--muted-foreground))" }}
                        >
                          {s.l}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ───────────── CTA / WAITLIST ───────────── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="glass-card rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden"
          >
            {/* BG gradient */}
            <div
              className="absolute inset-0 opacity-[0.08] pointer-events-none rounded-3xl"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary-start), var(--primary-end))",
              }}
            />
            {/* BG glow */}
            <div
              className="absolute -top-16 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle, var(--primary-start), transparent)",
              }}
            />

            <div className="relative z-10">
              <div
                className="w-12 h-12 rounded-2xl gradient-btn flex items-center justify-center mx-auto mb-5"
                style={{ boxShadow: "0 0 24px rgba(162,89,255,0.3)" }}
              >
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h2 className="font-display font-black text-3xl sm:text-4xl tracking-tight mb-3">
                Ready to transform{" "}
                <span className="gradient-text">healthcare?</span>
              </h2>
              <p
                className="mb-8 text-base sm:text-lg max-w-md mx-auto"
                style={{ color: "oklch(var(--muted-foreground))" }}
              >
                Join thousands of innovators already reshaping the future of
                medicine.
              </p>

              {joined ? (
                <motion.div
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center justify-center gap-2 text-green-500 font-semibold text-sm"
                >
                  <Heart className="w-5 h-5 fill-green-500" />
                  You're on the waitlist! We'll be in touch soon.
                </motion.div>
              ) : (
                <form
                  onSubmit={handleWaitlist}
                  className="flex flex-col sm:flex-row gap-2.5 max-w-sm mx-auto"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="flex-1 px-4 py-3 rounded-xl border border-white/30 bg-white/10 text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 backdrop-blur-sm"
                    required
                  />
                  <button
                    type="submit"
                    className="gradient-btn px-6 py-3 rounded-xl font-semibold text-white text-sm whitespace-nowrap"
                  >
                    Join Waitlist
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
