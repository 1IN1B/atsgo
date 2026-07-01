"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import type { Candidate, CandidateStatus } from "@/lib/candidates";
import { Calendar, Clock, ExternalLink } from "lucide-react";
import Link from "next/link";

const COLUMNS: { status: CandidateStatus; label: string; color: string; dot: string }[] = [
  { status: "applied", label: "Applied", color: "border-t-blue-400", dot: "bg-blue-400" },
  { status: "shortlisted", label: "Shortlisted", color: "border-t-amber-400", dot: "bg-amber-400" },
  { status: "interview_scheduled", label: "Interview", color: "border-t-purple-400", dot: "bg-purple-400" },
  { status: "offered", label: "Offered", color: "border-t-green-400", dot: "bg-green-400" },
  { status: "rejected", label: "Rejected", color: "border-t-red-400", dot: "bg-red-400" },
];

function daysInStage(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "1 day";
  return `${days} days`;
}

interface InterviewModalProps {
  candidate: Candidate;
  onConfirm: (interviewAt: string) => void;
  onClose: () => void;
}

function InterviewModal({ candidate, onConfirm, onClose }: InterviewModalProps) {
  const [datetime, setDatetime] = useState("");
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-6 w-full max-w-sm"
      >
        <h3 className="text-lg font-semibold mb-1">Schedule Interview</h3>
        <p className="text-sm text-zinc-500 mb-4">
          Set a date & time for <strong>{candidate.name}</strong>. n8n will create the Google Meet and send the invite.
        </p>
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1">
          Interview Date & Time
        </label>
        <input
          id="interview-datetime-input"
          type="datetime-local"
          value={datetime}
          onChange={(e) => setDatetime(e.target.value)}
          className="w-full text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/30 mb-4"
        />
        <div className="flex gap-2">
          <button
            id="confirm-interview-btn"
            onClick={() => { if (datetime) onConfirm(new Date(datetime).toISOString()); }}
            disabled={!datetime}
            className="flex-1 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-40"
          >
            <Calendar className="w-4 h-4 inline mr-1.5" />
            Confirm & Notify
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function PipelinePage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<CandidateStatus | null>(null);
  const [interviewModal, setInterviewModal] = useState<Candidate | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const dragCandidate = useRef<Candidate | null>(null);

  const load = () =>
    fetch("/api/candidates")
      .then((r) => r.json())
      .then((data) => {
        setCandidates(Array.isArray(data) ? data : []);
        setLoading(false);
      });

  useEffect(() => { load(); }, []);

  async function moveCandidate(candidate: Candidate, newStatus: CandidateStatus) {
    if (candidate.status === newStatus) return;

    if (newStatus === "interview_scheduled") {
      setInterviewModal(candidate);
      return;
    }

    setUpdating(candidate.id);
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidate.id ? { ...c, status: newStatus } : c))
    );

    await fetch(`/api/candidates/${candidate.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setUpdating(null);
  }

  async function confirmInterview(interviewAt: string) {
    if (!interviewModal) return;
    const candidate = interviewModal;
    setInterviewModal(null);
    setUpdating(candidate.id);
    setCandidates((prev) =>
      prev.map((c) =>
        c.id === candidate.id ? { ...c, status: "interview_scheduled", interviewAt } : c
      )
    );
    await fetch(`/api/candidates/${candidate.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "interview_scheduled", interviewAt }),
    });
    setUpdating(null);
  }

  const byStatus = (status: CandidateStatus) =>
    candidates.filter((c) => c.status === status);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col flex-1 p-8 gap-6 min-h-0"
    >
      <motion.div variants={fadeInUp}>
        <h1 className="text-2xl font-bold">Pipeline</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Drag candidates between stages to trigger automations
        </p>
      </motion.div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center text-zinc-400 text-sm animate-pulse">
          Loading pipeline...
        </div>
      ) : (
        <motion.div
          variants={fadeInUp}
          className="flex gap-4 flex-1 overflow-x-auto pb-4"
        >
          {COLUMNS.map((col) => {
            const cards = byStatus(col.status);
            const isOver = dragOverCol === col.status;
            return (
              <div
                key={col.status}
                id={`pipeline-col-${col.status}`}
                onDragOver={(e) => { e.preventDefault(); setDragOverCol(col.status); }}
                onDragLeave={() => setDragOverCol(null)}
                onDrop={async () => {
                  setDragOverCol(null);
                  if (dragCandidate.current) {
                    await moveCandidate(dragCandidate.current, col.status);
                    dragCandidate.current = null;
                    setDraggingId(null);
                  }
                }}
                className={`flex flex-col gap-3 min-w-60 w-60 shrink-0 rounded-xl border-t-4 ${col.color} border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-3 transition-all ${
                  isOver ? "ring-2 ring-primary/30 bg-primary/5" : ""
                }`}
              >
                {/* Column header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${col.dot}`} />
                    <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 uppercase tracking-wide">
                      {col.label}
                    </span>
                  </div>
                  <span className="text-xs text-zinc-400 bg-zinc-200 dark:bg-zinc-800 px-1.5 py-0.5 rounded-full">
                    {cards.length}
                  </span>
                </div>

                {/* Cards */}
                <div className="flex flex-col gap-2 flex-1">
                  <AnimatePresence>
                    {cards.map((c) => (
                      <motion.div
                        key={c.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: updating === c.id ? 0.5 : 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        draggable
                        onDragStart={() => {
                          setDraggingId(c.id);
                          dragCandidate.current = c;
                        }}
                        onDragEnd={() => {
                          if (draggingId === c.id) setDraggingId(null);
                        }}
                        className={`bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-3 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow ${
                          draggingId === c.id ? "opacity-40 rotate-1" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">{c.name}</p>
                          </div>
                        </div>

                        {c.skills.length > 0 && (
                          <div className="flex gap-1 flex-wrap mb-2">
                            {c.skills.slice(0, 2).map((s) => (
                              <span key={s} className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-full">
                                {s}
                              </span>
                            ))}
                            {c.skills.length > 2 && (
                              <span className="text-xs text-zinc-400">+{c.skills.length - 2}</span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-zinc-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {daysInStage(c.appliedAt)}
                          </span>
                          <Link
                            href={`/dashboard/candidates/${c.id}`}
                            className="text-zinc-400 hover:text-primary transition-colors"
                            title="View profile"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        </div>

                        {c.interviewAt && c.status === "interview_scheduled" && (
                          <div className="mt-2 text-xs text-purple-600 dark:text-purple-400 flex items-center gap-1 bg-purple-50 dark:bg-purple-900/20 px-2 py-1 rounded-lg">
                            <Calendar className="w-3 h-3" />
                            {new Date(c.interviewAt).toLocaleDateString()}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {cards.length === 0 && (
                    <div className={`flex-1 min-h-20 rounded-lg border-2 border-dashed transition-colors ${
                      isOver ? "border-primary/40 bg-primary/5" : "border-zinc-200 dark:border-zinc-700"
                    } flex items-center justify-center text-xs text-zinc-400`}>
                      Drop here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </motion.div>
      )}

      <AnimatePresence>
        {interviewModal && (
          <InterviewModal
            candidate={interviewModal}
            onConfirm={confirmInterview}
            onClose={() => setInterviewModal(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
