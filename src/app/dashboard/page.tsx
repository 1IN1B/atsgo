"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return null;
  if (!session) return null;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col flex-1 p-8"
    >
      <motion.h1 variants={fadeInUp} className="text-2xl font-bold">
        Welcome back, {session.user?.name}
      </motion.h1>
      <motion.p variants={fadeInUp} className="mt-2 text-zinc-600 dark:text-zinc-400">
        Your dashboard is ready. Start by adding candidates or creating job postings.
      </motion.p>

      <motion.div variants={staggerContainer} className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Candidates", value: "0" },
          { label: "Active Jobs", value: "0" },
          { label: "Applications", value: "0" },
        ].map((card) => (
          <motion.div
            key={card.label}
            variants={fadeInUp}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 flex flex-col gap-2"
          >
            <span className="text-sm text-zinc-600 dark:text-zinc-400">{card.label}</span>
            <span className="text-3xl font-bold">{card.value}</span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
