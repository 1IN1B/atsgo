"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  BarChart3,
  Settings,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Users, label: "Candidates", href: "/dashboard/candidates" },
  { icon: Briefcase, label: "Jobs", href: "/dashboard/jobs" },
  { icon: FileText, label: "Applications", href: "/dashboard/applications" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/analytics" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [collapsed, setCollapsed] = useState(false);

  if (status === "loading") {
    return (
      <div className="flex flex-1 items-center justify-center">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-zinc-400 text-sm"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-zinc-400 text-sm"
        >
          Redirecting...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 h-screen overflow-hidden">
      <motion.aside
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1, width: collapsed ? 64 : 224 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex flex-col bg-sidebar-bg text-sidebar-text"
      >
        <div className="flex items-center gap-2 px-4 py-4 h-14 border-b border-sidebar-hover">
          <motion.div whileHover={{ scale: 1.05, rotate: 5 }} className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">A</span>
          </motion.div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="font-semibold text-lg overflow-hidden whitespace-nowrap"
              >
                ATSGO
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <motion.nav
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-1 px-2 py-4 flex-1"
        >
          {navItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div key={item.href} variants={fadeInUp} custom={i}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-hover transition-colors text-sm ${
                    collapsed ? "justify-center" : ""
                  }`}
                >
                  <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
                    <Icon className="w-4 h-4 shrink-0" />
                  </motion.div>
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </motion.div>
            );
          })}
        </motion.nav>

        <div className="border-t border-sidebar-hover px-2 py-3">
          <div className={`flex items-center gap-3 px-3 py-2 ${collapsed ? "justify-center" : ""}`}>
            <motion.div whileHover={{ scale: 1.1 }} className="w-8 h-8 rounded-full bg-sidebar-hover flex items-center justify-center shrink-0 text-xs font-medium">
              {session.user?.name?.charAt(0).toUpperCase() || "U"}
            </motion.div>
            <AnimatePresence>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "auto" }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col min-w-0 overflow-hidden"
                >
                  <span className="text-sm truncate">{session.user?.name}</span>
                  <span className="text-xs text-zinc-500 truncate">{session.user?.email}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <motion.button
            onClick={() => signOut({ callbackUrl: "/login" })}
            whileHover={{ scale: 1.02, x: 2 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-hover transition-colors text-sm w-full mt-1 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  Log out
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        <motion.button
          onClick={() => setCollapsed(!collapsed)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.8 }}
          className="flex items-center justify-center py-2 hover:bg-sidebar-hover transition-colors border-t border-sidebar-hover"
        >
          <motion.div
            animate={{ rotate: collapsed ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        </motion.button>
      </motion.aside>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="flex flex-col flex-1 overflow-auto bg-white dark:bg-[#0a0a0a]"
      >
        {children}
      </motion.main>
    </div>
  );
}
