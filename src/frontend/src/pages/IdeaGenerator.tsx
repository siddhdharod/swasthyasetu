import { useMutation, useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Lightbulb,
  Save,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { AnimatePresence, type Variants, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Idea, Problem } from "../backend.d";
import { useActor } from "../hooks/useActor";

const MOCK_PROBLEMS: Problem[] = [
  {
    id: 1n,
    title: "Early Sepsis Detection in ICU Patients",
    description: "Need a reliable method to detect sepsis onset earlier.",
    submittedBy: "dr.chen@hospital.org",
  },
  {
    id: 2n,
    title: "Medication Adherence in Elderly Patients",
    description:
      "Elderly patients often miss medications due to complex schedules.",
    submittedBy: "j.smith@clinic.com",
  },
  {
    id: 3n,
    title: "Reducing Emergency Wait Times",
    description: "ED patient waiting times exceed 4 hours during peak periods.",
    submittedBy: "ed.admin@medcenter.org",
  },
];

function generateMockIdeas(problemTitle: string): Idea[] {
  const ideas: Idea[] = [
    {
      id: 1n,
      problemId: 1n,
      title: `AI-Powered ${problemTitle.split(" ")[0]} Monitoring System`,
      description:
        "Deploy a machine learning model trained on 500,000+ patient records to continuously monitor vital signs and biomarkers. The system provides real-time alerts with 94% specificity, reducing false positives by 60% compared to traditional threshold-based systems. Integration with existing EHR systems via HL7 FHIR APIs enables seamless adoption.",
      feasibilityScore: 82n,
      category: "Technology",
    },
    {
      id: 2n,
      problemId: 1n,
      title: `Predictive Clinical Decision Support for ${problemTitle.split(" ")[0]}`,
      description: `Develop a clinical decision support tool that surfaces risk stratification scores directly in the physician's workflow. Using ensemble learning on structured and unstructured EHR data, the tool flags high-risk patients 4-6 hours before critical deterioration. Includes explainable AI components showing the top contributing factors for each alert.`,
      feasibilityScore: 67n,
      category: "Clinical",
    },
    {
      id: 3n,
      problemId: 1n,
      title: "Wearable Biosensor Network for Continuous Monitoring",
      description:
        "Implement a network of non-invasive wearable sensors that continuously track 12 physiological parameters. Edge computing on the sensor processes data locally, transmitting only anomaly signals to reduce bandwidth. The system communicates with nursing stations via BLE mesh network and integrates with existing telemetry infrastructure.",
      feasibilityScore: 45n,
      category: "Device",
    },
  ];
  return ideas;
}

function getFeasibilityColor(score: number): string {
  if (score >= 70) return "#22c55e";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
}

function getFeasibilityLabel(score: number): string {
  if (score >= 70) return "High Feasibility";
  if (score >= 40) return "Moderate";
  return "Complex";
}

export default function IdeaGenerator() {
  const { actor, isFetching } = useActor();
  const [selectedProblemId, setSelectedProblemId] = useState<string>("");
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [generating, setGenerating] = useState(false);
  const [saved, setSaved] = useState(false);

  const { data: problems = [] } = useQuery<Problem[]>({
    queryKey: ["problems"],
    queryFn: async () => {
      if (!actor) return MOCK_PROBLEMS;
      try {
        const result = await actor.listProblems();
        return result.length > 0 ? result : MOCK_PROBLEMS;
      } catch {
        return MOCK_PROBLEMS;
      }
    },
    enabled: !!actor && !isFetching,
    placeholderData: MOCK_PROBLEMS,
  });

  const displayProblems = problems.length > 0 ? problems : MOCK_PROBLEMS;

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!actor) {
        await new Promise((res) => setTimeout(res, 600));
        return;
      }
      await Promise.all(
        ideas.map((idea) =>
          actor.storeIdea(
            BigInt(selectedProblemId),
            idea.title,
            idea.description,
            idea.feasibilityScore,
            idea.category,
          ),
        ),
      );
    },
    onSuccess: () => {
      toast.success("Ideas saved successfully!");
      setSaved(true);
    },
    onError: () => {
      toast.error("Failed to save ideas.");
    },
  });

  const handleGenerate = async () => {
    if (!selectedProblemId) {
      toast.error("Please select a problem first");
      return;
    }

    setGenerating(true);
    setIdeas([]);
    setSaved(false);

    await new Promise((res) => setTimeout(res, 2000));

    const problem = displayProblems.find(
      (p) => String(p.id) === selectedProblemId,
    );
    const generatedIdeas = generateMockIdeas(
      problem?.title ?? "Healthcare Challenge",
    );
    setIdeas(generatedIdeas);
    setGenerating(false);
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-3.5 h-3.5 gradient-text" />
          <span className="overline-label gradient-text">Idea Generator</span>
        </div>
        <h1 className="font-display font-black text-3xl lg:text-4xl tracking-tight">
          AI <span className="gradient-text">Idea Generator</span>
        </h1>
        <p
          className="text-sm mt-1.5"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          Select a problem and let AI generate 3 targeted solution ideas with
          feasibility scores.
        </p>
      </motion.div>

      {/* Problem selector + Generate */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="glass-card rounded-3xl p-6 lg:p-8"
      >
        <label
          htmlFor="problem-select"
          className="block text-sm font-medium text-foreground mb-2"
        >
          Select a Problem to Solve
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            id="problem-select"
            value={selectedProblemId}
            onChange={(e) => {
              setSelectedProblemId(e.target.value);
              setIdeas([]);
              setSaved(false);
            }}
            className="flex-1 px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
          >
            <option value="">Choose a healthcare problem...</option>
            {displayProblems.map((p) => (
              <option key={String(p.id)} value={String(p.id)}>
                {p.title}
              </option>
            ))}
          </select>
          <motion.button
            onClick={handleGenerate}
            disabled={generating || !selectedProblemId}
            whileHover={{ scale: generating || !selectedProblemId ? 1 : 1.02 }}
            whileTap={{ scale: generating || !selectedProblemId ? 1 : 0.98 }}
            className="gradient-btn px-6 py-3 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-50 whitespace-nowrap"
          >
            {generating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Ideas
              </>
            )}
          </motion.button>
        </div>

        {!selectedProblemId && (
          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Select a problem above to generate AI-powered solutions
          </p>
        )}
      </motion.div>

      {/* Loading state */}
      <AnimatePresence>
        {generating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-16 gap-4"
          >
            <div className="relative">
              <div
                className="w-16 h-16 rounded-full border-4 border-t-transparent animate-spin"
                style={{
                  borderColor:
                    "var(--primary-start) transparent var(--primary-end) transparent",
                }}
              />
              <Sparkles className="w-6 h-6 gradient-text absolute inset-0 m-auto" />
            </div>
            <p className="font-medium text-foreground">
              AI is generating ideas...
            </p>
            <p className="text-sm text-muted-foreground">
              Analyzing problem context and constraints
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Idea cards */}
      <AnimatePresence>
        {ideas.length > 0 && !generating && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 gradient-text" />
                <h2 className="font-display font-bold text-xl">
                  3 Solution Ideas
                </h2>
              </div>
              {!saved && (
                <motion.button
                  onClick={() => saveMutation.mutate()}
                  disabled={saveMutation.isPending}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="gradient-btn px-4 py-2 rounded-xl font-semibold text-white text-sm flex items-center gap-2"
                >
                  {saveMutation.isPending ? (
                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  Save Ideas
                </motion.button>
              )}
              {saved && (
                <span className="text-sm text-green-500 font-semibold flex items-center gap-1.5">
                  <span>✓</span> Saved
                </span>
              )}
            </div>

            <div className="grid gap-5">
              {ideas.map((idea, i) => {
                const score = Number(idea.feasibilityScore);
                const color = getFeasibilityColor(score);
                const label = getFeasibilityLabel(score);

                return (
                  <motion.div
                    key={String(idea.id)}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ y: -4, scale: 1.01 }}
                    className="glass-card rounded-3xl p-6 lg:p-8 card-hover"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 font-display font-black text-white text-sm gradient-btn">
                          {i + 1}
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-lg text-foreground leading-tight">
                            {idea.title}
                          </h3>
                          <span
                            className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full mt-1"
                            style={{ background: `${color}20`, color }}
                          >
                            {idea.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                      {idea.description}
                    </p>

                    {/* Feasibility score */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-foreground">
                          Feasibility Score
                        </span>
                        <span className="text-xs font-bold" style={{ color }}>
                          {score}/100 — {label}
                        </span>
                      </div>
                      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${score}%` }}
                          transition={{
                            delay: 0.3 + i * 0.15,
                            duration: 0.8,
                            ease: "easeOut",
                          }}
                          className="h-full rounded-full"
                          style={{ background: color }}
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
