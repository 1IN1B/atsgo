"use client";

import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;
  if (!session) return null;

  return (
    <div className="flex flex-col flex-1 p-8">
      <h1 className="text-2xl font-bold">Welcome back, {session.user?.name}</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Your dashboard is ready. Start by adding candidates or creating job postings.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col gap-2">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">Candidates</span>
          <span className="text-3xl font-bold">0</span>
        </div>
        <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col gap-2">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">Active Jobs</span>
          <span className="text-3xl font-bold">0</span>
        </div>
        <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col gap-2">
          <span className="text-sm text-zinc-600 dark:text-zinc-400">Applications</span>
          <span className="text-3xl font-bold">0</span>
        </div>
      </div>
    </div>
  );
}
