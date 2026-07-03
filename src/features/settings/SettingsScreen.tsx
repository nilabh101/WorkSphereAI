import { useState } from "react";
import { Settings, Zap, ChevronRight } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";

export function SettingsScreen() {
  const [tab, setTab] = useState("organization");
  const [toggles, setToggles] = useState([true, true, true, false]);
  const tabs = ["organization", "profile", "notifications", "integrations", "security"];

  return (
    <div className="space-y-8">
      <SectionHeader title="Settings" />

      {/* Tabs */}
      <div className="flex gap-0 border-b border-border">
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-3 text-sm font-semibold capitalize border-b-2 -mb-px transition-all ${tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "organization" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Organization Details */}
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm space-y-5">
            <h3 className="font-semibold text-foreground">Organization Details</h3>
            {[
              ["Organization Name", "Acme Corporation"],
              ["Industry", "Healthcare & Logistics"],
              ["Employee Count", "1,247"],
              ["Headquarters", "Sydney, NSW, Australia"],
              ["Time Zone", "UTC+10:00 (AEST)"],
            ].map(([label, value]) => (
              <div key={label}>
                <label className="block text-sm font-semibold text-foreground mb-1.5">{label}</label>
                <input
                  defaultValue={value}
                  className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
                />
              </div>
            ))}
            <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm">
              Save Changes
            </button>
          </div>

          <div className="space-y-5">
            {/* Feature Toggles */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <h3 className="font-semibold text-foreground mb-5">Feature Toggles</h3>
              <div className="space-y-4">
                {[
                  ["AI Fatigue Monitoring", "Real-time AI fatigue risk detection across all teams"],
                  ["Automated Shift Optimization", "AI-generated schedule recommendations weekly"],
                  ["Overtime Alerts", "Alert managers when employees exceed 40h/week"],
                  ["Compliance Auto-reports", "Automated Q-end compliance report generation"],
                ].map(([label, desc], i) => (
                  <div key={label} className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-foreground">{label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
                    </div>
                    <button
                      onClick={() => setToggles(t => t.map((v, j) => j === i ? !v : v))}
                      className={`w-11 h-6 rounded-full flex-shrink-0 flex items-center px-1 cursor-pointer transition-all duration-200 ${toggles[i] ? "bg-primary justify-end" : "bg-muted justify-start"}`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm transition-all" />
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
      ) : (
        <div className="bg-card rounded-2xl p-16 border border-border shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Settings size={24} className="text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-2 capitalize">{tab} Settings</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            This section is fully available in the production version of WorkSphere AI.
          </p>
          <button className="mt-5 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all">
            Request Access
          </button>
        </div>
      )}
    </div>
  );
}
