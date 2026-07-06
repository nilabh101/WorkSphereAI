import { useState } from "react";
import { Plus, ChevronLeft, ChevronRight, AlertTriangle, Trash2, X } from "lucide-react";
import { Avatar } from "@/components/shared/Avatar";
import { Badge } from "@/components/shared/Badge";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { useStore } from "@/store";
import type { Shift } from "@/types";

// ─── Week helpers ─────────────────────────────────────────────────────────────
const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getWeekDates(offset: number) {
  const today  = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7) + offset * 7);
  return DAY_NAMES.map((day, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return { day, date: d.toISOString().slice(0, 10), label: d.getDate() };
  });
}

const SHIFT_STYLES: Record<string, string> = {
  morning: "bg-indigo-100 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800/50",
  day:     "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/50",
  evening: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/50",
  night:   "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
};

// ─── Blank shift form ─────────────────────────────────────────────────────────
type ShiftForm = Omit<Shift, "id" | "conflict">;

const BLANK_SHIFT: ShiftForm = {
  employee: "", employeeId: "", day: "Mon", date: "", start: "08:00", end: "17:00",
  type: "morning", dept: "", status: "confirmed",
};

// ─── Shift Modal ──────────────────────────────────────────────────────────────
function ShiftModal({
  initial, weekDates, onSave, onClose,
}: {
  initial: ShiftForm;
  weekDates: { day: string; date: string; label: number }[];
  onSave: (s: ShiftForm) => void;
  onClose: () => void;
}) {
  const { employees } = useStore();
  const [form, setForm] = useState<ShiftForm>(initial);
  const set = (k: keyof ShiftForm, v: string) => setForm(f => ({ ...f, [k]: v }));

  function pickEmployee(id: string) {
    const emp = employees.find(e => e.id === id);
    if (emp) setForm(f => ({ ...f, employeeId: emp.id, employee: emp.name, dept: emp.dept }));
  }

  function pickDay(day: string) {
    const entry = weekDates.find(w => w.day === day);
    setForm(f => ({ ...f, day, date: entry?.date ?? f.date }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.employeeId || !form.day) return;
    onSave(form);
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-base font-bold text-foreground">
            {initial.employee ? "Edit Shift" : "Add New Shift"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted/50 transition-colors">
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Employee *</label>
            <select
              required value={form.employeeId}
              onChange={e => pickEmployee(e.target.value)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
            >
              <option value="">Select employee…</option>
              {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name} ({emp.dept})</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Day *</label>
              <select value={form.day} onChange={e => pickDay(e.target.value)}
                className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground">
                {weekDates.map(w => <option key={w.day} value={w.day}>{w.day} ({w.label})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Type</label>
              <select value={form.type} onChange={e => set("type", e.target.value)}
                className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground">
                {["morning","day","evening","night"].map(t => <option key={t} value={t} className="capitalize">{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Start Time</label>
              <input type="time" value={form.start} onChange={e => set("start", e.target.value)}
                className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">End Time</label>
              <input type="time" value={form.end} onChange={e => set("end", e.target.value)}
                className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Status</label>
            <select value={form.status} onChange={e => set("status", e.target.value)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground">
              {["confirmed","pending"].map(s => <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-border">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm font-semibold rounded-xl border border-border hover:bg-muted/50 transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="px-5 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all">
              {initial.employee ? "Save Changes" : "Add Shift"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export function ShiftPlannerScreen() {
  const { employees, shifts, addShift, editShift, deleteShift, resolveConflict } = useStore();

  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [showAdd, setShowAdd]         = useState(false);
  const [editTarget, setEditTarget]   = useState<Shift | null>(null);

  const weekDates = getWeekDates(weekOffset);
  const weekStart = weekDates[0];
  const weekEnd   = weekDates[6];

  const weekLabel = `${new Date(weekStart.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${new Date(weekEnd.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`;

  const conflicted = shifts.filter(s => s.conflict);

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Shift Planner"
        subtitle={`Week of ${weekLabel}`}
        action={
          <div className="flex items-center gap-2.5">
            <button onClick={() => setWeekOffset(w => w - 1)}
              className="flex items-center gap-1.5 px-3 py-2.5 bg-card border border-border rounded-xl text-sm hover:bg-muted/50">
              <ChevronLeft size={14} /> Prev
            </button>
            <button onClick={() => setWeekOffset(w => w + 1)}
              className="flex items-center gap-1.5 px-3 py-2.5 bg-card border border-border rounded-xl text-sm hover:bg-muted/50">
              Next <ChevronRight size={14} />
            </button>
            <button
              onClick={() => setShowAdd(true)}
              disabled={employees.length === 0}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              title={employees.length === 0 ? "Add employees first" : undefined}
            >
              <Plus size={14} /> Add Shift
            </button>
          </div>
        }
      />

      {employees.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-16 text-center">
          <p className="text-sm font-semibold text-foreground">No employees added yet</p>
          <p className="text-xs text-muted-foreground mt-1">Go to Employee Profiles to add employees, then come back to schedule shifts.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Calendar grid */}
          <div className="xl:col-span-3 bg-card rounded-2xl border border-border shadow-sm overflow-hidden overflow-x-auto">
            {/* Day headers */}
            <div className="grid grid-cols-8 border-b border-border bg-muted/30 min-w-[640px]">
              <div className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Employee</div>
              {weekDates.map(({ day, label }) => (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day === selectedDay ? null : day)}
                  className={`p-3 text-center border-l border-border cursor-pointer transition-colors select-none ${selectedDay === day ? "bg-primary/8 dark:bg-primary/10" : "hover:bg-muted/50"}`}
                >
                  <div className="text-xs font-semibold text-muted-foreground uppercase">{day}</div>
                  <div className={`text-xl font-bold mt-0.5 ${selectedDay === day ? "text-primary" : "text-foreground"}`}>{label}</div>
                </div>
              ))}
            </div>

            {/* Employee rows */}
            <div className="min-w-[640px]">
              {employees.map(emp => (
                <div key={emp.id} className="grid grid-cols-8 border-b border-border last:border-b-0">
                  <div className="p-3 flex items-center gap-2.5 border-r border-border">
                    <Avatar initials={emp.avatar || "??"} size="sm" color={emp.fatigue > 75 ? "rose" : emp.fatigue > 55 ? "amber" : "indigo"} />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-foreground truncate">{emp.name.split(" ")[0]}</div>
                      <div className="text-xs text-muted-foreground truncate">{emp.dept}</div>
                    </div>
                  </div>
                  {weekDates.map(({ day, date }) => {
                    const shift = shifts.find(s => s.employeeId === emp.id && s.day === day && s.date === date);
                    return (
                      <div key={day} className={`p-1.5 border-l border-border flex items-center justify-center min-h-[64px] ${selectedDay === day ? "bg-primary/5 dark:bg-primary/8" : ""}`}>
                        {shift ? (
                          <div
                            className={`w-full px-2 py-1.5 rounded-xl border text-xs font-semibold group relative ${SHIFT_STYLES[shift.type] ?? SHIFT_STYLES.morning} ${shift.conflict ? "ring-2 ring-rose-400/60 ring-offset-1" : ""}`}
                          >
                            <div className="truncate leading-tight">{shift.start}–{shift.end}</div>
                            {shift.conflict && (
                              <div className="flex items-center gap-0.5 text-rose-600 dark:text-rose-400 mt-0.5">
                                <AlertTriangle size={9} /> Conflict
                              </div>
                            )}
                            {/* Edit / Delete overlay */}
                            <div className="absolute inset-0 rounded-xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                              <button
                                onClick={() => setEditTarget(shift)}
                                className="p-1 rounded bg-white/20 hover:bg-white/40 transition-colors"
                                title="Edit shift"
                              >
                                <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2.5}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                              </button>
                              <button
                                onClick={() => deleteShift(shift.id)}
                                className="p-1 rounded bg-white/20 hover:bg-rose-500/80 transition-colors"
                                title="Delete shift"
                              >
                                <Trash2 size={10} color="white" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setShowAdd(true);
                            }}
                            className="w-full h-10 rounded-xl border border-dashed border-border/40 text-muted-foreground/30 hover:border-primary/40 hover:text-primary/40 transition-all text-xl leading-none"
                            title="Add shift"
                          >
                            +
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Availability */}
            <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
              <h3 className="font-semibold text-foreground text-sm mb-4">Employee Availability</h3>
              {employees.length === 0 ? (
                <p className="text-xs text-muted-foreground">No employees.</p>
              ) : (
                <div className="space-y-3">
                  {employees.map(emp => (
                    <div key={emp.id} className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-foreground truncate flex-1">{emp.name.split(" ")[0]}</span>
                        <span className={`text-xs font-bold ml-1 ${emp.fatigue > 75 ? "text-rose-600" : emp.fatigue > 55 ? "text-amber-600" : "text-emerald-600"}`}>
                          {emp.fatigue}%
                        </span>
                      </div>
                      <ProgressBar value={emp.fatigue} color="auto" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Conflict Alerts */}
            {conflicted.length > 0 && (
              <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground text-sm">Conflict Alerts</h3>
                  <Badge variant="danger">{conflicted.length}</Badge>
                </div>
                <div className="space-y-2.5">
                  {conflicted.map(s => (
                    <div key={s.id} className="p-3 bg-rose-50 dark:bg-rose-950/30 rounded-xl border border-rose-200/70 dark:border-rose-800/30">
                      <div className="flex items-start gap-2">
                        <AlertTriangle size={13} className="text-rose-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-semibold text-rose-700 dark:text-rose-400">{s.employee}</div>
                          <div className="text-xs text-rose-600/70 dark:text-rose-500/60">{s.day}: {s.start}–{s.end}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => resolveConflict(s.id)}
                        className="mt-2 w-full text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/40 py-1.5 rounded-lg hover:bg-rose-200 dark:hover:bg-rose-900/60 transition-colors"
                      >
                        Resolve conflict
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shift types legend */}
            <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
              <h3 className="font-semibold text-foreground text-sm mb-3">Shift Types</h3>
              <div className="space-y-2">
                {([
                  ["bg-indigo-400", "Morning"],
                  ["bg-emerald-400","Day"],
                  ["bg-amber-400",  "Evening"],
                  ["bg-slate-400",  "Night"],
                ] as [string, string][]).map(([c, l]) => (
                  <div key={l} className="flex items-center gap-2.5">
                    <div className={`w-3 h-3 rounded-sm flex-shrink-0 ${c}`} />
                    <span className="text-xs text-muted-foreground">{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add shift modal */}
      {showAdd && (
        <ShiftModal
          initial={{ ...BLANK_SHIFT, date: weekDates[0].date, day: weekDates[0].day }}
          weekDates={weekDates}
          onSave={s => { addShift(s); setShowAdd(false); }}
          onClose={() => setShowAdd(false)}
        />
      )}

      {/* Edit shift modal */}
      {editTarget && (
        <ShiftModal
          initial={editTarget}
          weekDates={weekDates}
          onSave={s => { editShift(editTarget.id, s); setEditTarget(null); }}
          onClose={() => setEditTarget(null)}
        />
      )}
    </div>
  );
}
