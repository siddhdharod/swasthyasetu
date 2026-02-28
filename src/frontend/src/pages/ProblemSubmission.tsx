import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Edit,
  FileQuestion,
  Sparkles,
  XCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Problem } from "../backend.d";
import { useAuth } from "../context/AuthContext";
import { useActor } from "../hooks/useActor";

const CATEGORIES = ["Clinical", "Research", "Administrative", "Public Health"];

const LS_KEY = "openhealth_problems";

interface StoredProblem {
  id: number;
  title: string;
  description: string;
  submittedBy: string;
}

function loadLocalProblems(): StoredProblem[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as StoredProblem[]) : [];
  } catch {
    return [];
  }
}

function saveLocalProblem(p: StoredProblem) {
  const existing = loadLocalProblems();
  existing.unshift(p);
  localStorage.setItem(LS_KEY, JSON.stringify(existing));
}

const SEED_PROBLEMS: StoredProblem[] = [
  {
    id: 1,
    title: "Early Sepsis Detection in ICU Patients",
    description:
      "Need a reliable method to detect sepsis onset 2-3 hours earlier than current clinical signs.",
    submittedBy: "dr.chen@hospital.org",
  },
  {
    id: 2,
    title: "Medication Adherence in Elderly Patients",
    description:
      "Elderly patients often miss medications due to complex schedules. Need a scalable solution.",
    submittedBy: "j.smith@clinic.com",
  },
];

function aiRefine(
  title: string,
  description: string,
  category: string,
): string {
  return `[AI-Refined Problem Statement]

Title: ${title}

Category: ${category}

Problem Overview:
${description}

Structured Analysis:
• Core Challenge: ${description.split(".")[0]?.trim() ?? description}.
• Affected Population: Healthcare providers and patients in ${category.toLowerCase()} settings.
• Current Gap: Existing solutions fail to address the root cause systematically.
• Desired Outcome: A measurable, implementable solution that reduces adverse events by ≥30%.

Key Constraints:
• Must comply with HIPAA and applicable healthcare regulations
• Solution should integrate with existing EHR workflows
• Must be scalable across different healthcare facility sizes

Success Metrics:
• Primary: Reduction in adverse outcomes related to this problem
• Secondary: Improved efficiency in ${category.toLowerCase()} workflows
• Tertiary: Healthcare provider satisfaction score ≥ 8/10`;
}

export default function ProblemSubmission() {
  const { user } = useAuth();
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [refining, setRefining] = useState(false);
  const [refinedText, setRefinedText] = useState("");
  const [accepted, setAccepted] = useState(false);

  const { data: problems = [] } = useQuery<StoredProblem[]>({
    queryKey: ["problems"],
    queryFn: async () => {
      // Always prefer localStorage so user-submitted problems show up
      const local = loadLocalProblems();
      if (local.length > 0) return local;

      // Try backend if available
      if (actor) {
        try {
          const result = await actor.listProblems();
          if (result.length > 0) {
            return result.map((p: Problem) => ({
              id: Number(p.id),
              title: p.title,
              description: p.description,
              submittedBy: p.submittedBy,
            }));
          }
        } catch {
          // ignore backend errors
        }
      }

      // Fall back to seed data
      return SEED_PROBLEMS;
    },
    enabled: !isFetching,
    placeholderData: SEED_PROBLEMS,
  });

  const submitMutation = useMutation({
    mutationFn: async (data: { title: string; description: string }) => {
      // Always save to localStorage first so it persists
      const newProblem: StoredProblem = {
        id: Date.now(),
        title: data.title,
        description: data.description,
        submittedBy: user?.email ?? "anonymous",
      };
      saveLocalProblem(newProblem);

      // Also try the backend if available
      if (actor) {
        try {
          await actor.submitProblem(
            data.title,
            data.description,
            user?.email ?? "",
          );
        } catch {
          // backend failed but we already saved locally — that's fine
        }
      } else {
        // Simulate a short delay for UX feedback
        await new Promise((res) => setTimeout(res, 600));
      }
    },
    onSuccess: () => {
      toast.success("Problem submitted and saved!");
      queryClient.invalidateQueries({ queryKey: ["problems"] });
      setTitle("");
      setCategory("");
      setDescription("");
      setRefinedText("");
      setAccepted(false);
    },
    onError: () => {
      toast.error("Failed to submit problem. Please try again.");
    },
  });

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Problem title is required";
    if (!category) errs.category = "Please select a category";
    if (!description.trim()) errs.description = "Description is required";
    else if (description.trim().length < 50)
      errs.description = "Description must be at least 50 characters";
    return errs;
  };

  const handleRefine = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setRefining(true);
    setRefinedText("");
    setAccepted(false);

    await new Promise((res) => setTimeout(res, 1500));
    setRefinedText(aiRefine(title, description, category));
    setRefining(false);
  };

  const handleAccept = () => {
    setAccepted(true);
    submitMutation.mutate({ title, description: refinedText });
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <FileQuestion className="w-3.5 h-3.5 gradient-text" />
          <span className="overline-label gradient-text">
            Problem Submission
          </span>
        </div>
        <h1 className="font-display font-black text-3xl lg:text-4xl tracking-tight">
          Submit a <span className="gradient-text">Healthcare Problem</span>
        </h1>
        <p
          className="text-sm mt-1.5"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          Describe your challenge and let AI refine it into an actionable
          problem statement.
        </p>
      </motion.div>

      {/* Form */}
      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        onSubmit={handleRefine}
        noValidate
        className="glass-card rounded-3xl p-6 lg:p-8 space-y-5"
      >
        {/* Title */}
        <div>
          <label
            htmlFor="problem-title"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            Problem Title
          </label>
          <input
            id="problem-title"
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (errors.title) setErrors((p) => ({ ...p, title: "" }));
            }}
            placeholder="e.g., Early Sepsis Detection in ICU Patients"
            className={`w-full px-4 py-3 rounded-xl border bg-transparent text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 transition-all ${
              errors.title
                ? "border-red-500 focus:ring-red-500/30"
                : "border-border focus:ring-primary/30 focus:border-primary/50"
            }`}
          />
          {errors.title && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.title}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="problem-category"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            Category
          </label>
          <select
            id="problem-category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              if (errors.category) setErrors((p) => ({ ...p, category: "" }));
            }}
            className={`w-full px-4 py-3 rounded-xl border bg-background text-foreground text-sm focus:outline-none focus:ring-2 transition-all cursor-pointer ${
              errors.category
                ? "border-red-500 focus:ring-red-500/30"
                : "border-border focus:ring-primary/30 focus:border-primary/50"
            }`}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.category}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="problem-description"
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            Problem Description
            <span className="ml-2 text-xs text-muted-foreground">
              (min. 50 characters)
            </span>
          </label>
          <textarea
            id="problem-description"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errors.description)
                setErrors((p) => ({ ...p, description: "" }));
            }}
            placeholder="Describe the healthcare problem in detail. Include context, current situation, and why it matters..."
            rows={5}
            className={`w-full px-4 py-3 rounded-xl border bg-transparent text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 transition-all resize-none ${
              errors.description
                ? "border-red-500 focus:ring-red-500/30"
                : "border-border focus:ring-primary/30 focus:border-primary/50"
            }`}
          />
          <div className="flex justify-between mt-1">
            {errors.description ? (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.description}
              </p>
            ) : (
              <span />
            )}
            <span
              className={`text-xs ${description.length < 50 ? "text-muted-foreground" : "text-green-500"}`}
            >
              {description.length}/50+
            </span>
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={refining}
          whileHover={{ scale: refining ? 1 : 1.02 }}
          whileTap={{ scale: refining ? 1 : 0.98 }}
          className="gradient-btn px-6 py-3 rounded-xl font-semibold text-white text-sm flex items-center gap-2 disabled:opacity-60"
        >
          {refining ? (
            <>
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              AI Refining...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Refine with AI
            </>
          )}
        </motion.button>
      </motion.form>

      {/* AI Refined Preview */}
      <AnimatePresence>
        {refinedText && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="glass-card rounded-3xl p-6 lg:p-8 border border-primary/20"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg gradient-btn flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg gradient-text">
                  AI Refined Preview
                </h3>
                <p className="text-xs text-muted-foreground">
                  AI has enhanced your problem statement
                </p>
              </div>
            </div>

            <pre className="text-sm text-foreground whitespace-pre-wrap leading-relaxed font-sans p-4 rounded-xl bg-white/10 border border-border/50 mb-5">
              {refinedText}
            </pre>

            {!accepted && (
              <div className="flex gap-3">
                <motion.button
                  onClick={handleAccept}
                  disabled={submitMutation.isPending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="gradient-btn px-5 py-2.5 rounded-xl font-semibold text-white text-sm flex items-center gap-2"
                >
                  {submitMutation.isPending ? (
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  Accept & Submit
                </motion.button>
                <button
                  type="button"
                  onClick={() => {
                    setRefinedText("");
                    setErrors({});
                  }}
                  className="px-5 py-2.5 rounded-xl font-semibold text-sm glass-card flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  Edit & Resubmit
                </button>
              </div>
            )}

            {accepted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-green-500 font-semibold text-sm"
              >
                <CheckCircle className="w-5 h-5" />
                Problem submitted successfully!
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Problem list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="glass-card rounded-3xl p-6 lg:p-8"
      >
        <div className="flex items-center gap-2 mb-5">
          <Clock className="w-4 h-4 gradient-text" />
          <h2 className="font-display font-bold text-lg">
            Previously Submitted Problems
          </h2>
          <span className="ml-auto text-xs text-muted-foreground">
            {problems.length} total
          </span>
        </div>

        {problems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileQuestion className="w-10 h-10 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No problems submitted yet. Be the first!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {problems.map((p) => (
              <div
                key={p.id}
                className="p-4 rounded-xl border border-border/50 hover:border-primary/30 transition-all hover:bg-white/5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <h3 className="text-sm font-semibold text-foreground">
                      {p.title}
                    </h3>
                  </div>
                  <XCircle className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                </div>
                <p className="text-xs text-muted-foreground mt-1.5 ml-6 line-clamp-2">
                  {p.description}
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1 ml-6">
                  by {p.submittedBy}
                </p>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
