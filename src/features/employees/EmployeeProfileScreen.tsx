import { useState } from "react";
import { Plus, Search, Edit, Mail, Eye, Award } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Avatar } from "@/components/shared/Avatar";
import { Badge } from "@/components/shared/Badge";
import { KpiCard } from "@/components/shared/KpiCard";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { employees, tooltipStyle } from "@/data";

const certs = ["OSHA Safety Certification", "Forklift Operator Level 3", "First Aid & CPR", "Hazmat Handling Level 2"];
const leave = [{ type: "Annual", used: 8, total: 20 }, { type: "Sick", used: 3, total: 12 }, { type: "Personal", used: 1, total: 5 }];
const attendance = [
  { month: "Mar", p: 22, a: 1 }, { month: "Apr", p: 21, a: 2 }, { month: "May", p: 23, a: 0 },
  { month: "Jun", p: 20, a: 3 }, { month: "Jul", p: 22, a: 1 }, { month: "Aug", p: 7, a: 1 },
];

export function EmployeeProfileScreen() {
  const [selected, setSelected] = useState(employees[3]);
  const [search, setSearch] = useState("");

  const filtered = employees.filter(
    e => e.name.toLowerCase().includes(search.toLowerCase()) || e.dept.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Employee Profiles"
        action={
          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm hover:bg-primary/90 transition-all">
            <Plus size={14} /> New Employee
          </button>
        }
      />

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
          <div className="divide-y divide-border overflow-y-auto max-h-[600px]">
            {filtered.map(emp => (
              <button
                key={emp.id}
                onClick={() => setSelected(emp)}
                className={`w-full flex items-center gap-3 p-4 text-left transition-colors hover:bg-muted/30 ${selected.id === emp.id ? "bg-primary/6 dark:bg-primary/10 border-l-2 border-l-primary" : ""}`}
              >
                <Avatar initials={emp.avatar} size="sm" color={emp.fatigue > 75 ? "rose" : emp.fatigue > 55 ? "amber" : "indigo"} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-foreground truncate">{emp.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{emp.dept}</div>
                </div>
                {emp.status === "at-risk" && <div className="w-2 h-2 bg-rose-500 rounded-full flex-shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        {/* Detail panel */}
        <div className="xl:col-span-3 space-y-5">
          {/* Header card */}
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
            <div className="flex items-start gap-5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-400 to-orange-500 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 shadow-lg shadow-rose-200 dark:shadow-rose-900/30">
                {selected.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{selected.name}</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">{selected.role}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge variant="indigo">{selected.dept}</Badge>
                      <Badge variant={selected.status === "at-risk" ? "danger" : "success"}>
                        {selected.status === "at-risk" ? "⚠ At Risk" : "✓ Active"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button className="p-2.5 rounded-xl border border-border hover:bg-muted/50 transition-colors"><Edit size={14} className="text-muted-foreground" /></button>
                    <button className="p-2.5 rounded-xl border border-border hover:bg-muted/50 transition-colors"><Mail size={14} className="text-muted-foreground" /></button>
                    <button className="p-2.5 rounded-xl border border-border hover:bg-muted/50 transition-colors"><Eye size={14} className="text-muted-foreground" /></button>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-6 mt-5 pt-5 border-t border-border">
                  {[
                    ["Attendance", `${selected.attendance}%`, "indigo"],
                    ["Shifts/mo", selected.shifts, "amber"],
                    ["Wellness", `${selected.wellness}/100`, "emerald"],
                    ["Fatigue", `${selected.fatigue}%`, "rose"],
                  ].map(([lbl, val, c]) => (
                    <div key={String(lbl)}>
                      <div className={`text-2xl font-bold ${c === "rose" ? "text-rose-600" : c === "emerald" ? "text-emerald-600" : c === "amber" ? "text-amber-600" : "text-indigo-600"} dark:brightness-110`}>{val}</div>
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
              <h3 className="font-semibold text-foreground text-sm mb-4">Attendance History</h3>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={attendance} margin={{ left: -24 }}>
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
              {[
                { label: "Fatigue Index", value: selected.fatigue, color: "auto" },
                { label: "Wellness Score", value: selected.wellness, color: "emerald" },
                { label: "Workload", value: Math.round((selected.shifts / 22) * 100), color: "amber" },
              ].map(m => (
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Certifications */}
            <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
              <h3 className="font-semibold text-foreground text-sm mb-4">Certifications</h3>
              <div className="space-y-2">
                {certs.map((cert, i) => (
                  <div key={cert} className="flex items-center gap-3 p-2.5 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${i % 2 === 0 ? "bg-emerald-100 dark:bg-emerald-950/40" : "bg-indigo-100 dark:bg-indigo-950/40"}`}>
                      <Award size={14} className={i % 2 === 0 ? "text-emerald-600 dark:text-emerald-400" : "text-indigo-600 dark:text-indigo-400"} />
                    </div>
                    <span className="text-sm text-foreground flex-1">{cert}</span>
                    <Badge variant="success">Valid</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Leave balance */}
            <div className="bg-card rounded-2xl p-5 border border-border shadow-sm">
              <h3 className="font-semibold text-foreground text-sm mb-4">Leave Balance</h3>
              <div className="space-y-4">
                {leave.map(lb => (
                  <div key={lb.type}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-muted-foreground">{lb.type} Leave</span>
                      <span className="font-semibold text-foreground">{lb.total - lb.used} days remaining</span>
                    </div>
                    <ProgressBar value={(lb.used / lb.total) * 100} color="indigo" />
                    <div className="text-xs text-muted-foreground mt-1">{lb.used} used · {lb.total} total</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
