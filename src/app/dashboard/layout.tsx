"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";

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
        <div className="text-zinc-400 text-sm">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-zinc-400 text-sm">Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 h-screen overflow-hidden">
      <aside
        className={`flex flex-col bg-sidebar-bg text-sidebar-text transition-all duration-200 ${
          collapsed ? "w-16" : "w-56"
        }`}
      >
        <div className="flex items-center gap-2 px-4 py-4 h-14 border-b border-sidebar-hover">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          {!collapsed && <span className="font-semibold text-lg">ATSGO</span>}
        </div>

        <nav className="flex flex-col gap-1 px-2 py-4 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-hover transition-colors text-sm ${
                  collapsed ? "justify-center" : ""
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-hover px-2 py-3">
          <div className={`flex items-center gap-3 px-3 py-2 ${collapsed ? "justify-center" : ""}`}>
            <div className="w-8 h-8 rounded-full bg-sidebar-hover flex items-center justify-center shrink-0 text-xs font-medium">
              {session.user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm truncate">{session.user?.name}</span>
                <span className="text-xs text-zinc-500 truncate">{session.user?.email}</span>
              </div>
            )}
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-hover transition-colors text-sm w-full mt-1 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && <span>Log out</span>}
          </button>
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center py-2 hover:bg-sidebar-hover transition-colors border-t border-sidebar-hover"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </aside>

      <main className="flex flex-col flex-1 overflow-auto bg-white dark:bg-[#0a0a0a]">
        {children}
      </main>
    </div>
  );
}
