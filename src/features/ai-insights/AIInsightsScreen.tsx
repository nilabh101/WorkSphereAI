import { Users, AlertTriangle, Zap, CheckCircle, AlertCircle, Brain } from "lucide-react";
import { Badge } from "@/components/shared/Badge";
import { KpiCard } from "@/components/shared/KpiCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { aiInsights } from "@/data";

export function AIInsightsScreen() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="AI Recommendation Center"
        subtitle="Explainable AI-driven workforce insights and optimization actions"
        action={
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Model updated 2h ago
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <KpiCard icon={Users} label="Employees Analyzed" value="1,247" color="indigo" />
        <KpiCard icon={AlertTriangle} label="High Risk Detected" value="23" color="rose" />
        <KpiCard icon={Zap} label="Actions Recommended" value="47" color="amber" />
      </div>

      <div className="space-y-5">
        {aiInsights.map(insight => (
          <div key={insight.id} className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start gap-5">
              {/* Avatar */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold flex-shrink-0 ${
                insight.riskLevel === "high" ? "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400" :
                insight.riskLevel === "medium" ? "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400" :
                "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
              }`}>
                {insight.avatar}
              </div>

              <div className="flex-1 min-w-0">
                {/* Header row */}
                <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                  <div>
                    <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                      <h3 className="font-bold text-foreground text-base">{insight.employee}</h3>
                      <Badge variant={insight.riskLevel === "high" ? "danger" : insight.riskLevel === "medium" ? "warning" : "success"}>
                        {insight.riskLevel.toUpperCase()} RISK
                      </Badge>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span
                        className="text-3xl font-black"
                        style={{ color: insight.riskLevel === "high" ? "#F43F5E" : insight.riskLevel === "medium" ? "#F59E0B" : "#10B981" }}
                      >
                        {insight.riskPct}%
                      </span>
                      <span className="text-sm text-muted-foreground">fatigue risk probability</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-sm">
                      Apply Recommendation
                    </button>
                    <button className="px-4 py-2 border border-border text-sm font-semibold rounded-xl hover:bg-muted/50 transition-all">
                      Dismiss
                    </button>
                  </div>
                </div>

                {/* Risk progress bar */}
                <div className="h-2 bg-muted rounded-full mb-5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${insight.riskPct}%`,
                      background: insight.riskLevel === "high" ? "#F43F5E" : insight.riskLevel === "medium" ? "#F59E0B" : "#10B981",
                    }}
                  />
                </div>

                {/* Three columns */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Risk Factors */}
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5">Risk Factors</h4>
                    <ul className="space-y-2">
                      {insight.factors.map(f => (
                        <li key={f} className="flex items-start gap-2 text-sm">
                          <AlertCircle size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground leading-snug">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* AI Recommendation */}
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5">AI Recommendation</h4>
                    <div className="p-3.5 bg-indigo-50/80 dark:bg-indigo-950/30 rounded-xl border border-indigo-200/60 dark:border-indigo-800/30">
                      <div className="flex items-start gap-2">
                        <Brain size={14} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-indigo-800 dark:text-indigo-300 leading-relaxed">{insight.recommendation}</p>
                      </div>
                    </div>
                  </div>

                  {/* Safer Replacements */}
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5">Safer Replacements</h4>
                    <div className="space-y-2">
                      {insight.replacements.map(r => (
                        <div key={r} className="flex items-center gap-2.5 p-2.5 bg-emerald-50/80 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/60 dark:border-emerald-800/30">
                          <CheckCircle size={13} className="text-emerald-500 flex-shrink-0" />
                          <span className="text-sm text-emerald-800 dark:text-emerald-300">{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
