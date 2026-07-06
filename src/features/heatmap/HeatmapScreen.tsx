import { useMemo } from "react";
import { AlertTriangle, Map } from "lucide-react";
import { Badge } from "@/components/shared/Badge";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { useStore } from "@/store";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function cellStyle(v: number) {
  if (v >= 85) return "bg-rose-500 text-white";
  if (v >= 70) return "bg-orange-400 text-white";
  if (v >= 55) return "bg-amber-400 text-white";
  if (v >= 35) return "bg-emerald-400 text-white";
  return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200";
}

export function HeatmapScreen() {
  const { employees, shifts } = useStore();

  // Build heatmap from real shift + fatigue data
  const heatmapData = useMemo(() => {
    const deptMap: Record<string, string[]> = {};
    employees.forEach(e => {
      if (!deptMap[e.dept]) deptMap[e.dept] = [];
      deptMap[e.dept].push(e.id);
    });

    return Object.entries(deptMap).map(([team, empIds]) => {
      const row: Record<string, string | number> = { team };

      DAYS.forEach(day => {
        const dayShifts   = shifts.filter(s => s.day === day && empIds.includes(s.employeeId));
        const teamEmps    = employees.filter(e => empIds.includes(e.id));
        const avgFatigue  = teamEmps.length > 0
          ? Math.round(teamEmps.reduce((sum, e) => sum + e.fatigue, 0) / teamEmps.length)
          : 0;
        // Workload = blend of shift coverage and avg fatigue
        const coverage    = empIds.length > 0 ? Math.round((dayShifts.length / empIds.length) * 100) : 0;
        const workload    = Math.round((avgFatigue * 0.6) + (coverage * 0.4));
        row[day]          = Math.min(100, workload);
      });

      return row as { team: string } & Record<string, number>;
    });
  }, [employees, shifts]);

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Workforce Heatmap"
        subtitle="Team workload intensity derived from fatigue scores and shift coverage"
      />

      {employees.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-16 text-center">
          <Map size={32} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm font-semibold text-foreground">No data to display</p>
          <p className="text-xs text-muted-foreground mt-1">Add employees and assign shifts to see workload intensity by department.</p>
        </div>
      ) : (
        <>
          {/* Heatmap grid */}
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm overflow-x-auto">
            <h3 className="font-semibold text-foreground mb-5">Weekly Workload Intensity by Department</h3>
            <div className="min-w-[640px]">
              <div className="grid grid-cols-8 gap-2 mb-3">
                <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Team</div>
                {DAYS.map(d => (
                  <div key={d} className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">{d}</div>
                ))}
              </div>
              {heatmapData.map(row => (
                <div key={row.team} className="grid grid-cols-8 gap-2 mb-2">
                  <div className="text-sm font-semibold text-foreground flex items-center pr-3 truncate">{row.team}</div>
                  {DAYS.map(day => {
                    const val = row[day as keyof typeof row] as number;
                    return (
                      <div
                        key={day}
                        className={`${cellStyle(val)} h-12 rounded-xl flex items-center justify-center text-xs font-bold cursor-default hover:opacity-85 transition-opacity`}
                        title={`${row.team} — ${day}: ${val}% workload`}
                      >
                        {val}%
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Intensity legend */}
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-semibold text-muted-foreground">Intensity:</span>
            {([
              ["bg-emerald-100 dark:bg-emerald-900/40", "Low (<35%)"],
              ["bg-emerald-400",  "Moderate (35–54%)"],
              ["bg-amber-400",    "High (55–69%)"],
              ["bg-orange-400",   "Very High (70–84%)"],
              ["bg-rose-500",     "Critical (85%+)"],
            ] as [string, string][]).map(([c, l]) => (
              <div key={l} className="flex items-center gap-1.5">
                <div className={`w-3.5 h-3.5 rounded-sm ${c}`} />
                <span className="text-xs text-muted-foreground">{l}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Most overloaded */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <h3 className="font-semibold text-foreground mb-5">Most Overloaded Departments (Weekday Avg)</h3>
              <div className="space-y-4">
                {heatmapData
                  .map(row => ({ team: row.team, avg: Math.round((row.Mon + row.Tue + row.Wed + row.Thu + row.Fri) / 5) }))
                  .sort((a, b) => b.avg - a.avg)
                  .map(item => (
                    <div key={item.team} className="flex items-center gap-3">
                      <span className="text-sm font-medium text-foreground w-28 flex-shrink-0 truncate">{item.team}</span>
                      <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${item.avg >= 75 ? "bg-rose-500" : item.avg >= 60 ? "bg-amber-400" : "bg-emerald-400"}`}
                          style={{ width: `${item.avg}%` }}
                        />
                      </div>
                      <span className={`text-sm font-bold w-10 text-right ${item.avg >= 75 ? "text-rose-600" : item.avg >= 60 ? "text-amber-600" : "text-emerald-600"}`}>
                        {item.avg}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Weekend staffing gaps */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <h3 className="font-semibold text-foreground mb-5">Weekend Staffing Gaps</h3>
              {heatmapData.filter(row => {
                const weekdayAvg = (row.Mon + row.Tue) / 2;
                const weekendAvg = (row.Sat + row.Sun) / 2;
                return weekdayAvg - weekendAvg > 15;
              }).length === 0 ? (
                <p className="text-sm text-muted-foreground">No significant weekend staffing gaps detected.</p>
              ) : (
                <div className="space-y-3">
                  {heatmapData
                    .map(row => ({ team: row.team, gap: Math.round(((row.Mon + row.Tue) / 2) - ((row.Sat + row.Sun) / 2)) }))
                    .filter(r => r.gap > 15)
                    .sort((a, b) => b.gap - a.gap)
                    .map(item => (
                      <div key={item.team} className="flex items-center gap-3 p-3.5 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200/60 dark:border-amber-800/30">
                        <AlertTriangle size={15} className="text-amber-500 flex-shrink-0" />
                        <span className="text-sm font-semibold text-foreground flex-1">{item.team}</span>
                        <Badge variant="warning">−{item.gap}% weekend</Badge>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
