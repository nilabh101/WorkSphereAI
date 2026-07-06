import { useState } from "react";
import { Plus, Search, Edit, Trash2, X, UserCheck } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Avatar } from "@/components/shared/Avatar";
import { Badge } from "@/components/shared/Badge";
import { KpiCard } from "@/components/shared/KpiCard";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { tooltipStyle } from "@/data";
import { useStore } from "@/store";
import type { Employee } from "@/types";

// ─── Blank form template ─────────────────────────────────────────────────────
const BLANK: Omit<Employee, "id" | "employeeId"> = {
  name: "", role: "", dept: "", email: "", phone: "", location: "",
  status: "active", joinDate: new Date().toISOString().slice(0, 10),
  shift: "Morning", manager: "", salary: 0,
  fatigue: 0, wellness: 80, performance: 80, attendance: 100, shifts: 0, avatar: "",
};

const DEPTS = ["Engineering", "Human Resources", "Operations", "Finance", "Legal", "Analytics", "Security", "Product", "ICU", "Logistics", "Sales", "Marketing"];
const SHIFTS = ["Morning", "Day", "Evening", "Night", "Rotational", "Flexible"];
const STATUSES: Employee["status"][] = ["active", "on-leave", "absent", "remote", "at-risk"];

// ─── Modal ────────────────────────────────────────────────────────────────────
function EmployeeModal({
  initial, onSave, onClose,
}: {
  initial: Omit<Employee, "id" | "employeeId">;
  onSave: (data: Omit<Employee, "id" | "employeeId">) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState(initial);
  const set = (k: keyof typeof form, v: string | number) => setForm(f => ({ ...f, [k]: v }));

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    // Auto-generate avatar initials
    const initials = form.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
    onSave({ ...form, avatar: initials });
  }

  const field = (label: string, key: keyof typeof form, type = "text", required = false) => (
    <div>
      <label className="block text-xs font-semibold text-muted-foreground mb-1.5">{label}{required && " *"}</label>
      <input
        type={type} value={String(form[key])} required={required}
        onChange={e => set(key, type === "number" ? Number(e.target.value) : e.target.value)}
        className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
      />
    </div>
  );

  const select = (label: string, key: keyof typeof form, opts: string[]) => (
    <div>
      <label className="block text-xs font-semibold text-muted-foreground mb-1.5">{label}</label>
      <select
        value={String(form[key])}
        onChange={e => set(key, e.target.value)}
        className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground"
      >
        {opts.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-base font-bold text-foreground">
            {initial.name ? "Edit Employee" : "Add New Employee"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted/50 transition-colors">
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field("Full Name", "name", "text", true)}
            {field("Job Title / Role", "role", "text", true)}
            {field("Email", "email", "email", true)}
            {field("Phone", "phone")}
            {select("Department", "dept", DEPTS)}
            {select("Shift", "shift", SHIFTS)}
            {field("Location", "location")}
            {field("Manager", "manager")}
            {field("Join Date", "joinDate", "date")}
            {field("Salary (₹)", "salary", "number")}
            {select("Status", "status", STATUSES)}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Fatigue %</label>
              <input type="range" min={0} max={100} value={form.fatigue}
                onChange={e => set("fatigue", Number(e.target.value))}
                className="w-full accent-primary" />
              <div className="text-xs text-center text-muted-foreground mt-0.5">{form.fatigue}%</div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Wellness %</label>
              <input type="range" min={0} max={100} value={form.wellness}
                onChange={e => set("wellness", Number(e.target.value))}
                className="w-full accent-primary" />
              <div className="text-xs text-center text-muted-foreground mt-0.5">{form.wellness}%</div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Attendance %</label>
              <input type="range" min={0} max={100} value={form.attendance}
                onChange={e => set("attendance", Number(e.target.value))}
                className="w-full accent-primary" />
              <div className="text-xs text-center text-muted-foreground mt-0.5">{form.attendance}%</div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Performance %</label>
              <input type="range" min={0} max={100} value={form.performance}
                onChange={e => set("performance", Number(e.target.value))}
                className="w-full accent-primary" />
              <div className="text-xs text-center text-muted-foreground mt-0.5">{form.performance}%</div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-border">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm font-semibold rounded-xl border border-border hover:bg-muted/50 transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="px-5 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-sm">
              {initial.name ? "Save Changes" : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Delete Confirmation ──────────────────────────────────────────────────────
function ConfirmDelete({ name, onConfirm, onClose }: { name: string; onConfirm: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <h2 className="text-base font-bold text-foreground mb-2">Delete Employee?</h2>
        <p className="text-sm text-muted-foreground mb-6">
          This will permanently remove <strong className="text-foreground">{name}</strong> and all their associated data. This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose}
            className="px-4 py-2 text-sm font-semibold rounded-xl border border-border hover:bg-muted/50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm}
            className="px-4 py-2 bg-rose-600 text-white text-sm font-semibold rounded-xl hover:bg-rose-700 transition-all">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export function EmployeeProfileScreen() {
  const { employees, addEmployee, editEmployee, deleteEmployee } = useStore();

  const [selected, setSelected]     = useState<Employee | null>(null);
  const [search, setSearch]         = useState("");
  const [showAdd, setShowAdd]       = useState(false);
  const [editTarget, setEditTarget] = useState<Employee | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);

  const filtered = employees.filter(
    e =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.dept.toLowerCase().includes(search.toLowerCase()) ||
      e.role.toLowerCase().includes(search.toLowerCase()),
  );

  // KPIs derived from real state
  const active   = employees.filter(e => e.status === "active").length;
  const atRisk   = employees.filter(e => e.fatigue >= 70).length;
  const onLeave  = employees.filter(e => e.status === "on-leave").length;

  // Fake 6-month attendance bars for the selected employee (based on their attendance rate)
  const months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  const attendanceChart = selected
    ? months.map(month => ({
        month,
        p: Math.round(22 * (selected.attendance / 100) + (Math.random() * 3 - 1.5)),
        a: Math.round(22 * ((100 - selected.attendance) / 100)),
      }))
    : [];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Employee Profiles"
        subtitle={`${employees.length} employees registered`}
        action={
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all"
          >
            <Plus size={14} /> Add Employee
          </button>
        }
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={UserCheck} label="Total Employees" value={employees.length} color="indigo" />
        <KpiCard icon={UserCheck} label="Active"          value={active}           color="emerald" />
        <KpiCard icon={UserCheck} label="On Leave"        value={onLeave}          color="amber" />
        <KpiCard icon={UserCheck} label="High Fatigue"    value={atRisk}           color="rose" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Employee list */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search employees…"
                className="w-full pl-8 pr-3 py-2 bg-muted/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center px-6">
              <UserCheck size={28} className="text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm font-semibold text-foreground">No employees yet</p>
              <p className="text-xs text-muted-foreground mt-1">Click "Add Employee" to get started.</p>
            </div>
          ) : (
            <div className="divide-y divide-border overflow-y-auto max-h-[600px]">
              {filtered.map(emp => (
                <div key={emp.id} className={`flex items-center gap-3 p-4 transition-colors hover:bg-muted/30 cursor-pointer ${selected?.id === emp.id ? "bg-primary/6 dark:bg-primary/10 border-l-2 border-l-primary" : ""}`}>
                  <button className="flex-1 flex items-center gap-3 text-left min-w-0" onClick={() => setSelected(emp)}>
                    <Avatar initials={emp.avatar || "??"} size="sm" color={emp.fatigue > 75 ? "rose" : emp.fatigue > 55 ? "amber" : "indigo"} />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-foreground truncate">{emp.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{emp.dept}</div>
                    </div>
                  </button>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => setEditTarget(emp)} className="p-1.5 rounded-lg hover:bg-muted/60 transition-colors" title="Edit">
                      <Edit size={12} className="text-muted-foreground" />
                    </button>
                    <button onClick={() => setDeleteTarget(emp)} className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors" title="Delete">
                      <Trash2 size={12} className="text-rose-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail panel */}
        {selected ? (
          <div className="xl:col-span-3 space-y-5">
            {/* Header card */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <div className="flex items-start gap-5">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg">
                  {selected.avatar || "??"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-foreground">{selected.name}</h2>
                      <p className="text-sm text-muted-foreground mt-0.5">{selected.role} · {selected.employeeId}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <Badge variant="indigo">{selected.dept}</Badge>
                        <Badge variant={selected.fatigue >= 70 ? "danger" : selected.status === "on-leave" ? "warning" : "success"}>
                          {selected.fatigue >= 70 ? "⚠ High Risk" : selected.status === "on-leave" ? "On Leave" : "✓ Active"}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{selected.shift} shift · {selected.location}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => setEditTarget(selected)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-card border border-border rounded-xl text-xs font-semibold hover:bg-muted/50 transition-colors">
                        <Edit size={12} /> Edit
                      </button>
                      <button onClick={() => setDeleteTarget(selected)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-800/40 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-semibold hover:bg-rose-100 transition-colors">
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-6 mt-5 pt-5 border-t border-border">
                    {([
                      ["Attendance", `${selected.attendance}%`, "indigo"],
                      ["Shifts/mo",  selected.shifts,           "amber"],
                      ["Wellness",   `${selected.wellness}%`,   "emerald"],
                      ["Fatigue",    `${selected.fatigue}%`,    "rose"],
                      ["Performance",`${selected.performance}%`,"sky"],
                    ] as [string, string | number, string][]).map(([lbl, val, c]) => (
                      <div key={lbl}>
                        <div className={`text-2xl font-bold ${c === "rose" ? "text-rose-600" : c === "emerald" ? "text-emerald-600" : c === "amber" ? "text-amber-600" : c === "sky" ? "text-sky-600" : "text-indigo-600"}`}>{val}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{lbl}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Attendance chart */}
              <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
                <h3 className="font-semibold text-foreground text-sm mb-4">Attendance History (6 months)</h3>
                <ResponsiveContainer width="100%" height={140}>
                  <BarChart data={attendanceChart} margin={{ left: -24 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
                    <XAxis dataKey="month" tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="p" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Present" />
                    <Bar dataKey="a" fill="#F43F5E" radius={[4, 4, 0, 0]} name="Absent" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Workload metrics */}
              <div className="bg-card rounded-2xl p-5 border border-border shadow-sm space-y-4">
                <h3 className="font-semibold text-foreground text-sm">Health & Workload Metrics</h3>
                {(
                  [
                    { label: "Fatigue Index",   value: selected.fatigue,    color: "auto"    },
                    { label: "Wellness Score",  value: selected.wellness,   color: "emerald" },
                    { label: "Performance",     value: selected.performance, color: "indigo"  },
                    { label: "Attendance Rate", value: selected.attendance, color: "sky"     },
                  ] as { label: string; value: number; color: "auto" | "indigo" | "emerald" | "amber" | "rose" | "sky" }[]
                ).map(m => (
                  <div key={m.label} className="space-y-1.5">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{m.label}</span>
                      <span className="font-bold text-foreground">{m.value}%</span>
                    </div>
                    <ProgressBar value={m.value} color={m.color} />
                  </div>
                ))}
              </div>
            </div>

            {/* Employee Details */}
            <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
              <h3 className="font-semibold text-foreground text-sm mb-4">Contact & Employment Details</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  ["Email",    selected.email],
                  ["Phone",    selected.phone || "—"],
                  ["Location", selected.location || "—"],
                  ["Manager",  selected.manager || "—"],
                  ["Join Date",selected.joinDate],
                  ["Salary",   selected.salary ? `₹${selected.salary.toLocaleString()}` : "—"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <div className="text-xs text-muted-foreground font-semibold">{k}</div>
                    <div className="text-sm text-foreground mt-0.5 truncate">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="xl:col-span-3 bg-card rounded-2xl border border-border shadow-sm flex flex-col items-center justify-center py-24 text-center">
            <UserCheck size={36} className="text-muted-foreground/30 mb-4" />
            <p className="text-sm font-semibold text-foreground">Select an employee</p>
            <p className="text-xs text-muted-foreground mt-1">Click a name on the left to view their profile.</p>
          </div>
        )}
      </div>

      {/* Add modal */}
      {showAdd && (
        <EmployeeModal
          initial={BLANK}
          onSave={data => { addEmployee(data); setShowAdd(false); }}
          onClose={() => setShowAdd(false)}
        />
      )}

      {/* Edit modal */}
      {editTarget && (
        <EmployeeModal
          initial={editTarget}
          onSave={data => {
            editEmployee(editTarget.id, data);
            if (selected?.id === editTarget.id) setSelected({ ...editTarget, ...data });
            setEditTarget(null);
          }}
          onClose={() => setEditTarget(null)}
        />
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <ConfirmDelete
          name={deleteTarget.name}
          onConfirm={() => {
            deleteEmployee(deleteTarget.id);
            if (selected?.id === deleteTarget.id) setSelected(null);
            setDeleteTarget(null);
          }}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
