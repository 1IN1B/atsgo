"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, Briefcase, CalendarCheck, TrendingUp, Clock, UserCheck, XCircle } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import type { Candidate } from "@/lib/candidates";
import Link from "next/link";

const STATUS_LABEL: Record<string, string> = {
  applied: "Applied",
  shortlisted: "Shortlisted",
  interview_scheduled: "Interview",
  offered: "Offered",
  rejected: "Rejected",
};

const STATUS_COLOR: Record<string, string> = {
  applied: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  shortlisted: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  interview_scheduled: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  offered: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

function daysAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

export default function DashboardPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/candidates")
      .then((r) => r.json())
      .then((data) => {
        setCandidates(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  const total = candidates.length;
  const shortlisted = candidates.filter((c) => c.status === "shortlisted").length;
  const interviews = candidates.filter((c) => c.status === "interview_scheduled").length;
  const offered = candidates.filter((c) => c.status === "offered").length;
  const rejected = candidates.filter((c) => c.status === "rejected").length;

  // Interviews this week
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const interviewsThisWeek = candidates.filter(
    (c) => c.status === "interview_scheduled" && c.interviewAt && new Date(c.interviewAt) >= weekStart
  ).length;

  const stats = [
    { label: "Total Candidates", value: total, icon: Users, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Shortlisted", value: shortlisted, icon: UserCheck, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { label: "Interviews This Week", value: interviewsThisWeek, icon: CalendarCheck, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
    { label: "Offers Extended", value: offered, icon: TrendingUp, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
  ];

  const recent = candidates.slice(0, 8);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col flex-1 p-8 gap-8"
    >
      {/* Header */}
      <motion.div variants={fadeInUp}>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Overview of your hiring pipeline
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={staggerContainer} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              variants={fadeInUp}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col gap-3"
            >
              <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div>
                <div className="text-3xl font-bold">
                  {loading ? <span className="animate-pulse text-zinc-300">—</span> : stat.value}
                </div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{stat.label}</div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Pipeline summary bar */}
      {!loading && total > 0 && (
        <motion.div variants={fadeInUp} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
          <p className="text-sm font-medium mb-3">Pipeline Health</p>
          <div className="flex rounded-full overflow-hidden h-3 gap-0.5">
            {[
              { status: "applied", count: candidates.filter(c => c.status === "applied").length, color: "bg-blue-400" },
              { status: "shortlisted", count: shortlisted, color: "bg-amber-400" },
              { status: "interview_scheduled", count: interviews, color: "bg-purple-400" },
              { status: "offered", count: offered, color: "bg-green-400" },
              { status: "rejected", count: rejected, color: "bg-red-400" },
            ].filter(s => s.count > 0).map(s => (
              <div
                key={s.status}
                className={`${s.color} transition-all`}
                style={{ flex: s.count }}
                title={`${STATUS_LABEL[s.status]}: ${s.count}`}
              />
            ))}
          </div>
          <div className="flex gap-4 mt-2 flex-wrap">
            {[
              { label: "Applied", count: candidates.filter(c => c.status === "applied").length, color: "bg-blue-400" },
              { label: "Shortlisted", count: shortlisted, color: "bg-amber-400" },
              { label: "Interview", count: interviews, color: "bg-purple-400" },
              { label: "Offered", count: offered, color: "bg-green-400" },
              { label: "Rejected", count: rejected, color: "bg-red-400" },
            ].map(s => (
              <div key={s.label} className="flex items-center gap-1.5 text-xs text-zinc-500">
                <div className={`w-2 h-2 rounded-full ${s.color}`} />
                {s.label} ({s.count})
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent Candidates */}
      <motion.div variants={fadeInUp} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800">
          <p className="font-medium text-sm">Recent Candidates</p>
          <Link href="/dashboard/candidates" className="text-xs text-primary hover:underline">
            View all
          </Link>
        </div>
        {loading ? (
          <div className="p-8 text-center text-zinc-400 text-sm animate-pulse">Loading...</div>
        ) : recent.length === 0 ? (
          <div className="p-8 text-center text-zinc-400 text-sm">
            No candidates yet.{" "}
            <Link href="/dashboard/candidates" className="text-primary hover:underline">
              Add your first candidate →
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {recent.map((c) => (
              <Link
                key={c.id}
                href={`/dashboard/candidates/${c.id}`}
                className="flex items-center justify-between px-5 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold shrink-0">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{c.name}</p>
                    <p className="text-xs text-zinc-500">{c.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLOR[c.status]}`}>
                    {STATUS_LABEL[c.status]}
                  </span>
                  <span className="text-xs text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {daysAgo(c.appliedAt)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
