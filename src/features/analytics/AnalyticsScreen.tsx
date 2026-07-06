import { useMemo } from "react";
import { Users, Clock, Heart, Shield, BarChart3 } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { KpiCard } from "@/components/shared/KpiCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { tooltipStyle } from "@/data";
import { useStore } from "@/store";

const COLORS = ["#4F46E5","#10B981","#F59E0B","#0EA5E9","#7C3AED","#F43F5E"];

export function AnalyticsScreen() {
  const { employees, shifts, leaveRequests } = useStore();

  const total = employees.length;
  const avgFatigue   = total > 0 ? Math.round(employees.reduce((s, e) => s + e.fatigue,    0) / total) : 0;
  const avgWellness  = total > 0 ? Math.round(employees.reduce((s, e) => s + e.wellness,   0) / total) : 0;
  const avgAttendance= total > 0 ? Math.round(employees.reduce((s, e) => s + e.attendance, 0) / total) : 0;
  const approved     = leaveRequests.filter(r => r.status === "approved").length;

  // Fatigue by dept
  const deptFatigue = useMemo(() => {
    const map: Record<string, number[]> = {};
    employees.forEach(e => {
      if (!map[e.dept]) map[e.dept] = [];
      map[e.dept].push(e.fatigue);
    });
    return Object.entries(map).map(([dept, vals]) => ({
      dept: dept.slice(0, 12),
      avg: Math.round(vals.reduce((s, v) => s + v, 0) / vals.length),
    })).sort((a, b) => b.avg - a.avg).slice(0, 8);
  }, [employees]);

  // Status breakdown
  const statusPie = useMemo(() => {
    const statuses = ["active","on-leave","absent","remote","at-risk"];
    return statuses.map((s, i) => ({
      name: s,
      value: employees.filter(e => e.status === s).length,
      color: COLORS[i],
    })).filter(d => d.value > 0);
  }, [employees]);

  // Shift activity per day
  const shiftActivity = useMemo(() => {
    const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    return days.map(day => ({
      day,
      scheduled: shifts.filter(s => s.day === day).length,
      confirmed: shifts.filter(s => s.day === day && s.status === "confirmed").length,
    }));
  }, [shifts]);

  // Leave by type
  const leaveByType = useMemo(() => {
    const map: Record<string, number> = {};
    leaveRequests.forEach(r => { map[r.type] = (map[r.type] ?? 0) + 1; });
    return Object.entries(map).map(([type, count]) => ({ type: type.replace(" Leave",""), count })).slice(0, 6);
  }, [leaveRequests]);

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Executive Analytics"
        subtitle="Organisation-wide intelligence derived from your workforce data"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={Users}   label="Total Employees"  value={total}           color="indigo" />
        <KpiCard icon={Clock}   label="Avg Fatigue"      value={`${avgFatigue}%`} color="rose" />
        <KpiCard icon={Heart}   label="Avg Wellness"     value={`${avgWellness}%`} color="emerald" />
        <KpiCard icon={Shield}  label="Avg Attendance"   value={`${avgAttendance}%`} color="sky" />
      </div>

      {total === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-16 text-center">
          <BarChart3 size={32} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm font-semibold text-foreground">No data to analyse yet</p>
          <p className="text-xs text-muted-foreground mt-1">Add employees and shifts to see analytics charts.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Dept fatigue */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <h3 className="font-semibold text-foreground mb-0.5">Average Fatigue by Department</h3>
              <p className="text-xs text-muted-foreground mb-5">Higher bars = more workload pressure</p>
              {deptFatigue.length === 0 ? (
                <p className="text-xs text-muted-foreground">Not enough data.</p>
              ) : (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={deptFatigue} margin={{ left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
                    <XAxis dataKey="dept" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} domain={[0, 100]} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="avg" fill="#F43F5E" radius={[6, 6, 0, 0]} name="Avg Fatigue %" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Employee status */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <h3 className="font-semibold text-foreground mb-0.5">Employee Status Breakdown</h3>
              <p className="text-xs text-muted-foreground mb-4">Current workforce status distribution</p>
              {statusPie.length === 0 ? (
                <p className="text-xs text-muted-foreground">Not enough data.</p>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={statusPie} cx="50%" cy="50%" innerRadius={45} outerRadius={68} dataKey="value" stroke="none">
                        {statusPie.map((d, i) => <Cell key={i} fill={d.color} />)}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {statusPie.map(d => (
                      <div key={d.name} className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                        <span className="text-xs text-muted-foreground capitalize">{d.name}</span>
                        <span className="text-xs font-semibold text-foreground ml-auto">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Shift activity */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <h3 className="font-semibold text-foreground mb-0.5">Weekly Shift Activity</h3>
              <p className="text-xs text-muted-foreground mb-5">Scheduled vs confirmed shifts by day</p>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={shiftActivity}>
                  <defs>
                    <linearGradient id="schedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="confGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="scheduled" stroke="#4F46E5" strokeWidth={2} fill="url(#schedGrad)" name="Scheduled" />
                  <Area type="monotone" dataKey="confirmed"  stroke="#10B981" strokeWidth={2} fill="url(#confGrad)"  name="Confirmed" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Leave by type */}
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <h3 className="font-semibold text-foreground mb-0.5">Leave Requests by Type</h3>
              <p className="text-xs text-muted-foreground mb-5">{leaveRequests.length} total requests — {approved} approved</p>
              {leaveByType.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">No leave requests yet.</div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={leaveByType} layout="vertical" margin={{ left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <YAxis dataKey="type" type="category" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} width={80} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Bar dataKey="count" fill="#4F46E5" radius={[0, 4, 4, 0]} name="Requests" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
