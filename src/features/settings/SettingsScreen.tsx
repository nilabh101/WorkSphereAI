import { useState } from "react";
import { Zap, ChevronRight, Save } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { useStore } from "@/store";

const TIMEZONES = [
  "UTC-12:00","UTC-11:00","UTC-10:00","UTC-09:00","UTC-08:00 (PST)","UTC-07:00 (MST)",
  "UTC-06:00 (CST)","UTC-05:00 (EST)","UTC-04:00","UTC-03:00","UTC-02:00","UTC-01:00",
  "UTC+00:00 (GMT)","UTC+01:00 (CET)","UTC+02:00","UTC+03:00","UTC+04:00","UTC+05:00",
  "UTC+05:30 (IST)","UTC+06:00","UTC+07:00","UTC+08:00 (SGT)","UTC+09:00 (JST)",
  "UTC+09:30 (ACST)","UTC+10:00 (AEST)","UTC+11:00","UTC+12:00",
];

const INDUSTRIES = [
  "Healthcare","Finance & Banking","Manufacturing","Logistics & Supply Chain",
  "Retail","Technology","Education","Government","Energy & Utilities","Other",
];

export function SettingsScreen() {
  const { org, saveOrg } = useStore();

  const [tab, setTab] = useState("organization");
  const [form, setForm] = useState(org);
  const [saved, setSaved] = useState(false);

  function handleSave() {
    saveOrg(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const tabs = ["organization", "notifications", "security"];

  return (
    <div className="space-y-8">
      <SectionHeader title="Settings" subtitle="Configure your WorkSphere AI workspace" />

      {/* Tabs */}
      <div className="flex gap-0 border-b border-border">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-3 text-sm font-semibold capitalize border-b-2 -mb-px transition-all ${tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "organization" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Organization Details */}
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm space-y-5">
            <h3 className="font-semibold text-foreground">Organization Details</h3>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Organization Name</label>
              <input value={form.orgName} onChange={e => setForm(f => ({ ...f, orgName: e.target.value }))}
                placeholder="e.g. Acme Corporation"
                className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Industry</label>
              <select value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
                className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground">
                <option value="">Select industry…</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Headquarters</label>
              <input value={form.headquarters} onChange={e => setForm(f => ({ ...f, headquarters: e.target.value }))}
                placeholder="e.g. Bangalore, India"
                className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Time Zone</label>
              <select value={form.timezone} onChange={e => setForm(f => ({ ...f, timezone: e.target.value }))}
                className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground">
                {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
              </select>
            </div>

            <button onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm">
              <Save size={14} />
              {saved ? "Saved ✓" : "Save Changes"}
            </button>
          </div>

          {/* Feature Toggles */}
          <div className="space-y-5">
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <h3 className="font-semibold text-foreground mb-5">Feature Toggles</h3>
              <div className="space-y-4">
                {(
                  [
                    ["aiMonitoring",        "AI Fatigue Monitoring",        "Real-time AI fatigue risk detection across all teams"],
                    ["autoShiftOptimize",   "Automated Shift Optimization", "AI-generated schedule recommendations weekly"],
                    ["overtimeAlerts",      "Overtime Alerts",              "Alert managers when employees exceed 40h/week"],
                    ["complianceReports",   "Compliance Auto-reports",      "Automated quarter-end compliance report generation"],
                  ] as [keyof typeof form, string, string][]
                ).map(([key, label, desc]) => (
                  <div key={key} className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-foreground">{label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
                    </div>
                    <button
                      onClick={() => setForm(f => ({ ...f, [key]: !f[key as keyof typeof form] }))}
                      className={`w-11 h-6 rounded-full flex-shrink-0 flex items-center px-1 cursor-pointer transition-all duration-200 ${form[key as keyof typeof form] ? "bg-primary justify-end" : "bg-muted justify-start"}`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Plan banner */}
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30 rounded-2xl p-5 border border-indigo-200/60 dark:border-indigo-800/30">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center flex-shrink-0">
                  <Zap size={18} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">WorkSphere AI Pro</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    Your plan includes predictive analytics, advanced RBAC, API access, and priority support.
                  </p>
                  <button className="mt-3 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                    Manage subscription <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "notifications" && (
        <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
          <h3 className="font-semibold text-foreground mb-5">Notification Preferences</h3>
          <div className="space-y-4 max-w-lg">
            {[
              ["Leave approvals",   "Notify when a leave request is approved or rejected"],
              ["Fatigue alerts",    "Notify when an employee's fatigue score exceeds 70%"],
              ["Shift conflicts",   "Notify when a shift conflict is detected"],
              ["New employees",     "Notify when a new employee is added"],
            ].map(([label, desc]) => (
              <div key={label} className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0">
                <div>
                  <div className="text-sm font-semibold text-foreground">{label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
                </div>
                <button className="w-11 h-6 rounded-full bg-primary flex items-center justify-end px-1 cursor-pointer transition-all">
                  <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "security" && (
        <div className="bg-card rounded-2xl p-8 border border-border shadow-sm">
          <h3 className="font-semibold text-foreground mb-5">Security Settings</h3>
          <div className="space-y-5 max-w-lg">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Session Timeout</label>
              <select className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none text-foreground">
                <option>30 minutes</option>
                <option>1 hour</option>
                <option>4 hours</option>
                <option>8 hours</option>
                <option>Never</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Two-Factor Authentication</label>
              <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
                <div className="flex-1 text-sm text-muted-foreground">Adds an extra layer of security to all accounts.</div>
                <button className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-xl hover:bg-primary/90 transition-all">Enable 2FA</button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Audit Log Retention</label>
              <select className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none text-foreground">
                <option>30 days</option>
                <option>90 days</option>
                <option>1 year</option>
                <option>Unlimited</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
