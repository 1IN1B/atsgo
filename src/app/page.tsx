"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Users, BarChart3, Zap, Shield } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a]"
      >
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center"
          >
            <span className="text-white font-bold text-sm">A</span>
          </motion.div>
          <span className="font-semibold text-lg">ATSGO</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-foreground transition-colors">
            Log in
          </Link>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link href="/signup" className="text-sm bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors">
              Sign up
            </Link>
          </motion.div>
        </div>
      </motion.nav>

      <main className="flex flex-col flex-1">
        <motion.section
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center px-6 py-24 md:py-36 bg-gradient-to-b from-primary/5 to-transparent"
        >
          <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl">
            Hire faster. <span className="text-primary">Hire smarter.</span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="mt-6 text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
            ATSGO is the applicant tracking system that streamlines your entire hiring pipeline — from posting jobs to onboarding new hires.
          </motion.p>
          <motion.div variants={fadeInUp} className="mt-10 flex gap-4">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link href="/signup" className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors text-base font-medium">
                Get started <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link href="/login" className="text-base font-medium px-6 py-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                Log in
              </Link>
            </motion.div>
          </motion.div>
        </motion.section>

        <motion.section
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 py-20 max-w-5xl mx-auto w-full"
        >
          {[
            { icon: Users, title: "Candidate Pipeline", desc: "Track every candidate from application to offer. Never lose track of a promising applicant." },
            { icon: BarChart3, title: "Analytics & Insights", desc: "Measure hiring velocity, source quality, and pipeline health with real-time dashboards." },
            { icon: Zap, title: "Automated Workflows", desc: "Automate screening, scheduling, and communication so your team focuses on what matters." },
          ].map((item) => (
            <motion.div
              key={item.title}
              variants={fadeInUp}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="flex flex-col gap-3 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.section>

        <motion.section
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="flex flex-col items-center text-center px-6 py-20 bg-zinc-50 dark:bg-zinc-900/50"
        >
          <motion.div variants={fadeInUp} whileHover={{ scale: 1.1, rotate: 5 }} className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
            <Shield className="w-5 h-5 text-primary" />
          </motion.div>
          <motion.h2 variants={fadeInUp} className="text-2xl md:text-3xl font-bold">Secure by default</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 text-zinc-600 dark:text-zinc-400 max-w-xl">
            Your candidate data is encrypted, access-controlled, and compliant with hiring regulations.
          </motion.p>
        </motion.section>

        <motion.section
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="flex flex-col items-center text-center px-6 py-20"
        >
          <motion.h2 variants={fadeInUp} className="text-2xl md:text-3xl font-bold">Ready to transform your hiring?</motion.h2>
          <motion.p variants={fadeInUp} className="mt-4 text-zinc-600 dark:text-zinc-400 max-w-xl">
            Join teams who have cut their time-to-hire by 40%.
          </motion.p>
          <motion.div variants={fadeInUp} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="mt-8">
            <Link href="/signup" className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors font-medium">
              Start for free <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </motion.section>
      </main>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        className="flex items-center justify-center px-6 py-6 border-t border-zinc-200 dark:border-zinc-800 text-sm text-zinc-500"
      >
        &copy; 2026 ATSGO. All rights reserved.
      </motion.footer>
    </div>
  );
}
