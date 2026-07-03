import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, AlertTriangle } from "lucide-react";
import { Avatar } from "@/components/shared/Avatar";
import { Badge } from "@/components/shared/Badge";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { employees, shifts } from "@/data";

export function ShiftPlannerScreen() {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dates = [5, 6, 7, 8, 9, 10, 11];

  const shiftStyles: Record<string, string> = {
    morning: "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800/50",
    day: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/50",
    evening: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/50",
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Shift Planner"
        subtitle="Week of August 5 – 11, 2024"
        action={
          <div className="flex items-center gap-2.5">
            <button className="flex items-center gap-1.5 px-3 py-2.5 bg-card border border-border rounded-xl text-sm hover:bg-muted/50">
              <ChevronLeft size={14} /> Prev
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2.5 bg-card border border-border rounded-xl text-sm hover:bg-muted/50">
              Next <ChevronRight size={14} />
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm hover:bg-primary/90 transition-all">
              <Plus size={14} /> Add shift
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Calendar grid */}
        <div className="xl:col-span-3 bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-8 border-b border-border bg-muted/30">
            <div className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Employee</div>
            {days.map((day, i) => (
              <div
                key={day}
                onClick={() => setSelectedDay(day === selectedDay ? null : day)}
                className={`p-3 text-center border-l border-border cursor-pointer transition-colors select-none ${selectedDay === day ? "bg-primary/8 dark:bg-primary/10" : "hover:bg-muted/50"}`}
              >
                <div className="text-xs font-semibold text-muted-foreground uppercase">{day}</div>
                <div className={`text-xl font-bold mt-0.5 ${selectedDay === day ? "text-primary" : "text-foreground"}`}>{dates[i]}</div>
              </div>
            ))}
          </div>

          {/* Employee rows */}
          {employees.map(emp => (
            <div key={emp.id} className="grid grid-cols-8 border-b border-border last:border-b-0">
              <div className="p-3 flex items-center gap-2.5 border-r border-border">
                <Avatar initials={emp.avatar} size="sm" color={emp.fatigue > 75 ? "rose" : emp.fatigue > 55 ? "amber" : "indigo"} />
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-foreground truncate">{emp.name.split(" ")[0]}</div>
                  <div className="text-xs text-muted-foreground truncate">{emp.dept}</div>
                </div>
              </div>
              {days.map(day => {
                const shift = shifts.find(s => s.employee === emp.name && s.day === day);
                return (
                  <div key={day} className={`p-1.5 border-l border-border flex items-center justify-center min-h-[64px] ${selectedDay === day ? "bg-primary/5 dark:bg-primary/8" : ""}`}>
                    {shift ? (
                      <div className={`w-full px-2 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer hover:opacity-80 transition-opacity ${shiftStyles[shift.type]} ${shift.conflict ? "ring-2 ring-rose-400/60 ring-offset-1" : ""}`}>
                        <div className="truncate leading-tight">{shift.start}–{shift.end}</div>
                        {shift.conflict && (
                          <div className="flex items-center gap-0.5 text-rose-600 dark:text-rose-400 mt-0.5">
                            <AlertTriangle size={9} /> Conflict
                          </div>
                        )}
                      </div>
                    ) : (
                      <button className="w-full h-10 rounded-xl border border-dashed border-border/40 text-muted-foreground/30 hover:border-primary/40 hover:text-primary/40 transition-all text-xl leading-none">
                        +
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Availability */}
          <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
            <h3 className="font-semibold text-foreground text-sm mb-4">Employee Availability</h3>
            <div className="space-y-3">
              {employees.map(emp => (
                <div key={emp.id} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-foreground">{emp.name.split(" ")[0]} {emp.name.split(" ")[1]?.[0]}.</span>
                    <span className={`text-xs font-bold ${emp.fatigue > 75 ? "text-rose-600" : emp.fatigue > 55 ? "text-amber-600" : "text-emerald-600"}`}>
                      {emp.fatigue}%
                    </span>
                  </div>
                  <ProgressBar value={emp.fatigue} color="auto" />
                </div>
              ))}
            </div>
          </div>

          {/* Conflict Alerts */}
          <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground text-sm">Conflict Alerts</h3>
              <Badge variant="danger">{shifts.filter(s => s.conflict).length}</Badge>
            </div>
            <div className="space-y-2.5">
              {shifts.filter(s => s.conflict).map(s => (
                <div key={s.id} className="p-3 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200/70 dark:border-rose-800/30">
                  <div className="flex items-start gap-2">
                    <AlertTriangle size={13} className="text-rose-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-xs font-semibold text-rose-700 dark:text-rose-400">{s.employee}</div>
                      <div className="text-xs text-rose-600/70 dark:text-rose-500/60">{s.day}: {s.start}–{s.end}</div>
                    </div>
                  </div>
                  <button className="mt-2 w-full text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/40 py-1.5 rounded-lg hover:bg-rose-200 dark:hover:bg-rose-900/60 transition-colors">
                    Resolve conflict
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Shift types legend */}
          <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
            <h3 className="font-semibold text-foreground text-sm mb-3">Shift Types</h3>
            <div className="space-y-2">
              {[["bg-indigo-400", "Morning 06:00–14:00"], ["bg-emerald-400", "Day 09:00–17:00"], ["bg-amber-400", "Evening 15:00–23:00"]].map(([c, l]) => (
                <div key={l} className="flex items-center gap-2.5">
                  <div className={`w-3 h-3 rounded-sm flex-shrink-0 ${c}`} />
                  <span className="text-xs text-muted-foreground">{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
