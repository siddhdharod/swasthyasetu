import {
  Bot,
  ChevronRight,
  MessageSquare,
  Plus,
  Send,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

// ── Types ────────────────────────────────────────────────────────────────────
interface LocalMessage {
  id: string;
  content: string;
  author: string;
  timestamp: number;
  threadId: string;
}

interface LocalThread {
  id: string;
  title: string;
  problemId: string;
  messages: LocalMessage[];
}

// ── localStorage helpers ─────────────────────────────────────────────────────
const LS_KEY = "openhealth_collab_threads";

function loadThreads(): LocalThread[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as LocalThread[];
  } catch {}
  return SEED_THREADS;
}

function saveThreads(threads: LocalThread[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(threads));
  } catch {}
}

// ── Seed data (used only when localStorage is empty) ─────────────────────────
const SEED_THREADS: LocalThread[] = [
  {
    id: "1",
    title: "AI Solutions for Drug Interaction Safety",
    problemId: "1",
    messages: [
      {
        id: "m1",
        content:
          "I think we should focus on natural language processing to extract drug mentions from clinical notes.",
        author: "Dr. Emily Chen",
        timestamp: Date.now() - 3600000,
        threadId: "1",
      },
      {
        id: "m2",
        content:
          "Great idea! We could combine that with a graph database of known interactions.",
        author: "James Rodriguez",
        timestamp: Date.now() - 1800000,
        threadId: "1",
      },
    ],
  },
  {
    id: "2",
    title: "Reducing ICU Patient Deterioration",
    problemId: "2",
    messages: [
      {
        id: "m3",
        content:
          "Continuous monitoring combined with ML could give us 4-6 hours of advance warning.",
        author: "Dr. Sarah Kim",
        timestamp: Date.now() - 7200000,
        threadId: "2",
      },
    ],
  },
  {
    id: "3",
    title: "Mental Health Digital Therapeutics",
    problemId: "3",
    messages: [],
  },
];

const MOCK_PROBLEMS = [
  { id: "1", title: "Early Sepsis Detection" },
  { id: "2", title: "Medication Adherence" },
  { id: "3", title: "Emergency Wait Times" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────
function getAISummary(thread: LocalThread): string {
  if (thread.messages.length === 0) {
    return "No messages yet. Start the conversation to get an AI-generated summary.";
  }
  return `AI Summary: This thread explores "${thread.title}" with ${thread.messages.length} contribution${thread.messages.length !== 1 ? "s" : ""}. Key themes include leveraging machine learning and clinical data integration. Contributors have proposed technology-forward approaches with potential for high clinical impact. Recommended next steps: prototype development and clinical validation study.`;
}

function formatTime(ts: number): string {
  if (ts > Date.now() - 86400000) {
    return new Date(ts).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return new Date(ts).toLocaleDateString();
}

// ── Component ────────────────────────────────────────────────────────────────
export default function Collaboration() {
  const { user } = useAuth();
  const [threads, setThreads] = useState<LocalThread[]>(loadThreads);
  const [selectedThreadId, setSelectedThreadId] = useState<string>("1");
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showNewThread, setShowNewThread] = useState(false);
  const [newThreadTitle, setNewThreadTitle] = useState("");
  const [newThreadProblem, setNewThreadProblem] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Persist every time threads change
  useEffect(() => {
    saveThreads(threads);
  }, [threads]);

  // Sync across tabs / "other users" by polling localStorage every 2 s
  useEffect(() => {
    const interval = setInterval(() => {
      setThreads(loadThreads());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const selectedThread = threads.find((t) => t.id === selectedThreadId) ?? null;

  // Scroll to bottom when messages change
  const messageCount = selectedThread?.messages.length ?? 0;
  // biome-ignore lint/correctness/useExhaustiveDependencies: scroll on message change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageCount]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    const msg: LocalMessage = {
      id: `${Date.now()}-${Math.random()}`,
      content: newMessage.trim(),
      author: user?.name ?? "Anonymous",
      timestamp: Date.now(),
      threadId: selectedThreadId,
    };

    setThreads((prev) => {
      const updated = prev.map((t) =>
        t.id === selectedThreadId
          ? { ...t, messages: [...t.messages, msg] }
          : t,
      );
      saveThreads(updated);
      return updated;
    });

    setNewMessage("");
    setIsSending(false);
    toast.success("Thought shared!");
  };

  const handleCreateThread = () => {
    if (!newThreadTitle.trim()) return;
    const thread: LocalThread = {
      id: `${Date.now()}`,
      title: newThreadTitle.trim(),
      problemId: newThreadProblem || "1",
      messages: [],
    };
    setThreads((prev) => {
      const updated = [...prev, thread];
      saveThreads(updated);
      return updated;
    });
    setSelectedThreadId(thread.id);
    toast.success("Thread created!");
    setShowNewThread(false);
    setNewThreadTitle("");
    setNewThreadProblem("");
  };

  return (
    <div className="space-y-6 h-full max-w-6xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-3.5 h-3.5 gradient-text" />
              <span className="overline-label gradient-text">
                Collaboration Hub
              </span>
            </div>
            <h1 className="font-display font-black text-3xl lg:text-4xl tracking-tight">
              <span className="gradient-text">Collaboration</span> Hub
            </h1>
          </div>
          <button
            type="button"
            onClick={() => setShowNewThread(true)}
            className="gradient-btn px-4 py-2.5 rounded-xl font-semibold text-white text-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Thread
          </button>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="grid lg:grid-cols-3 gap-4 h-[calc(100vh-280px)] min-h-[500px]">
        {/* Thread list */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="glass-card rounded-2xl overflow-hidden flex flex-col"
        >
          <div className="p-4 border-b border-border/50">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 gradient-text" />
              <h2 className="font-semibold text-sm">
                Threads ({threads.length})
              </h2>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {threads.map((thread) => (
              <button
                type="button"
                key={thread.id}
                onClick={() => setSelectedThreadId(thread.id)}
                className={`w-full text-left p-4 border-b border-border/30 transition-all hover:bg-white/10 ${
                  selectedThreadId === thread.id
                    ? "bg-white/15 border-l-2 border-l-primary"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {thread.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {thread.messages.length} messages
                    </p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 mt-1" />
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Chat area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="lg:col-span-2 flex flex-col gap-3"
        >
          {selectedThread ? (
            <>
              {/* AI Summary */}
              <div className="glass-card rounded-2xl p-4 border border-primary/20 flex-shrink-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-lg gradient-btn flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-xs font-semibold gradient-text">
                    AI Thread Summary
                  </span>
                  <Sparkles className="w-3 h-3 gradient-text" />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {getAISummary(selectedThread)}
                </p>
              </div>

              {/* Messages */}
              <div className="glass-card rounded-2xl flex-1 flex flex-col overflow-hidden min-h-0">
                <div className="p-4 border-b border-border/50 flex-shrink-0">
                  <h3 className="font-semibold text-sm truncate">
                    {selectedThread.title}
                  </h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {selectedThread.messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full py-12 text-muted-foreground">
                      <MessageSquare className="w-10 h-10 mb-2 opacity-30" />
                      <p className="text-sm">
                        No messages yet. Start the discussion!
                      </p>
                    </div>
                  ) : (
                    selectedThread.messages.map((msg, i) => {
                      const isOwn = msg.author === (user?.name ?? "Anonymous");
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.03 }}
                          className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[75%] ${isOwn ? "items-end" : "items-start"} flex flex-col gap-1`}
                          >
                            {!isOwn && (
                              <span className="text-xs text-muted-foreground ml-1">
                                {msg.author}
                              </span>
                            )}
                            <div
                              className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                isOwn
                                  ? "gradient-btn text-white rounded-br-sm"
                                  : "glass-card rounded-bl-sm text-foreground"
                              }`}
                            >
                              {msg.content}
                            </div>
                            <span className="text-xs text-muted-foreground/60 mx-1">
                              {formatTime(msg.timestamp)}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message input */}
                <form
                  onSubmit={handleSend}
                  className="p-4 border-t border-border/50 flex gap-2 flex-shrink-0"
                >
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Share your thoughts..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-transparent text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || isSending}
                    className="gradient-btn p-2.5 rounded-xl text-white disabled:opacity-50"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="glass-card rounded-2xl flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Select a thread to start collaborating</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* New Thread Modal */}
      <AnimatePresence>
        {showNewThread && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowNewThread(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 flex items-center justify-center z-50 px-4"
            >
              <div className="glass-card rounded-3xl p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-display font-bold text-xl gradient-text">
                    New Thread
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowNewThread(false)}
                    className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="thread-title"
                      className="block text-sm font-medium mb-1.5"
                    >
                      Thread Title
                    </label>
                    <input
                      id="thread-title"
                      type="text"
                      value={newThreadTitle}
                      onChange={(e) => setNewThreadTitle(e.target.value)}
                      placeholder="e.g., Solutions for AI-Assisted Diagnosis"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-transparent text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="thread-problem"
                      className="block text-sm font-medium mb-1.5"
                    >
                      Related Problem (optional)
                    </label>
                    <select
                      id="thread-problem"
                      value={newThreadProblem}
                      onChange={(e) => setNewThreadProblem(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value="">No specific problem</option>
                      {MOCK_PROBLEMS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowNewThread(false)}
                      className="flex-1 py-2.5 rounded-xl glass-card text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleCreateThread}
                      disabled={!newThreadTitle.trim()}
                      className="flex-1 gradient-btn py-2.5 rounded-xl font-semibold text-white text-sm disabled:opacity-50"
                    >
                      Create Thread
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
