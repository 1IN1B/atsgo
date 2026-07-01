"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Link2,
  Pencil,
  Trash2,
  Save,
  X,
  Loader2,
} from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import type { Candidate, CandidateStatus } from "@/lib/candidates";
import Link from "next/link";

const STATUS_OPTIONS: { value: CandidateStatus; label: string }[] = [
  { value: "applied", label: "Applied" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "interview_scheduled", label: "Interview Scheduled" },
  { value: "offered", label: "Offered" },
  { value: "rejected", label: "Rejected" },
];

const STATUS_COLOR: Record<CandidateStatus, string> = {
  applied: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  shortlisted: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  interview_scheduled: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  offered: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

export default function CandidateProfilePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [form, setForm] = useState<Partial<Candidate>>({});

  useEffect(() => {
    fetch(`/api/candidates/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { router.push("/dashboard/candidates"); return; }
        setCandidate(data);
        setForm(data);
        setLoading(false);
      });
  }, [id, router]);

  async function handleSave() {
    setSaving(true);
    const res = await fetch(`/api/candidates/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const updated = await res.json();
    setCandidate(updated);
    setForm(updated);
    setSaving(false);
    setEditing(false);
  }

  async function handleDelete() {
    if (!confirm(`Delete ${candidate?.name}? This cannot be undone.`)) return;
    setDeleting(true);
    await fetch(`/api/candidates/${id}`, { method: "DELETE" });
    router.push("/dashboard/candidates");
  }

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  if (!candidate) return null;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col flex-1 p-8 gap-6 max-w-3xl"
    >
      {/* Back */}
      <motion.div variants={fadeInUp}>
        <Link
          href="/dashboard/candidates"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Candidates
        </Link>
      </motion.div>

      {/* Header */}
      <motion.div variants={fadeInUp} className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold shrink-0">
            {candidate.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{candidate.name}</h1>
            <p className="text-zinc-500 text-sm mt-0.5">{candidate.email}</p>
            <span className={`inline-block mt-1.5 text-xs px-2.5 py-0.5 rounded-full font-medium ${STATUS_COLOR[candidate.status]}`}>
              {STATUS_OPTIONS.find(s => s.value === candidate.status)?.label}
            </span>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          {editing ? (
            <>
              <button
                id="save-candidate-btn"
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1.5 bg-primary text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                Save
              </button>
              <button
                onClick={() => { setEditing(false); setForm(candidate); }}
                className="flex items-center gap-1.5 border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 rounded-lg text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
            </>
          ) : (
            <>
              <button
                id="edit-candidate-btn"
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 rounded-lg text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" /> Edit
              </button>
              <button
                id="delete-candidate-btn"
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-1.5 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 px-3 py-1.5 rounded-lg text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </>
          )}
        </div>
      </motion.div>

      {/* Details Card */}
      <motion.div variants={fadeInUp} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 divide-y divide-zinc-100 dark:divide-zinc-800">

        {/* Contact */}
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1">Email</label>
            {editing ? (
              <input
                type="email"
                value={form.email ?? ""}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            ) : (
              <div className="flex items-center gap-1.5 text-sm">
                <Mail className="w-3.5 h-3.5 text-zinc-400" />
                <a href={`mailto:${candidate.email}`} className="hover:text-primary transition-colors">{candidate.email}</a>
              </div>
            )}
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1">Phone</label>
            {editing ? (
              <input
                type="tel"
                value={form.phone ?? ""}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Optional"
                className="w-full text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            ) : (
              <div className="flex items-center gap-1.5 text-sm text-zinc-500">
                <Phone className="w-3.5 h-3.5 text-zinc-400" />
                {candidate.phone || <span className="italic text-zinc-400">Not provided</span>}
              </div>
            )}
          </div>
        </div>

        {/* Status + Interview */}
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1">Status</label>
            {editing ? (
              <select
                value={form.status ?? candidate.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as CandidateStatus })}
                className="w-full text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            ) : (
              <div className="flex items-center gap-1.5 text-sm">
                <Briefcase className="w-3.5 h-3.5 text-zinc-400" />
                {STATUS_OPTIONS.find(s => s.value === candidate.status)?.label}
              </div>
            )}
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1">Interview Date</label>
            {editing ? (
              <input
                type="datetime-local"
                value={form.interviewAt ? form.interviewAt.slice(0, 16) : ""}
                onChange={(e) => setForm({ ...form, interviewAt: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                className="w-full text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            ) : (
              <div className="flex items-center gap-1.5 text-sm text-zinc-500">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                {candidate.interviewAt
                  ? new Date(candidate.interviewAt).toLocaleString()
                  : <span className="italic text-zinc-400">Not scheduled</span>}
              </div>
            )}
          </div>
        </div>

        {/* Meet Link */}
        {(candidate.meetLink || editing) && (
          <div className="p-5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1">Google Meet Link</label>
            {editing ? (
              <input
                type="url"
                value={form.meetLink ?? ""}
                onChange={(e) => setForm({ ...form, meetLink: e.target.value })}
                placeholder="https://meet.google.com/..."
                className="w-full text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            ) : (
              <a href={candidate.meetLink} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-primary hover:underline">
                <Link2 className="w-3.5 h-3.5" />
                {candidate.meetLink}
              </a>
            )}
          </div>
        )}

        {/* Skills */}
        <div className="p-5">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-2">Skills</label>
          {editing ? (
            <input
              type="text"
              value={(form.skills ?? []).join(", ")}
              onChange={(e) => setForm({ ...form, skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
              placeholder="React, TypeScript, Node.js..."
              className="w-full text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          ) : (
            <div className="flex gap-1.5 flex-wrap">
              {candidate.skills.length > 0
                ? candidate.skills.map((s) => (
                    <span key={s} className="text-xs bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full">{s}</span>
                  ))
                : <span className="text-sm text-zinc-400 italic">No skills listed</span>}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="p-5">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-2">Summary</label>
          {editing ? (
            <textarea
              value={form.summary ?? ""}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              placeholder="Brief summary of the candidate..."
              rows={3}
              className="w-full text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          ) : (
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {candidate.summary || <span className="italic text-zinc-400">No summary</span>}
            </p>
          )}
        </div>

        {/* Notes */}
        <div className="p-5">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-2">Recruiter Notes</label>
          {editing ? (
            <textarea
              value={form.notes ?? ""}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Internal notes..."
              rows={3}
              className="w-full text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          ) : (
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {candidate.notes || <span className="italic text-zinc-400">No notes</span>}
            </p>
          )}
        </div>

        {/* Meta */}
        <div className="p-5 flex gap-6 text-xs text-zinc-400">
          <span>Source: <span className="capitalize font-medium text-zinc-500">{candidate.source}</span></span>
          <span>Applied: <span className="font-medium text-zinc-500">{new Date(candidate.appliedAt).toLocaleDateString()}</span></span>
          {candidate.resumeFileName && (
            <span>Resume: <span className="font-medium text-zinc-500">{candidate.resumeFileName}</span></span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
