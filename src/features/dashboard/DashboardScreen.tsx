import { useMemo } from "react";
import { Users, Clock, CheckCircle, AlertTriangle, ClipboardList, BarChart3 } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { KpiCard } from "@/components/shared/KpiCard";
import { Avatar } from "@/components/shared/Avatar";
import { Badge } from "@/components/shared/Badge";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { tooltipStyle } from "@/data";
import { useStore } from "@/store";
import type { Role, Page } from "@/types";

const CHART_COLORS = ["#4F46E5","#10B981","#F59E0B","#0EA5E9","#7C3AED","#F43F5E"];

interface DashboardScreenProps {
  role: Role;
  onNavigate: (page: Page) => void;
}

export function DashboardScreen({ role, onNavigate }: DashboardScreenProps) {
  const { employees, shifts, leaveRequests } = useStore();

  // ── Derived KPIs ────────────────────────────────────────────────────────────
  const total    = employees.length;
  const active   = employees.filter(e => e.status === "active").length;
  const onLeave  = employees.filter(e => e.status === "on-leave").length;
  const highRisk = employees.filter(e => e.fatigue >= 70);
  const pending  = leaveRequests.filter(r => r.status === "pending");

  // Avg attendance
  const avgAttendance = total > 0
    ? Math.round(employees.reduce((sum, e) => sum + e.attendance, 0) / total)
    : 0;

  // ── Dept distribution pie ────────────────────────────────────────────────────
  const deptCounts = useMemo(() => {
    const map: Record<string, number> = {};
    employees.forEach(e => { map[e.dept] = (map[e.dept] ?? 0) + 1; });
    return Object.entries(map).map(([name, value], i) => ({ name, value, color: CHART_COLORS[i % CHART_COLORS.length] }));
  }, [employees]);

  // ── Fatigue distribution bar ─────────────────────────────────────────────────
  const fatigueChart = useMemo(() => {
    const bins = [
      { label: "0–25",  low: 0,  high: 25  },
      { label: "26–50", low: 26, high: 50  },
      { label: "51–75", low: 51, high: 75  },
      { label: "76–100",low: 76, high: 100 },
    ];
    return bins.map(b => ({
      range: b.label,
      count: employees.filter(e => e.fatigue >= b.low && e.fatigue <= b.high).length,
    }));
  }, [employees]);

  // ── Shift coverage area chart ────────────────────────────────────────────────
  const shiftTrend = useMemo(() => {
    const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    return days.map(day => ({
      day,
      shifts: shifts.filter(s => s.day === day).length,
    }));
  }, [shifts]);

  const greeting = (() => {
    const h = new Date().getHours();
    return h < 12 ? "morning" : h < 17 ? "afternoon" : "evening";
  })();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground capitalize">Good {greeting} 👋</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {total === 0
              ? "Add employees to start seeing your workforce overview."
              : `Overview of your ${total} employee workforce · ${new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`}
          </p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard icon={Users}         label="Total Employees"    value={total}          color="indigo" />
        <KpiCard icon={CheckCircle}   label="Active Today"       value={active}         color="emerald" />
        <KpiCard icon={Clock}         label="On Leave"           value={onLeave}        color="amber" />
        <KpiCard icon={AlertTriangle} label="High Fatigue Risk"  value={highRisk.length} color="rose" />
        <KpiCard icon={ClipboardList} label="Pending Approvals"  value={pending.length}  color="violet" />
        <KpiCard icon={BarChart3}     label="Avg Attendance"     value={`${avgAttendance}%`} color="sky" />
      </div>

      {total === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-16 text-center">
          <Users size={40} className="text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-base font-semibold text-foreground mb-2">Your dashboard is empty</h3>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-5">
            Start by adding employees — charts, AI insights, and KPIs will populate automatically as you add data.
          </p>
          <button
            onClick={() => onNavigate("employees")}
            className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all"
          >
            Add First Employee
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Fatigue distribution */}
            <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5 shadow-sm">
              <div className="mb-4">
                <div className="text-sm font-semibold text-foreground">Fatigue Distribution</div>
                <div className="text-xs text-muted-foreground">Employee count by fatigue score range</div>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={fatigueChart} barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
                  <XAxis dataKey="range" tick={{ fill: "#94A3B8", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#94A3B8", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Bar dataKey="count" fill="#4F46E5" radius={[6, 6, 0, 0]} name="Employees" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Dept distribution */}
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <div className="text-sm font-semibold text-foreground mb-1">Department Distribution</div>
              <div className="text-xs text-muted-foreground mb-3">Headcount by team</div>
              {deptCounts.length === 0 ? (
                <p className="text-xs text-muted-foreground">No departments yet.</p>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={130}>
                    <PieChart>
                      <Pie data={deptCounts} cx="50%" cy="50%" innerRadius={35} outerRadius={58} dataKey="value" stroke="none">
                        {deptCounts.map((d, i) => <Cell key={i} fill={d.color} />)}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-1.5 mt-2">
                    {deptCounts.slice(0, 5).map(d => (
                      <div key={d.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                          <span className="text-xs text-muted-foreground truncate max-w-[100px]">{d.name}</span>
                        </div>
                        <span className="text-xs font-semibold text-foreground">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Shift trend + at-risk */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Shift coverage */}
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <div className="text-sm font-semibold text-foreground mb-1">Shift Coverage This Week</div>
              <div className="text-xs text-muted-foreground mb-4">{shifts.length} total shifts scheduled</div>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={shiftTrend}>
                  <defs>
                    <linearGradient id="shiftGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                  <XAxis dataKey="day" tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="shifts" stroke="#4F46E5" strokeWidth={2.5} fill="url(#shiftGrad)" name="Shifts" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* At-risk employees */}
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold text-foreground">At-Risk Employees</div>
                {highRisk.length > 0 && <Badge variant="danger">{highRisk.length} alert{highRisk.length !== 1 ? "s" : ""}</Badge>}
              </div>
              {highRisk.length === 0 ? (
                <div className="py-8 text-center">
                  <CheckCircle size={28} className="text-emerald-400 mx-auto mb-2" />
                  <p className="text-xs text-muted-foreground">No high-fatigue employees.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {highRisk.slice(0, 5).map(emp => (
                    <div key={emp.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/40 transition-colors">
                      <Avatar initials={emp.avatar || "??"} size="sm" color={emp.fatigue >= 80 ? "rose" : "amber"} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-foreground truncate">{emp.name}</span>
                          <Badge variant={emp.fatigue >= 80 ? "danger" : "warning"}>{emp.fatigue}%</Badge>
                        </div>
                        <ProgressBar value={emp.fatigue} color="auto" />
                        <p className="text-xs text-muted-foreground mt-1">{emp.role} · {emp.dept}</p>
                      </div>
                    </div>
                  ))}
                  {highRisk.length > 5 && (
                    <button onClick={() => onNavigate("ai-insights")} className="text-xs text-primary hover:underline font-semibold">
                      +{highRisk.length - 5} more — View AI Insights →
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Pending leave requests */}
          {pending.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm font-semibold text-foreground">Pending Leave Requests</div>
                <button onClick={() => onNavigate("leave")} className="text-xs text-primary hover:underline font-semibold">View all →</button>
              </div>
              <div className="divide-y divide-border">
                {pending.slice(0, 4).map(req => (
                  <div key={req.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar initials={req.employee.split(" ").map(n => n[0]).join("").slice(0, 2)} size="sm" />
                      <div>
                        <span className="text-sm font-semibold text-foreground">{req.employee}</span>
                        <p className="text-xs text-muted-foreground">{req.type} · {req.days} day{req.days !== 1 ? "s" : ""} · {req.start}</p>
                      </div>
                    </div>
                    <Badge variant="warning">Pending</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
