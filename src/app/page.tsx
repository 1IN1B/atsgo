import Link from "next/link";
import { ArrowRight, Users, BarChart3, Zap, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0a0a0a]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="font-semibold text-lg">ATSGO</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-foreground transition-colors">
            Log in
          </Link>
          <Link href="/signup" className="text-sm bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors">
            Sign up
          </Link>
        </div>
      </nav>

      <main className="flex flex-col flex-1">
        <section className="flex flex-col items-center text-center px-6 py-24 md:py-36 bg-gradient-to-b from-primary/5 to-transparent">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl">
            Hire faster. <span className="text-primary">Hire smarter.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
            ATSGO is the applicant tracking system that streamlines your entire hiring pipeline — from posting jobs to onboarding new hires.
          </p>
          <div className="mt-10 flex gap-4">
            <Link href="/signup" className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors text-base font-medium">
              Get started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/login" className="text-base font-medium px-6 py-3 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
              Log in
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 py-20 max-w-5xl mx-auto w-full">
          <div className="flex flex-col gap-3 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Candidate Pipeline</h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
              Track every candidate from application to offer. Never lose track of a promising applicant.
            </p>
          </div>
          <div className="flex flex-col gap-3 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Analytics & Insights</h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
              Measure hiring velocity, source quality, and pipeline health with real-time dashboards.
            </p>
          </div>
          <div className="flex flex-col gap-3 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-lg">Automated Workflows</h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
              Automate screening, scheduling, and communication so your team focuses on what matters.
            </p>
          </div>
        </section>

        <section className="flex flex-col items-center text-center px-6 py-20 bg-zinc-50 dark:bg-zinc-900/50">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">Secure by default</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400 max-w-xl">
            Your candidate data is encrypted, access-controlled, and compliant with hiring regulations.
          </p>
        </section>

        <section className="flex flex-col items-center text-center px-6 py-20">
          <h2 className="text-2xl md:text-3xl font-bold">Ready to transform your hiring?</h2>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400 max-w-xl">
            Join teams who have cut their time-to-hire by 40%.
          </p>
          <Link href="/signup" className="mt-8 flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-hover transition-colors font-medium">
            Start for free <ArrowRight className="w-4 h-4" />
          </Link>
        </section>
      </main>

      <footer className="flex items-center justify-center px-6 py-6 border-t border-zinc-200 dark:border-zinc-800 text-sm text-zinc-500">
        &copy; 2026 ATSGO. All rights reserved.
      </footer>
    </div>
  );
}
