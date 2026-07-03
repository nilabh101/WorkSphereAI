import { Download } from "lucide-react";
import { Users, Clock, Heart, Shield, Brain, AlertTriangle, TrendingUp } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line,
} from "recharts";
import { KpiCard } from "@/components/shared/KpiCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { fatigueData, weeklyWorkloadData, tooltipStyle } from "@/data";

export function AnalyticsScreen() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Executive Analytics"
        subtitle="Organization-wide intelligence and performance metrics"
        action={
          <div className="flex items-center gap-2.5">
            <select className="px-3 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>YTD 2024</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm hover:bg-primary/90 transition-all">
              <Download size={14} /> Export
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={Users} label="Active Employees" value="1,247" change={3.2} positive={true} color="indigo" />
        <KpiCard icon={Clock} label="Avg Hours / Week" value="41.2h" change={1.8} positive={false} color="amber" />
        <KpiCard icon={Heart} label="Wellness Index" value="78 / 100" change={4.3} positive={true} color="emerald" />
        <KpiCard icon={Shield} label="Compliance Rate" value="87.3%" change={2.1} positive={true} color="emerald" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Fatigue Distribution */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
          <h3 className="font-semibold text-foreground mb-0.5">Weekly Fatigue Distribution</h3>
          <p className="text-xs text-muted-foreground mb-5">Fatigue index and overtime hours by day</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyWorkloadData} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="fatigue" fill="#4F46E5" radius={[6, 6, 0, 0]} name="Fatigue %" />
              <Bar dataKey="ot" fill="#10B981" radius={[6, 6, 0, 0]} name="OT Hours" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Yearly Fatigue Trend */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
          <h3 className="font-semibold text-foreground mb-0.5">Yearly Fatigue Trend</h3>
          <p className="text-xs text-muted-foreground mb-5">Team avg vs. industry with risk threshold</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={fatigueData} margin={{ left: -20 }}>
              <defs>
                <linearGradient id="gA2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94A3B8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="team" stroke="#4F46E5" strokeWidth={2.5} fill="url(#gA2)" name="Team" />
              <Line type="monotone" dataKey="industry" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" name="Industry" dot={false} />
              <Line type="monotone" dataKey="threshold" stroke="#F43F5E" strokeWidth={1.5} strokeDasharray="3 3" name="Threshold" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI-Generated Insights */}
      <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-foreground">AI-Generated Insights</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Automated analysis · refreshed every 4 hours</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Live
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[
            {
              title: "Peak Fatigue Window Identified",
              desc: "Wednesday 2–6 PM shows the highest fatigue concentration (avg 68%). Recommend mandatory break enforcement and 20% staffing rotation during this window.",
              type: "insight", icon: Brain,
            },
            {
              title: "Operations Dept. — Staffing Gap",
              desc: "Operations team is 27% understaffed on Thursday evenings. Three internal contractors are available for rapid deployment at standard cost.",
              type: "alert", icon: AlertTriangle,
            },
            {
              title: "Compliance Trend Improving",
              desc: "Compliance score increased 2.1% this quarter. Engineering and HR lead at 100%. Warehouse and ICU require documentation remediation by Aug 31.",
              type: "positive", icon: TrendingUp,
            },
          ].map(item => (
            <div key={item.title} className={`p-5 rounded-2xl border ${
              item.type === "alert" ? "border-amber-200 bg-amber-50/60 dark:border-amber-800/30 dark:bg-amber-950/20" :
              item.type === "positive" ? "border-emerald-200 bg-emerald-50/60 dark:border-emerald-800/30 dark:bg-emerald-950/20" :
              "border-indigo-200 bg-indigo-50/60 dark:border-indigo-800/30 dark:bg-indigo-950/20"
            }`}>
              <item.icon size={18} className={`mb-3 ${
                item.type === "alert" ? "text-amber-600 dark:text-amber-400" :
                item.type === "positive" ? "text-emerald-600 dark:text-emerald-400" :
                "text-indigo-600 dark:text-indigo-400"
              }`} />
              <h4 className="font-semibold text-foreground text-sm mb-2">{item.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
