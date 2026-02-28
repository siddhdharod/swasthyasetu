import { useQuery } from "@tanstack/react-query";
import {
  BarChart2,
  Calendar,
  Database,
  ExternalLink,
  Filter,
  Search,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Dataset } from "../backend.d";
import { useActor } from "../hooks/useActor";

// External links for each dataset (real public resources)
const DATASET_LINKS: Record<string, string> = {
  "COVID-19 Clinical Outcomes":
    "https://www.who.int/emergencies/diseases/novel-coronavirus-2019/technical-guidance/early-investigations",
  "Heart Disease Risk Factors":
    "https://www.kaggle.com/datasets/fedesoriano/heart-failure-prediction",
  "Mental Health Survey 2023":
    "https://www.nimh.nih.gov/health/statistics/mental-illness",
  "Drug Interaction Database": "https://www.drugbank.com/",
  "Pediatric Growth Charts":
    "https://www.who.int/tools/child-growth-standards/standards",
  "Genomics Research Dataset": "https://www.ncbi.nlm.nih.gov/gap/",
};

const MOCK_DATASETS: Dataset[] = [
  {
    id: 1n,
    name: "COVID-19 Clinical Outcomes",
    description:
      "Comprehensive dataset of COVID-19 patient outcomes across 47 countries including ICU admissions, treatment protocols, and recovery trajectories. Includes anonymized patient demographics and comorbidities.",
    category: "Epidemiology",
    recordCount: 2400000n,
    lastUpdated: BigInt(new Date("2024-11-15").getTime()),
  },
  {
    id: 2n,
    name: "Heart Disease Risk Factors",
    description:
      "Longitudinal study data tracking cardiovascular risk factors across diverse populations. Covers dietary habits, physical activity, genetic markers, and clinical measurements over 15 years.",
    category: "Cardiology",
    recordCount: 890000n,
    lastUpdated: BigInt(new Date("2024-09-28").getTime()),
  },
  {
    id: 3n,
    name: "Mental Health Survey 2023",
    description:
      "National mental health survey data capturing anxiety, depression, PTSD prevalence and treatment outcomes. Includes demographic breakdowns and correlation with socioeconomic factors.",
    category: "Psychiatry",
    recordCount: 156000n,
    lastUpdated: BigInt(new Date("2024-01-10").getTime()),
  },
  {
    id: 4n,
    name: "Drug Interaction Database",
    description:
      "Curated database of known and predicted drug-drug interactions with clinical severity ratings, mechanisms of action, and evidence quality scores from peer-reviewed literature.",
    category: "Pharmacology",
    recordCount: 3100000n,
    lastUpdated: BigInt(new Date("2024-12-01").getTime()),
  },
  {
    id: 5n,
    name: "Pediatric Growth Charts",
    description:
      "WHO and CDC standardized growth chart data for children aged 0-18 years, segmented by gender, ethnicity, and geographic region. Updated with latest global health metrics.",
    category: "Pediatrics",
    recordCount: 445000n,
    lastUpdated: BigInt(new Date("2024-06-20").getTime()),
  },
  {
    id: 6n,
    name: "Genomics Research Dataset",
    description:
      "Whole genome sequencing data from diverse patient populations with associated phenotypic data. Includes variant calling results and GWAS findings for 120+ common diseases.",
    category: "Genomics",
    recordCount: 78000n,
    lastUpdated: BigInt(new Date("2024-10-05").getTime()),
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Epidemiology: "#FF7AAE",
  Cardiology: "#ef4444",
  Psychiatry: "#A259FF",
  Pharmacology: "#00FFFF",
  Pediatrics: "#f59e0b",
  Genomics: "#22c55e",
};

const ALL_CATEGORIES = ["All", ...Object.keys(CATEGORY_COLORS)];

function formatRecordCount(count: bigint): string {
  const n = Number(count);
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return String(n);
}

function formatDate(ts: bigint): string {
  return new Date(Number(ts)).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function DataSandbox() {
  const { actor, isFetching } = useActor();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const { data: datasets = [] } = useQuery<Dataset[]>({
    queryKey: ["datasets"],
    queryFn: async () => {
      if (!actor) return MOCK_DATASETS;
      try {
        const result = await actor.listDatasets();
        return result.length > 0 ? result : MOCK_DATASETS;
      } catch {
        return MOCK_DATASETS;
      }
    },
    enabled: !!actor && !isFetching,
    placeholderData: MOCK_DATASETS,
  });

  const displayDatasets = datasets.length > 0 ? datasets : MOCK_DATASETS;

  const filtered = displayDatasets.filter((d) => {
    const matchSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory =
      activeCategory === "All" || d.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Database className="w-3.5 h-3.5 gradient-text" />
          <span className="overline-label gradient-text">Data Sandbox</span>
        </div>
        <h1 className="font-display font-black text-3xl lg:text-4xl tracking-tight">
          Healthcare <span className="gradient-text">Data Sandbox</span>
        </h1>
        <p
          className="text-sm mt-1.5"
          style={{ color: "oklch(var(--muted-foreground))" }}
        >
          Explore curated healthcare datasets for research, analysis, and AI
          model training.
        </p>
      </motion.div>

      {/* Search + Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="glass-card rounded-2xl p-4 space-y-4"
      >
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search datasets..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-transparent text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          {ALL_CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeCategory === cat
                  ? "gradient-btn text-white shadow-sm"
                  : "glass-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Results count */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <BarChart2 className="w-4 h-4" />
        <span>
          Showing{" "}
          <span className="font-semibold text-foreground">
            {filtered.length}
          </span>{" "}
          of {displayDatasets.length} datasets
        </span>
      </div>

      {/* Dataset grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground glass-card rounded-2xl">
          <Database className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No datasets match your search</p>
          <p className="text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((dataset, i) => {
            const color = CATEGORY_COLORS[dataset.category] ?? "#A259FF";
            return (
              <motion.div
                key={String(dataset.id)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="glass-card rounded-3xl p-5 card-hover flex flex-col"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}20` }}
                  >
                    <Database className="w-5 h-5" style={{ color }} />
                  </div>
                  <span
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: `${color}20`, color }}
                  >
                    {dataset.category}
                  </span>
                </div>

                <h3 className="font-display font-bold text-base text-foreground mb-2 leading-tight">
                  {dataset.name}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 flex-1 mb-4">
                  {dataset.description}
                </p>

                {/* Meta */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <BarChart2 className="w-3 h-3" />
                      Records
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      {formatRecordCount(dataset.recordCount)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Updated
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      {formatDate(dataset.lastUpdated)}
                    </span>
                  </div>
                </div>

                <a
                  href={DATASET_LINKS[dataset.name] ?? "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full gradient-btn py-2.5 rounded-xl font-semibold text-white text-sm flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Explore Dataset
                </a>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
