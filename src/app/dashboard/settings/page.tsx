"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Loader2, Webhook, Building2, Mail, CheckCircle } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

interface Settings {
  n8nResumeWebhookUrl: string;
  n8nOutboundWebhookUrl: string;
  companyName: string;
  recruiterEmail: string;
}

const DEFAULTS: Settings = {
  n8nResumeWebhookUrl: "",
  n8nOutboundWebhookUrl: "",
  companyName: "",
  recruiterEmail: "",
};

const STORAGE_KEY = "atsgo_settings";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try { setSettings(JSON.parse(stored)); } catch {}
    }
  }, []);

  function handleSave() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col flex-1 p-8 gap-6 max-w-2xl"
    >
      <motion.div variants={fadeInUp}>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Configure n8n webhooks and company details
        </p>
      </motion.div>

      {/* n8n Webhooks */}
      <motion.div variants={fadeInUp} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
          <Webhook className="w-4 h-4 text-primary" />
          <p className="font-semibold text-sm">n8n Webhooks</p>
        </div>
        <div className="p-5 flex flex-col gap-5">
          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1">
              Resume Upload Webhook URL
            </label>
            <p className="text-xs text-zinc-400 mb-2">
              ATSGO forwards uploaded PDFs here. n8n parses them with GPT-4o-mini and creates the candidate profile.
            </p>
            <input
              id="n8n-resume-webhook-input"
              type="url"
              value={settings.n8nResumeWebhookUrl}
              onChange={(e) => setSettings({ ...settings, n8nResumeWebhookUrl: e.target.value })}
              placeholder="https://your-n8n-instance.com/webhook/..."
              className="w-full text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1">
              Outbound Events Webhook URL
            </label>
            <p className="text-xs text-zinc-400 mb-2">
              ATSGO sends events here when a candidate is shortlisted or an interview is scheduled.
            </p>
            <input
              id="n8n-outbound-webhook-input"
              type="url"
              value={settings.n8nOutboundWebhookUrl}
              onChange={(e) => setSettings({ ...settings, n8nOutboundWebhookUrl: e.target.value })}
              placeholder="https://your-n8n-instance.com/webhook/..."
              className="w-full text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono"
            />
          </div>

          <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-3 text-xs text-amber-700 dark:text-amber-400">
            <strong>Note:</strong> These URLs are saved locally in your browser. To make them permanent, add them to your{" "}
            <code className="bg-amber-100 dark:bg-amber-900/40 px-1 py-0.5 rounded">.env.local</code> file as{" "}
            <code className="bg-amber-100 dark:bg-amber-900/40 px-1 py-0.5 rounded">N8N_RESUME_WEBHOOK_URL</code> and{" "}
            <code className="bg-amber-100 dark:bg-amber-900/40 px-1 py-0.5 rounded">N8N_OUTBOUND_WEBHOOK_URL</code>.
          </div>
        </div>
      </motion.div>

      {/* Company */}
      <motion.div variants={fadeInUp} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
          <Building2 className="w-4 h-4 text-primary" />
          <p className="font-semibold text-sm">Company Details</p>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1">
              Company Name
            </label>
            <p className="text-xs text-zinc-400 mb-2">Used in automated emails sent by n8n.</p>
            <input
              id="company-name-input"
              type="text"
              value={settings.companyName}
              onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
              placeholder="Acme Inc"
              className="w-full text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide block mb-1">
              Recruiter Email
            </label>
            <p className="text-xs text-zinc-400 mb-2">CC&apos;d on interview calendar invites.</p>
            <input
              id="recruiter-email-input"
              type="email"
              value={settings.recruiterEmail}
              onChange={(e) => setSettings({ ...settings, recruiterEmail: e.target.value })}
              placeholder="recruiter@company.com"
              className="w-full text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 bg-transparent focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>
      </motion.div>

      {/* n8n Payload Reference */}
      <motion.div variants={fadeInUp} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50">
          <Mail className="w-4 h-4 text-primary" />
          <p className="font-semibold text-sm">Webhook Payload Reference</p>
        </div>
        <div className="p-5 flex flex-col gap-4 text-xs">
          <div>
            <p className="font-semibold text-zinc-500 mb-1">candidate.shortlisted</p>
            <pre className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3 overflow-x-auto text-zinc-600 dark:text-zinc-300">{`{
  "event": "candidate.shortlisted",
  "payload": {
    "id": "uuid",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "status": "shortlisted",
    ...candidate fields
  },
  "timestamp": "2026-07-01T..."
}`}</pre>
          </div>
          <div>
            <p className="font-semibold text-zinc-500 mb-1">candidate.interview_scheduled</p>
            <pre className="bg-zinc-50 dark:bg-zinc-800 rounded-lg p-3 overflow-x-auto text-zinc-600 dark:text-zinc-300">{`{
  "event": "candidate.interview_scheduled",
  "payload": {
    "id": "uuid",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "interviewAt": "2026-07-10T10:00:00Z",
    "status": "interview_scheduled",
    ...candidate fields
  },
  "timestamp": "2026-07-01T..."
}`}</pre>
          </div>
        </div>
      </motion.div>

      {/* Save */}
      <motion.div variants={fadeInUp} className="flex items-center gap-3">
        <motion.button
          id="save-settings-btn"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleSave}
          className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Settings
        </motion.button>
        {saved && (
          <motion.span
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5 text-sm text-green-600 dark:text-green-400"
          >
            <CheckCircle className="w-4 h-4" />
            Saved!
          </motion.span>
        )}
      </motion.div>
    </motion.div>
  );
}
