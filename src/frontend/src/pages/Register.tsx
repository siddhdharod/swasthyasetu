import { Link, Navigate, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

// Defined OUTSIDE Register to keep a stable reference across renders.
// Defining it inside would cause React to treat it as a new component type
// on every keystroke, unmounting the input and destroying focus.
function InputField({
  id,
  label,
  type,
  value,
  onChange,
  placeholder,
  autoComplete,
  error,
  icon,
  showToggle,
  showValue,
  onToggle,
  onClearError,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  autoComplete?: string;
  error?: string;
  icon?: React.ReactNode;
  showToggle?: boolean;
  showValue?: boolean;
  onToggle?: () => void;
  onClearError?: () => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-foreground mb-1.5"
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <input
          id={id}
          type={showToggle && showValue ? "text" : type}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (error && onClearError) onClearError();
          }}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={`w-full px-4 py-3 ${icon ? "pl-10" : ""} ${showToggle ? "pr-11" : ""} rounded-xl border bg-transparent text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 transition-all ${
            error
              ? "border-red-500 focus:ring-red-500/30"
              : "border-border focus:ring-primary/30 focus:border-primary/50"
          }`}
        />
        {showToggle && onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={showValue ? "Hide password" : "Show password"}
          >
            {showValue ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Name is required";
    if (!email) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Enter a valid email address";
    if (!password) errs.password = "Password is required";
    else if (password.length < 6)
      errs.password = "Password must be at least 6 characters";
    if (!confirmPassword) errs.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      await register(name.trim(), email, password);
      navigate({ to: "/dashboard" });
    } catch (err: unknown) {
      setServerError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-16 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-btn flex items-center justify-center mb-4 shadow-lg">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display font-black text-3xl text-foreground">
            Create Account
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Join SwasthyaSetu — it's free to start
          </p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-3xl p-8">
          {serverError && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm mb-5"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {serverError}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <InputField
              id="name"
              label="Full Name"
              type="text"
              value={name}
              onChange={setName}
              placeholder="Dr. Jane Smith"
              autoComplete="name"
              error={errors.name}
              icon={<User className="w-4 h-4" />}
              onClearError={() => setErrors((prev) => ({ ...prev, name: "" }))}
            />
            <InputField
              id="email"
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="you@example.com"
              autoComplete="email"
              error={errors.email}
              onClearError={() => setErrors((prev) => ({ ...prev, email: "" }))}
            />
            <InputField
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Min. 6 characters"
              autoComplete="new-password"
              error={errors.password}
              showToggle
              showValue={showPassword}
              onToggle={() => setShowPassword(!showPassword)}
              onClearError={() =>
                setErrors((prev) => ({ ...prev, password: "" }))
              }
            />
            <InputField
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Repeat your password"
              autoComplete="new-password"
              error={errors.confirmPassword}
              showToggle
              showValue={showConfirm}
              onToggle={() => setShowConfirm(!showConfirm)}
              onClearError={() =>
                setErrors((prev) => ({ ...prev, confirmPassword: "" }))
              }
            />

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full gradient-btn py-3 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="gradient-text font-semibold hover:opacity-80 transition-opacity"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
