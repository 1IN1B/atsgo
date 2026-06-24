"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      window.location.href = "/dashboard";
    }
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center px-6 py-12">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="w-full max-w-sm"
      >
        <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-8">
          <motion.div whileHover={{ scale: 1.05 }} className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </motion.div>
          <span className="font-semibold text-lg">ATSGO</span>
        </motion.div>

        <motion.h1 variants={fadeInUp} className="text-2xl font-bold">Log in to your account</motion.h1>
        <motion.p variants={fadeInUp} className="mt-2 text-zinc-600 dark:text-zinc-400 text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </motion.p>

        <motion.form variants={fadeInUp} onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="px-4 py-3 rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div variants={fadeInUp} className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <motion.input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              whileFocus={{ scale: 1.01, borderColor: "var(--primary)" }}
              className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              placeholder="you@company.com"
            />
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <div className="relative">
              <motion.input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                whileFocus={{ scale: 1.01 }}
                className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary pr-10"
                placeholder="Enter your password"
              />
              <motion.button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </motion.button>
            </div>
          </motion.div>

          <motion.button
            variants={fadeInUp}
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-2 w-full bg-primary text-white px-4 py-2.5 rounded-lg hover:bg-primary-hover transition-colors text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Log in"}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}
