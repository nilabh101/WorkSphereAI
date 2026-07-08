import { useState, useMemo } from "react";
import { Users, AlertTriangle, Zap, CheckCircle, AlertCircle, Brain } from "lucide-react";
import { Badge } from "@/components/shared/Badge";
import { KpiCard } from "@/components/shared/KpiCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { useStore } from "@/store";

// ─── Derive AI insights from real employee data ────────────────────────────────
function buildInsights(employees: ReturnType<typeof useStore>["employees"]) {
  return employees
    .filter(e => e.fatigue >= 50)
    .sort((a, b) => b.fatigue - a.fatigue)
    .map(emp => {
      const risk = emp.fatigue >= 80 ? "high" : emp.fatigue >= 65 ? "medium" : "low";
      const factors: string[] = [];
      if (emp.fatigue >= 80) factors.push("Critical fatigue index detected");
      if (emp.shifts > 20)   factors.push(`${emp.shifts} shifts this month — above threshold`);
      if (emp.wellness < 50) factors.push(`Low wellness score (${emp.wellness}/100)`);
      if (emp.attendance < 90) factors.push(`Below-average attendance (${emp.attendance}%)`);
      if (emp.shift === "Night") factors.push("Night shift pattern — circadian disruption risk");
      if (factors.length === 0) factors.push("Elevated workload detected");

      const recommendation =
        risk === "high"
          ? `Immediately reduce ${emp.name.split(" ")[0]}'s upcoming shifts. Schedule mandatory rest day and wellness consultation.`
          : `Monitor ${emp.name.split(" ")[0]}'s schedule. Consider redistributing workload this week.`;

      const replacements = employees
        .filter(e2 => e2.id !== emp.id && e2.dept === emp.dept && e2.fatigue < emp.fatigue - 15)
        .slice(0, 2)
        .map(e2 => `${e2.name} — Fatigue: ${e2.fatigue}%`);

      return {
        id:     `ins-${emp.id}`,
        employee: emp.name,
        avatar: emp.avatar || "??",
        riskLevel: risk as "low" | "medium" | "high",
        riskPct: emp.fatigue,
        factors,
        recommendation,
        replacements,
        confidence: Math.min(98, 60 + emp.fatigue * 0.4),
      };
    });
}

export function AIInsightsScreen() {
  const { employees, editEmployee, addNotification, addAuditLog } = useStore();
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [applied,   setApplied]   = useState<Set<string>>(new Set());

  const allInsights = useMemo(() => buildInsights(employees), [employees]);
  const insights    = allInsights.filter(i => !dismissed.has(i.id));

  const highRisk = insights.filter(i => i.riskLevel === "high").length;
  const actions  = insights.length;

  function dismiss(id: string) {
    setDismissed(prev => new Set([...prev, id]));
  }

  function applyRec(id: string) {
    setApplied(prev => new Set([...prev, id]));
    // Find the employee and actually update their fatigue/wellness scores
    const insight = allInsights.find(i => i.id === id);
    if (!insight) return;
    const emp = employees.find(e => e.name === insight.employee);
    if (!emp) return;
    // Applying the recommendation: reduce fatigue by 20-25pts, boost wellness by 10pts
    const newFatigue  = Math.max(0, emp.fatigue - (insight.riskLevel === "high" ? 25 : 18));
    const newWellness = Math.min(100, emp.wellness + 10);
    editEmployee(emp.id, { fatigue: newFatigue, wellness: newWellness, shift: "Day" });
    addNotification({
      title: "AI Recommendation Applied",
      message: `${emp.name}'s shifts have been adjusted. Fatigue reduced from ${emp.fatigue}% → ${newFatigue}%. Wellness boosted to ${newWellness}%.`,
      type: "success",
      priority: "medium",
    });
    addAuditLog({
      user: "AI System",
      action: "Applied AI Recommendation",
      target: `${emp.name} — fatigue reduced to ${newFatigue}%`,
      type: "ai",
      ip: "system",
    });
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="AI Recommendation Center"
        subtitle="Explainable AI-driven workforce insights derived from real employee data"
        action={
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Live from employee data
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <KpiCard icon={Users}         label="Employees Analyzed"  value={employees.length}  color="indigo" />
        <KpiCard icon={AlertTriangle} label="High Risk Detected"  value={highRisk}           color="rose" />
        <KpiCard icon={Zap}           label="Actions Recommended" value={actions}            color="amber" />
      </div>

      {employees.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-16 text-center">
          <Brain size={32} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm font-semibold text-foreground">No employee data yet</p>
          <p className="text-xs text-muted-foreground mt-1">Add employees via the Employee Profiles screen. AI insights are generated automatically based on fatigue and workload data.</p>
        </div>
      ) : insights.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-16 text-center">
          <CheckCircle size={32} className="text-emerald-400 mx-auto mb-3" />
          <p className="text-sm font-semibold text-foreground">All employees are within safe thresholds</p>
          <p className="text-xs text-muted-foreground mt-1">No employees currently have a fatigue score above 50%. Great work!</p>
        </div>
      ) : (
        <div className="space-y-5">
          {insights.map(insight => (
            <div key={insight.id} className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start gap-5">
                {/* Avatar */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold flex-shrink-0 ${
                  insight.riskLevel === "high"   ? "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400" :
                  insight.riskLevel === "medium" ? "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400" :
                                                   "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
                }`}>
                  {insight.avatar}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                    <div>
                      <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                        <h3 className="font-bold text-foreground text-base">{insight.employee}</h3>
                        <Badge variant={insight.riskLevel === "high" ? "danger" : insight.riskLevel === "medium" ? "warning" : "success"}>
                          {insight.riskLevel.toUpperCase()} RISK
                        </Badge>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black" style={{ color: insight.riskLevel === "high" ? "#F43F5E" : insight.riskLevel === "medium" ? "#F59E0B" : "#10B981" }}>
                          {insight.riskPct}%
                        </span>
                        <span className="text-sm text-muted-foreground">fatigue score</span>
                        <span className="text-xs text-muted-foreground">· {Math.round(insight.confidence)}% model confidence</span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {applied.has(insight.id) ? (
                        <span className="flex items-center gap-1.5 px-4 py-2 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-sm font-semibold rounded-xl">
                          <CheckCircle size={13} /> Applied
                        </span>
                      ) : (
                        <button onClick={() => applyRec(insight.id)}
                          className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-sm">
                          Apply Recommendation
                        </button>
                      )}
                      <button onClick={() => dismiss(insight.id)}
                        className="px-4 py-2 border border-border text-sm font-semibold rounded-xl hover:bg-muted/50 transition-all">
                        Dismiss
                      </button>
                    </div>
                  </div>

                  {/* Risk bar */}
                  <ProgressBar value={insight.riskPct} color="auto" className="mb-5" />

                  {/* Three columns */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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

                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5">AI Recommendation</h4>
                      <div className="p-3.5 bg-indigo-50/80 dark:bg-indigo-950/30 rounded-xl border border-indigo-200/60 dark:border-indigo-800/30">
                        <div className="flex items-start gap-2">
                          <Brain size={14} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-indigo-800 dark:text-indigo-300 leading-relaxed">{insight.recommendation}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2.5">Safer Replacements</h4>
                      {insight.replacements.length > 0 ? (
                        <div className="space-y-2">
                          {insight.replacements.map(r => (
                            <div key={r} className="flex items-center gap-2.5 p-2.5 bg-emerald-50/80 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/60 dark:border-emerald-800/30">
                              <CheckCircle size={13} className="text-emerald-500 flex-shrink-0" />
                              <span className="text-sm text-emerald-800 dark:text-emerald-300">{r}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">No lower-fatigue colleagues in same department.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
