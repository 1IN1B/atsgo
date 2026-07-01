"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Loader2, Briefcase, Users } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import type { Job } from "@/lib/jobs";

interface JobForm {
  title: string;
  department: string;
  description: string;
  status: "open" | "closed";
}

const EMPTY_FORM: JobForm = { title: "", department: "", description: "", status: "open" };

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [form, setForm] = useState<JobForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [candidateCounts, setCandidateCounts] = useState<Record<string, number>>({});

  const load = async () => {
    const [jobsRes, candidatesRes] = await Promise.all([
      fetch("/api/jobs").then((r) => r.json()),
      fetch("/api/candidates").then((r) => r.json()),
    ]);
    const jobsData: Job[] = Array.isArray(jobsRes) ? jobsRes : [];
    const candidatesData = Array.isArray(candidatesRes) ? candidatesRes : [];
    setJobs(jobsData);

    const counts: Record<string, number> = {};
    for (const c of candidatesData) {
      if (c.jobId) counts[c.jobId] = (counts[c.jobId] ?? 0) + 1;
    }
    setCandidateCounts(counts);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditingJob(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  }

  function openEdit(job: Job) {
    setEditingJob(job);
    setForm({
      title: job.title,
      department: job.department ?? "",
      description: job.description ?? "",
      status: job.status,
    });
    setShowModal(true);
  }

  async function handleSave() {
    if (!form.title.trim()) return;
    setSaving(true);
    if (editingJob) {
      const res = await fetch(`/api/jobs/${editingJob.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const updated = await res.json();
      setJobs((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
    } else {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const created = await res.json();
      setJobs((prev) => [created, ...prev]);
    }
    setSaving(false);
    setShowModal(false);
  }

  async function handleDelete(job: Job) {
    if (!confirm(`Delete "${job.title}"? This cannot be undone.`)) return;
    await fetch(`/api/jobs/${job.id}`, { method: "DELETE" });
    setJobs((prev) => prev.filter((j) => j.id !== job.id));
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col flex-1 p-8 gap-6"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Jobs</h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            {jobs.filter(j => j.status === "open").length} open position{jobs.filter(j => j.status === "open").length !== 1 ? "s" : ""}
          </p>
        </div>
        <motion.button
          id="new-job-btn"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openCreate}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Job
        </motion.button>
      </motion.div>

      {/* Jobs list */}
      <motion.div variants={fadeInUp} className="flex flex-col gap-3">
        {loading ? (
          <div className="text-center py-12 text-zinc-400 text-sm animate-pulse">Loading...</div>
        ) : jobs.length === 0 ? (
          <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-12 text-center">
            <Briefcase className="w-10 h-10 mx-auto text-zinc-300 mb-3" />
            <p className="text-zinc-500 text-sm">No jobs yet. Create your first position.</p>
            <button onClick={openCreate} className="mt-4 text-primary text-sm hover:underline">
              Create job →
            </button>
          </div>
        ) : (
          jobs.map((job) => (
            <motion.div
              key={job.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2, transition: { duration: 0.15 } }}
              className="flex items-center justify-between p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold truncate">{job.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                      job.status === "open"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                        : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800"
                    }`}>
                      {job.status === "open" ? "Open" : "Closed"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    {job.department && (
                      <p className="text-xs text-zinc-400">{job.department}</p>
                    )}
                    <p className="text-xs text-zinc-400 flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {candidateCounts[job.id] ?? 0} candidate{(candidateCounts[job.id] ?? 0) !== 1 ? "s" : ""}
                    </p>
                  </div>
                  {job.description && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-1">{job.description}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openEdit(job)}
                  className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-zinc-500"
                  title="Edit"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(job)}
                  className="p-2 rounded-lg border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-500"
                  title="Delete"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* Create / Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold">{editingJob ? "Edit Job" : "New Job"}</h2>
                <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1">Job Title *</label>
                  <input
                    id="job-title-input"
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1">Department</label>
                  <input
                    type="text"
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    placeholder="e.g. Engineering"
                    className="w-full text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Brief role description..."
                    rows={3}
                    className="w-full text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as "open" | "closed" })}
                    className="w-full text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 mt-6">
                <motion.button
                  id="save-job-btn"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={handleSave}
                  disabled={saving || !form.title.trim()}
                  className="flex-1 bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {editingJob ? "Save Changes" : "Create Job"}
                </motion.button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg text-sm border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
