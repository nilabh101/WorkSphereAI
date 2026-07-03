import { Download, Plus, ChevronRight, Zap, CheckSquare, AlertTriangle, RefreshCw } from "lucide-react";
import { Users, Clock, CheckCircle } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line,
} from "recharts";
import { Badge } from "@/components/shared/Badge";
import { Avatar } from "@/components/shared/Avatar";
import { KpiCard } from "@/components/shared/KpiCard";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { fatigueData, staffingData, complianceData, employees, tooltipStyle } from "@/data";
import type { Role } from "@/types";

interface DashboardScreenProps {
  role: Role;
}

export function DashboardScreen({ role }: DashboardScreenProps) {
  const roleLabel: Record<Role, string> = {
    superadmin: "Admin", hrmanager: "HR Manager", opsmanager: "Ops Manager",
    supervisor: "Supervisor", employee: "Employee",
  };

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Good morning, {roleLabel[role]}</h1>
          <p className="text-muted-foreground mt-1 text-sm">Here's what's happening across your organization today — Monday, Aug 7, 2024.</p>
        </div>
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl text-sm hover:bg-muted/50 transition-all">
            <Download size={14} /> Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm hover:bg-primary/90 transition-all shadow-sm hover:shadow-primary/20">
            <Plus size={14} /> Quick action
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={Users} label="Total Headcount" value="1,247" change={3.2} positive={true} color="indigo" />
        <KpiCard icon={AlertTriangle} label="High Fatigue Risk" value="23" change={12.5} positive={false} color="rose" />
        <KpiCard icon={CheckCircle} label="Compliance Score" value="87%" change={2.1} positive={true} color="emerald" />
        <KpiCard icon={Clock} label="Shift Coverage" value="91.4%" change={0.8} positive={true} color="amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fatigue Trend */}
        <div className="lg:col-span-2 bg-card rounded-2xl p-6 border border-border shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-foreground">Fatigue Trend Analysis</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Team average vs. industry benchmark · 2024 YTD</p>
            </div>
            <Badge variant="indigo">Live data</Badge>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={fatigueData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="gTeam" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gInd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} domain={[0, 90]} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="team" stroke="#4F46E5" strokeWidth={2.5} fill="url(#gTeam)" name="Team Avg" />
              <Area type="monotone" dataKey="industry" stroke="#10B981" strokeWidth={2} fill="url(#gInd)" name="Industry" />
              <Line type="monotone" dataKey="threshold" stroke="#F43F5E" strokeWidth={1.5} strokeDasharray="4 4" name="Threshold" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-5 mt-4 pt-4 border-t border-border">
            {[["#4F46E5", "Team Avg"], ["#10B981", "Industry"], ["#F43F5E", "Risk Threshold"]].map(([c, l]) => (
              <div key={l} className="flex items-center gap-1.5">
                <div className="w-3 h-0.5 rounded-full" style={{ background: c }} />
                <span className="text-xs text-muted-foreground">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Status */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
          <h3 className="font-semibold text-foreground mb-1">Compliance Status</h3>
          <p className="text-xs text-muted-foreground mb-4">Overall score: 87%</p>
          <div className="flex justify-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={complianceData} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value" startAngle={90} endAngle={-270}>
                  {complianceData.map((entry, i) => <Cell key={i} fill={entry.color} strokeWidth={0} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2.5 mt-2">
            {complianceData.map(d => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                  <span className="text-sm text-muted-foreground">{d.name}</span>
                </div>
                <span className="text-sm font-semibold text-foreground">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Staffing Coverage */}
      <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-foreground">Staffing Coverage by Department</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Required vs. actual headcount</p>
          </div>
          <button className="flex items-center gap-1 text-sm text-primary hover:underline font-medium">
            View all <ChevronRight size={14} />
          </button>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={staffingData} barGap={6} margin={{ left: -20, right: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
            <XAxis dataKey="dept" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="required" fill="#E0E7FF" radius={[4, 4, 0, 0]} name="Required" />
            <Bar dataKey="actual" fill="#4F46E5" radius={[4, 4, 0, 0]} name="Actual" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* At-Risk Employees */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-foreground">At-Risk Employees</h3>
            <Badge variant="danger">3 alerts</Badge>
          </div>
          <div className="space-y-3">
            {employees.filter(e => e.fatigue > 55).map(emp => (
              <div key={emp.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/40 transition-colors cursor-pointer">
                <Avatar initials={emp.avatar} size="sm" color={emp.fatigue > 75 ? "rose" : "amber"} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-foreground truncate">{emp.name}</span>
                    <Badge variant={emp.fatigue > 75 ? "danger" : "warning"}>{emp.fatigue}%</Badge>
                  </div>
                  <ProgressBar value={emp.fatigue} color="auto" />
                  <p className="text-xs text-muted-foreground mt-1">{emp.role} · {emp.dept}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-foreground">AI Recommendations</h3>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded-full">
              <Zap size={11} /> AI-powered
            </div>
          </div>
          <div className="space-y-2.5">
            {[
              { title: "Reduce James O'Brien overtime", action: "Reassign 2 upcoming shifts", icon: AlertTriangle, c: "rose" },
              { title: "Rotate ICU night shift team", action: "Schedule swap — next Tuesday", icon: RefreshCw, c: "amber" },
              { title: "Approve 3 pending leave requests", action: "Sarah Chen, Aisha Kamara +1", icon: CheckSquare, c: "emerald" },
            ].map(item => (
              <div key={item.title} className="flex items-start gap-3 p-3.5 rounded-xl hover:bg-muted/40 transition-colors cursor-pointer group">
                <div className={`p-2 rounded-xl flex-shrink-0 ${
                  item.c === "rose" ? "bg-rose-50 dark:bg-rose-950/40" :
                  item.c === "amber" ? "bg-amber-50 dark:bg-amber-950/40" : "bg-emerald-50 dark:bg-emerald-950/40"
                }`}>
                  <item.icon size={14} className={
                    item.c === "rose" ? "text-rose-600 dark:text-rose-400" :
                    item.c === "amber" ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
                  } />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-foreground">{item.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{item.action}</div>
                </div>
                <Badge variant={item.c === "rose" ? "danger" : item.c === "amber" ? "warning" : "success"}>
                  {item.c === "rose" ? "High" : item.c === "amber" ? "Med" : "Low"}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
