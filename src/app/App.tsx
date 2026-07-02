import { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard, Users, Calendar, Brain, ClipboardList, Bell,
  Map, FileText, Settings, Shield, LogOut, Sun, Moon, Search,
  Plus, X, Send, MessageSquare, ChevronRight, ChevronLeft,
  MoreHorizontal, TrendingUp, AlertTriangle, CheckCircle, Clock,
  Heart, Award, Download, Eye, Edit, Lock, Mail,
  ArrowUpRight, ArrowDownRight, Zap, RefreshCw, Globe, BarChart2,
  AlertCircle, Info, ArrowRight, CheckSquare, XCircle, Activity,
  Building, Target, UserCheck, Layers
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Role = "superadmin" | "hrmanager" | "opsmanager" | "supervisor" | "employee";
type Page =
  | "dashboard" | "analytics" | "shifts" | "employees" | "ai-insights"
  | "leave-ot" | "heatmap" | "notifications" | "audit" | "settings" | "rbac";

// ─── MOCK DATA ─────────────────────────────────────────────────────────────────
const employees = [
  { id: 1, name: "Sarah Chen", role: "Senior Nurse", dept: "ICU", avatar: "SC", fatigue: 72, wellness: 65, attendance: 94, shifts: 24, status: "active" },
  { id: 2, name: "Marcus Rivera", role: "Operations Lead", dept: "Logistics", avatar: "MR", fatigue: 45, wellness: 88, attendance: 98, shifts: 20, status: "active" },
  { id: 3, name: "Priya Patel", role: "HR Specialist", dept: "Human Resources", avatar: "PP", fatigue: 30, wellness: 92, attendance: 100, shifts: 22, status: "active" },
  { id: 4, name: "James O'Brien", role: "Warehouse Manager", dept: "Operations", avatar: "JO", fatigue: 85, wellness: 48, attendance: 89, shifts: 28, status: "at-risk" },
  { id: 5, name: "Aisha Kamara", role: "Compliance Officer", dept: "Legal", avatar: "AK", fatigue: 25, wellness: 95, attendance: 100, shifts: 18, status: "active" },
  { id: 6, name: "David Kim", role: "Engineering Lead", dept: "Engineering", avatar: "DK", fatigue: 60, wellness: 75, attendance: 96, shifts: 22, status: "active" },
];

const fatigueData = [
  { month: "Jan", team: 42, industry: 48, threshold: 70 },
  { month: "Feb", team: 38, industry: 51, threshold: 70 },
  { month: "Mar", team: 55, industry: 49, threshold: 70 },
  { month: "Apr", team: 48, industry: 52, threshold: 70 },
  { month: "May", team: 61, industry: 54, threshold: 70 },
  { month: "Jun", team: 58, industry: 53, threshold: 70 },
  { month: "Jul", team: 45, industry: 50, threshold: 70 },
  { month: "Aug", team: 52, industry: 55, threshold: 70 },
  { month: "Sep", team: 49, industry: 51, threshold: 70 },
  { month: "Oct", team: 63, industry: 57, threshold: 70 },
  { month: "Nov", team: 57, industry: 56, threshold: 70 },
  { month: "Dec", team: 51, industry: 54, threshold: 70 },
];

const staffingData = [
  { dept: "ICU", required: 12, actual: 9 },
  { dept: "Logistics", required: 20, actual: 19 },
  { dept: "HR", required: 8, actual: 8 },
  { dept: "Operations", required: 15, actual: 11 },
  { dept: "Engineering", required: 10, actual: 10 },
  { dept: "Legal", required: 6, actual: 5 },
];

const complianceData = [
  { name: "Compliant", value: 87, color: "#10B981" },
  { name: "At Risk", value: 8, color: "#F59E0B" },
  { name: "Non-compliant", value: 5, color: "#F43F5E" },
];

const weeklyWorkloadData = [
  { day: "Mon", hours: 8.2, fatigue: 45, ot: 0.5 },
  { day: "Tue", hours: 8.5, fatigue: 48, ot: 0.8 },
  { day: "Wed", hours: 9.1, fatigue: 58, ot: 1.1 },
  { day: "Thu", hours: 8.8, fatigue: 52, ot: 0.9 },
  { day: "Fri", hours: 8.4, fatigue: 55, ot: 0.6 },
  { day: "Sat", hours: 7.2, fatigue: 38, ot: 0 },
  { day: "Sun", hours: 6.8, fatigue: 30, ot: 0 },
];

const shifts = [
  { id: 1, employee: "Sarah Chen", day: "Mon", start: "07:00", end: "15:00", type: "morning", conflict: false },
  { id: 2, employee: "Marcus Rivera", day: "Mon", start: "09:00", end: "17:00", type: "day", conflict: false },
  { id: 3, employee: "James O'Brien", day: "Mon", start: "15:00", end: "23:00", type: "evening", conflict: true },
  { id: 4, employee: "Sarah Chen", day: "Tue", start: "07:00", end: "15:00", type: "morning", conflict: false },
  { id: 5, employee: "Aisha Kamara", day: "Tue", start: "09:00", end: "17:00", type: "day", conflict: false },
  { id: 6, employee: "David Kim", day: "Wed", start: "09:00", end: "17:00", type: "day", conflict: false },
  { id: 7, employee: "James O'Brien", day: "Wed", start: "07:00", end: "15:00", type: "morning", conflict: true },
  { id: 8, employee: "Priya Patel", day: "Thu", start: "09:00", end: "17:00", type: "day", conflict: false },
  { id: 9, employee: "Marcus Rivera", day: "Fri", start: "09:00", end: "17:00", type: "day", conflict: false },
  { id: 10, employee: "David Kim", day: "Fri", start: "09:00", end: "17:00", type: "day", conflict: false },
  { id: 11, employee: "Priya Patel", day: "Mon", start: "09:00", end: "17:00", type: "day", conflict: false },
  { id: 12, employee: "Aisha Kamara", day: "Thu", start: "09:00", end: "17:00", type: "day", conflict: false },
];

const leaveRequests = [
  { id: 1, employee: "Sarah Chen", type: "Annual Leave", start: "2024-08-15", end: "2024-08-19", days: 5, status: "pending", reason: "Family vacation planned" },
  { id: 2, employee: "James O'Brien", type: "Sick Leave", start: "2024-08-10", end: "2024-08-12", days: 3, status: "approved", reason: "Medical appointment" },
  { id: 3, employee: "David Kim", type: "Overtime", start: "2024-08-08", end: "2024-08-08", days: 1, status: "pending", reason: "Q3 project delivery deadline" },
  { id: 4, employee: "Priya Patel", type: "Annual Leave", start: "2024-09-01", end: "2024-09-05", days: 5, status: "approved", reason: "Personal travel" },
  { id: 5, employee: "Marcus Rivera", type: "Overtime", start: "2024-08-12", end: "2024-08-12", days: 1, status: "rejected", reason: "Department over OT budget" },
  { id: 6, employee: "Aisha Kamara", type: "Maternity Leave", start: "2024-09-15", end: "2024-12-15", days: 90, status: "pending", reason: "Maternity leave" },
];

const notifications = [
  { id: 1, type: "alert", title: "High fatigue risk detected", message: "James O'Brien shows 85% fatigue risk. Recommend immediate shift adjustment.", time: "2m ago", read: false },
  { id: 2, type: "info", title: "Shift coverage gap in ICU", message: "ICU department has 25% staffing gap for tomorrow evening shift.", time: "15m ago", read: false },
  { id: 3, type: "success", title: "Leave request approved", message: "Priya Patel's annual leave has been approved by HR Manager.", time: "1h ago", read: false },
  { id: 4, type: "warning", title: "Compliance deadline approaching", message: "Q3 compliance reports are due in 5 days. 3 departments pending.", time: "3h ago", read: true },
  { id: 5, type: "info", title: "New employee onboarded", message: "Li Wei has completed onboarding and is now active in the system.", time: "1d ago", read: true },
  { id: 6, type: "alert", title: "Overtime threshold exceeded", message: "Engineering team has exceeded monthly overtime allowance by 18%.", time: "2d ago", read: true },
];

const auditLogs = [
  { id: 1, user: "Priya Patel", action: "Approved leave request", target: "Sarah Chen", time: "2024-08-07 14:32", type: "approval" },
  { id: 2, user: "System AI", action: "Generated fatigue risk report", target: "James O'Brien", time: "2024-08-07 13:15", type: "ai" },
  { id: 3, user: "Marcus Rivera", action: "Updated shift schedule", target: "Week 33 — Operations", time: "2024-08-07 11:45", type: "update" },
  { id: 4, user: "Admin", action: "Modified RBAC permissions", target: "Supervisor role group", time: "2024-08-07 10:20", type: "security" },
  { id: 5, user: "Aisha Kamara", action: "Exported compliance report", target: "Q2 2024 — Legal", time: "2024-08-07 09:30", type: "export" },
  { id: 6, user: "System", action: "Automated shift optimization", target: "Operations dept — Week 34", time: "2024-08-07 08:00", type: "ai" },
  { id: 7, user: "James O'Brien", action: "Submitted overtime request", target: "Self — Aug 8", time: "2024-08-06 17:15", type: "request" },
  { id: 8, user: "David Kim", action: "Acknowledged fatigue alert", target: "Self", time: "2024-08-06 16:40", type: "acknowledgment" },
];

const heatmapData = [
  { team: "ICU Team A", Mon: 92, Tue: 88, Wed: 95, Thu: 78, Fri: 85, Sat: 70, Sun: 60 },
  { team: "ICU Team B", Mon: 65, Tue: 70, Wed: 68, Thu: 72, Fri: 66, Sat: 80, Sun: 88 },
  { team: "Logistics", Mon: 75, Tue: 72, Wed: 78, Thu: 69, Fri: 88, Sat: 45, Sun: 30 },
  { team: "Operations", Mon: 85, Tue: 90, Wed: 88, Thu: 92, Fri: 78, Sat: 50, Sun: 40 },
  { team: "Engineering", Mon: 55, Tue: 60, Wed: 72, Thu: 68, Fri: 65, Sat: 20, Sun: 15 },
  { team: "HR & Legal", Mon: 70, Tue: 65, Wed: 68, Thu: 71, Fri: 60, Sat: 10, Sun: 5 },
];

const aiInsights = [
  {
    id: 1, employee: "James O'Brien", avatar: "JO", riskLevel: "high", riskPct: 85,
    factors: ["28 shifts this month (avg 22)", "3 consecutive 10-hour shifts", "Declining performance score (−14%)"],
    recommendation: "Immediate relief recommended. 2-day rest period before next shift assignment.",
    replacements: ["Marcus Rivera — 45% fatigue", "David Kim — 60% fatigue"],
  },
  {
    id: 2, employee: "Sarah Chen", avatar: "SC", riskLevel: "medium", riskPct: 72,
    factors: ["24 shifts this month", "2 consecutive night shifts", "Reduced break compliance"],
    recommendation: "Schedule rotation to day shift from next Monday. Monitor for 2 weeks.",
    replacements: ["Priya Patel — 30% fatigue", "Aisha Kamara — 25% fatigue"],
  },
  {
    id: 3, employee: "David Kim", avatar: "DK", riskLevel: "medium", riskPct: 60,
    factors: ["22 shifts this month", "Project overtime last week (+4h)"],
    recommendation: "Avoid overtime for next 2 weeks. Current trajectory manageable.",
    replacements: ["Marcus Rivera — 45% fatigue"],
  },
];

const initialChatMessages = [
  { role: "assistant", content: "Hello! I'm WorkSphere AI. I can analyze workforce data, optimize schedules, flag risk, and surface insights across your organization. What would you like to know?" },
];

const chatResponses: Record<string, string> = {
  "Who has the highest fatigue risk today?": "James O'Brien has the highest fatigue risk at 85%. He has worked 28 shifts this month (avg: 22) and completed 3 consecutive 10-hour shifts. I recommend immediate relief — reassign his next 2 shifts to Marcus Rivera (45% fatigue) or David Kim (60% fatigue).",
  "Show me ICU staffing gaps": "The ICU currently has a 25% staffing gap: 9 of 12 required staff covered. ICU Team A is running at 92% workload on Mondays. I recommend deploying 2 nurses from the internal relief pool and flagging this to the HR Manager.",
  "Summarize pending leave requests": "3 leave requests are pending review: Sarah Chen (5-day annual, Aug 15–19 — may impact ICU scheduling), David Kim (overtime claim, Aug 8), and Aisha Kamara (90-day maternity, Sep 15). Aisha's request is time-sensitive for succession planning.",
  "Optimize this week's shifts": "Recommended optimizations: (1) Remove James O'Brien from Wednesday morning shift — replace with Marcus Rivera. (2) Rotate Sarah Chen to day shift from Tuesday. (3) Add 1 staff to Operations Thursday evening. Net effect: average fatigue drops from 61% to 47%.",
};

// ─── UI PRIMITIVES ────────────────────────────────────────────────────────────

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "indigo" | "violet";

function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: BadgeVariant }) {
  const v: Record<BadgeVariant, string> = {
    default: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    danger: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
    info: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400",
    indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
    violet: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${v[variant]}`}>
      {children}
    </span>
  );
}

type AvatarColor = "indigo" | "emerald" | "rose" | "amber" | "violet";

function Avatar({ initials, size = "md", color = "indigo" }: { initials: string; size?: "sm" | "md" | "lg"; color?: AvatarColor }) {
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-9 h-9 text-sm", lg: "w-12 h-12 text-base" };
  const colors: Record<AvatarColor, string> = {
    indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300",
    emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
    rose: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
    violet: "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300",
  };
  return (
    <div className={`${sizes[size]} ${colors[color]} rounded-xl flex items-center justify-center font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, change, positive, color = "indigo" }: {
  icon: React.ElementType; label: string; value: string | number;
  change?: number; positive?: boolean; color?: string;
}) {
  const iconColors: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
    rose: "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400",
    violet: "bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400",
  };
  return (
    <div className="bg-card rounded-2xl p-5 border border-border shadow-sm hover:shadow-md transition-all duration-200 cursor-default group">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${iconColors[color] || iconColors.indigo}`}>
          <Icon size={18} />
        </div>
        {change !== undefined && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-lg ${
            positive ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                     : "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
          }`}>
            {positive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
            {change}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-foreground mb-0.5 group-hover:text-primary transition-colors">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function ProgressBar({ value, color = "indigo" }: { value: number; color?: string }) {
  const colors: Record<string, string> = {
    indigo: "bg-indigo-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-400",
    rose: "bg-rose-500",
  };
  const c = value > 75 ? "bg-rose-500" : value > 50 ? "bg-amber-400" : "bg-emerald-500";
  const chosen = color === "auto" ? c : (colors[color] || colors.indigo);
  return (
    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
      <div className={`h-full rounded-full transition-all duration-700 ${chosen}`} style={{ width: `${Math.min(value, 100)}%` }} />
    </div>
  );
}

function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {subtitle && <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "12px",
  fontSize: "12px",
  color: "var(--foreground)",
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (role: Role) => void }) {
  const [email, setEmail] = useState("admin@worksphere.ai");
  const [password, setPassword] = useState("•••••••••••");
  const [selectedRole, setSelectedRole] = useState<Role>("superadmin");
  const [loading, setLoading] = useState(false);

  const roles: { value: Role; label: string; desc: string; color: string }[] = [
    { value: "superadmin", label: "Super Admin", desc: "Full system access & configuration", color: "text-violet-600 dark:text-violet-400" },
    { value: "hrmanager", label: "HR Manager", desc: "Workforce, leave & contract management", color: "text-indigo-600 dark:text-indigo-400" },
    { value: "opsmanager", label: "Operations Manager", desc: "Scheduling, coverage & analytics", color: "text-sky-600 dark:text-sky-400" },
    { value: "supervisor", label: "Supervisor", desc: "Team oversight & approval workflow", color: "text-emerald-600 dark:text-emerald-400" },
    { value: "employee", label: "Employee", desc: "Personal profile & schedule", color: "text-amber-600 dark:text-amber-400" },
  ];

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(selectedRole); }, 800);
  };

  return (
    <div className="min-h-screen flex bg-background font-[Inter,sans-serif]">
      {/* Left branding panel */}
      <div className="hidden lg:flex w-[46%] bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 flex-col justify-between p-14 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-900/40 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-400/10 rounded-full blur-2xl" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/20 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-bold text-xl tracking-tight">WorkSphere AI</span>
          </div>
          <h1 className="text-[2.6rem] font-bold text-white leading-[1.2] mb-5 tracking-tight">
            Intelligent Workforce<br />Management
          </h1>
          <p className="text-indigo-200 text-base leading-relaxed mb-12 max-w-md">
            AI-powered scheduling, fatigue monitoring, compliance tracking, and workforce intelligence — unified in one enterprise platform.
          </p>
          <div className="space-y-3.5">
            {[
              { icon: Brain, text: "Explainable AI fatigue risk detection" },
              { icon: BarChart2, text: "Real-time analytics and compliance insights" },
              { icon: Calendar, text: "Smart shift planning with conflict prevention" },
              { icon: Shield, text: "Enterprise RBAC and granular permissions" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3.5">
                <div className="w-8 h-8 rounded-xl bg-white/15 border border-white/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={15} className="text-white" />
                </div>
                <span className="text-indigo-100 text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-8 pt-8 border-t border-white/15">
          {[["98.2%", "Uptime SLA"], ["500+", "Enterprise clients"], ["2.4M", "Employees managed"]].map(([val, lbl]) => (
            <div key={lbl}>
              <div className="text-2xl font-bold text-white">{val}</div>
              <div className="text-xs text-indigo-300 mt-0.5">{lbl}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right auth panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[440px]">
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-foreground">WorkSphere AI</span>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-1">Welcome back</h2>
          <p className="text-muted-foreground text-sm mb-8">Sign in to your enterprise workspace</p>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all" />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-semibold text-foreground">Password</label>
                <button className="text-xs text-primary hover:underline font-medium">Forgot password?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Demo — Sign in as</label>
              <div className="space-y-1.5">
                {roles.map(r => (
                  <button key={r.value} onClick={() => setSelectedRole(r.value)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border text-left transition-all ${
                      selectedRole === r.value
                        ? "border-primary/40 bg-indigo-50 dark:bg-indigo-950/40"
                        : "border-border hover:border-primary/20 hover:bg-muted/40"
                    }`}>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${selectedRole === r.value ? "bg-indigo-600" : "bg-muted-foreground/20"}`} />
                    <div className="flex-1">
                      <span className={`text-sm font-semibold ${selectedRole === r.value ? r.color : "text-foreground"}`}>{r.label}</span>
                      <span className="text-xs text-muted-foreground ml-2">{r.desc}</span>
                    </div>
                    {selectedRole === r.value && <CheckCircle size={14} className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleSubmit} disabled={loading}
              className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70">
              {loading ? (
                <><RefreshCw size={15} className="animate-spin" /> Signing in…</>
              ) : (
                <>Sign in to WorkSphere <ArrowRight size={15} /></>
              )}
            </button>
          </div>

          <div className="mt-7 flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or continue with SSO</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {["Microsoft Azure AD", "Google Workspace"].map(sso => (
              <button key={sso} className="py-2.5 border border-border rounded-xl text-sm text-foreground hover:bg-muted/50 transition-all flex items-center justify-center gap-2">
                <Globe size={14} className="text-muted-foreground" /> {sso}
              </button>
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            Protected by enterprise-grade security · SOC 2 Type II certified
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function DashboardScreen({ role }: { role: Role }) {
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

// ─── ANALYTICS ────────────────────────────────────────────────────────────────
function AnalyticsScreen() {
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

// ─── SHIFT PLANNER ────────────────────────────────────────────────────────────
function ShiftPlannerScreen() {
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
        <div className="xl:col-span-3 bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          {/* Day headers */}
          <div className="grid grid-cols-8 border-b border-border bg-muted/30">
            <div className="p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Employee</div>
            {days.map((day, i) => (
              <div key={day}
                onClick={() => setSelectedDay(day === selectedDay ? null : day)}
                className={`p-3 text-center border-l border-border cursor-pointer transition-colors select-none ${selectedDay === day ? "bg-primary/8 dark:bg-primary/10" : "hover:bg-muted/50"}`}>
                <div className="text-xs font-semibold text-muted-foreground uppercase">{day}</div>
                <div className={`text-xl font-bold mt-0.5 ${selectedDay === day ? "text-primary" : "text-foreground"}`}>{dates[i]}</div>
              </div>
            ))}
          </div>

          {/* Rows */}
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

// ─── EMPLOYEE PROFILES ────────────────────────────────────────────────────────
function EmployeeProfileScreen() {
  const [selected, setSelected] = useState(employees[3]);
  const [search, setSearch] = useState("");

  const certs = ["OSHA Safety Certification", "Forklift Operator Level 3", "First Aid & CPR", "Hazmat Handling Level 2"];
  const leave = [{ type: "Annual", used: 8, total: 20 }, { type: "Sick", used: 3, total: 12 }, { type: "Personal", used: 1, total: 5 }];
  const attendance = [
    { month: "Mar", p: 22, a: 1 }, { month: "Apr", p: 21, a: 2 }, { month: "May", p: 23, a: 0 },
    { month: "Jun", p: 20, a: 3 }, { month: "Jul", p: 22, a: 1 }, { month: "Aug", p: 7, a: 1 },
  ];

  const filtered = employees.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.dept.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <SectionHeader title="Employee Profiles"
        action={
          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm hover:bg-primary/90 transition-all">
            <Plus size={14} /> New Employee
          </button>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* List */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search employees…"
                className="w-full pl-8 pr-3 py-2 bg-muted/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
          </div>
          <div className="divide-y divide-border overflow-y-auto max-h-[600px]">
            {filtered.map(emp => (
              <button key={emp.id} onClick={() => setSelected(emp)}
                className={`w-full flex items-center gap-3 p-4 text-left transition-colors hover:bg-muted/30 ${selected.id === emp.id ? "bg-primary/6 dark:bg-primary/10 border-l-2 border-l-primary" : ""}`}>
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

        {/* Detail */}
        <div className="xl:col-span-3 space-y-5">
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
                  {[["Attendance", `${selected.attendance}%`, "indigo"], ["Shifts/mo", selected.shifts, "amber"], ["Wellness", `${selected.wellness}/100`, "emerald"], ["Fatigue", `${selected.fatigue}%`, "rose"]].map(([lbl, val, c]) => (
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

// ─── AI INSIGHTS ──────────────────────────────────────────────────────────────
function AIInsightsScreen() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="AI Recommendation Center"
        subtitle="Explainable AI-driven workforce insights and optimization actions"
        action={
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-full">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Model updated 2h ago
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <KpiCard icon={Users} label="Employees Analyzed" value="1,247" color="indigo" />
        <KpiCard icon={AlertTriangle} label="High Risk Detected" value="23" color="rose" />
        <KpiCard icon={Zap} label="Actions Recommended" value="47" color="amber" />
      </div>

      <div className="space-y-5">
        {aiInsights.map(insight => (
          <div key={insight.id} className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start gap-5">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold flex-shrink-0 ${
                insight.riskLevel === "high" ? "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400" :
                insight.riskLevel === "medium" ? "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400" :
                "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
              }`}>
                {insight.avatar}
              </div>

              <div className="flex-1 min-w-0">
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
                      <span className="text-sm text-muted-foreground">fatigue risk probability</span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-sm">
                      Apply Recommendation
                    </button>
                    <button className="px-4 py-2 border border-border text-sm font-semibold rounded-xl hover:bg-muted/50 transition-all">
                      Dismiss
                    </button>
                  </div>
                </div>

                <div className="h-2 bg-muted rounded-full mb-5 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{
                    width: `${insight.riskPct}%`,
                    background: insight.riskLevel === "high" ? "#F43F5E" : insight.riskLevel === "medium" ? "#F59E0B" : "#10B981",
                  }} />
                </div>

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
                    <div className="space-y-2">
                      {insight.replacements.map(r => (
                        <div key={r} className="flex items-center gap-2.5 p-2.5 bg-emerald-50/80 dark:bg-emerald-950/30 rounded-xl border border-emerald-200/60 dark:border-emerald-800/30">
                          <CheckCircle size={13} className="text-emerald-500 flex-shrink-0" />
                          <span className="text-sm text-emerald-800 dark:text-emerald-300">{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── LEAVE & OT ───────────────────────────────────────────────────────────────
function LeaveOTScreen() {
  const [filter, setFilter] = useState("all");
  const [reqs, setReqs] = useState(leaveRequests);

  const filtered = filter === "all" ? reqs : reqs.filter(r => r.status === filter);

  const approve = (id: number) => setReqs(r => r.map(x => x.id === id ? { ...x, status: "approved" } : x));
  const reject = (id: number) => setReqs(r => r.map(x => x.id === id ? { ...x, status: "rejected" } : x));

  return (
    <div className="space-y-8">
      <SectionHeader title="Leave & Overtime"
        subtitle="Manage and approve workforce time-off and overtime requests"
        action={
          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm hover:bg-primary/90 transition-all">
            <Plus size={14} /> New Request
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={ClipboardList} label="Total Requests" value={reqs.length} color="indigo" />
        <KpiCard icon={Clock} label="Pending Review" value={reqs.filter(r => r.status === "pending").length} color="amber" />
        <KpiCard icon={CheckCircle} label="Approved" value={reqs.filter(r => r.status === "approved").length} color="emerald" />
        <KpiCard icon={XCircle} label="Rejected" value={reqs.filter(r => r.status === "rejected").length} color="rose" />
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="flex items-center gap-2 p-4 border-b border-border">
          {["all", "pending", "approved", "rejected"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${filter === f ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}>
              {f} {f === "all" ? `(${reqs.length})` : `(${reqs.filter(r => r.status === f).length})`}
            </button>
          ))}
        </div>

        <div className="divide-y divide-border">
          {filtered.map(req => (
            <div key={req.id} className="p-5 hover:bg-muted/20 transition-colors">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-4">
                  <Avatar initials={req.employee.split(" ").map(n => n[0]).join("")} />
                  <div>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="font-semibold text-foreground">{req.employee}</span>
                      <Badge variant="indigo">{req.type}</Badge>
                      <Badge variant={req.status === "approved" ? "success" : req.status === "rejected" ? "danger" : "warning"}>
                        {req.status === "approved" ? "✓ Approved" : req.status === "rejected" ? "✗ Rejected" : "⏳ Pending"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{req.start} → {req.end} · <strong className="text-foreground">{req.days} day{req.days > 1 ? "s" : ""}</strong></p>
                    <p className="text-sm text-muted-foreground mt-0.5">{req.reason}</p>
                  </div>
                </div>
                {req.status === "pending" && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => approve(req.id)} className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-all">
                      <CheckCircle size={13} /> Approve
                    </button>
                    <button onClick={() => reject(req.id)} className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-500 text-white text-sm font-semibold rounded-xl hover:bg-rose-600 transition-all">
                      <X size={13} /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <CheckCircle size={32} className="text-emerald-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-foreground">All clear</p>
              <p className="text-xs text-muted-foreground mt-1">No {filter} requests at this time</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── HEATMAP ──────────────────────────────────────────────────────────────────
function HeatmapScreen() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const cellStyle = (v: number) => {
    if (v >= 85) return "bg-rose-500 text-white";
    if (v >= 70) return "bg-orange-400 text-white";
    if (v >= 55) return "bg-amber-400 text-white";
    if (v >= 35) return "bg-emerald-400 text-white";
    return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200";
  };

  return (
    <div className="space-y-8">
      <SectionHeader title="Workforce Heatmap" subtitle="Team workload intensity, staffing gaps, and overload visualization" />

      <div className="bg-card rounded-2xl p-6 border border-border shadow-sm overflow-x-auto">
        <h3 className="font-semibold text-foreground mb-5">Weekly Workload Intensity by Team</h3>
        <div className="min-w-[640px]">
          <div className="grid grid-cols-8 gap-2 mb-3">
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Team</div>
            {days.map(d => <div key={d} className="text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">{d}</div>)}
          </div>
          {heatmapData.map(row => (
            <div key={row.team} className="grid grid-cols-8 gap-2 mb-2">
              <div className="text-sm font-semibold text-foreground flex items-center pr-3 truncate">{row.team}</div>
              {days.map(day => {
                const val = row[day as keyof typeof row] as number;
                return (
                  <div key={day}
                    className={`${cellStyle(val)} h-12 rounded-xl flex items-center justify-center text-xs font-bold cursor-default hover:opacity-85 transition-opacity`}
                    title={`${row.team} — ${day}: ${val}% workload`}>
                    {val}%
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <span className="text-sm font-semibold text-muted-foreground">Intensity key:</span>
        {[["bg-emerald-100 dark:bg-emerald-900/40", "Low (<35%)"], ["bg-emerald-400", "Moderate (35–54%)"], ["bg-amber-400", "High (55–69%)"], ["bg-orange-400", "Very High (70–84%)"], ["bg-rose-500", "Critical (85%+)"]].map(([c, l]) => (
          <div key={l} className="flex items-center gap-1.5">
            <div className={`w-3.5 h-3.5 rounded-sm ${c}`} />
            <span className="text-xs text-muted-foreground">{l}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
          <h3 className="font-semibold text-foreground mb-5">Most Overloaded Teams (Weekday Avg)</h3>
          <div className="space-y-4">
            {heatmapData
              .map(row => ({ team: row.team, avg: Math.round((row.Mon + row.Tue + row.Wed + row.Thu + row.Fri) / 5) }))
              .sort((a, b) => b.avg - a.avg)
              .map(item => (
                <div key={item.team} className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground w-28 flex-shrink-0 truncate">{item.team}</span>
                  <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.avg >= 75 ? "bg-rose-500" : item.avg >= 60 ? "bg-amber-400" : "bg-emerald-400"}`} style={{ width: `${item.avg}%` }} />
                  </div>
                  <span className={`text-sm font-bold w-10 text-right ${item.avg >= 75 ? "text-rose-600" : item.avg >= 60 ? "text-amber-600" : "text-emerald-600"}`}>{item.avg}%</span>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
          <h3 className="font-semibold text-foreground mb-5">Weekend Staffing Gaps</h3>
          <div className="space-y-3">
            {heatmapData
              .map(row => ({ team: row.team, gap: Math.round(((row.Mon + row.Tue) / 2) - ((row.Sat + row.Sun) / 2)) }))
              .filter(r => r.gap > 20)
              .sort((a, b) => b.gap - a.gap)
              .map(item => (
                <div key={item.team} className="flex items-center gap-3 p-3.5 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200/60 dark:border-amber-800/30">
                  <AlertTriangle size={15} className="text-amber-500 flex-shrink-0" />
                  <span className="text-sm font-semibold text-foreground flex-1">{item.team}</span>
                  <Badge variant="warning">−{item.gap}% weekend</Badge>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
function NotificationsScreen() {
  const [notifs, setNotifs] = useState(notifications);
  const iconMap: Record<string, React.ElementType> = { alert: AlertTriangle, info: Info, success: CheckCircle, warning: AlertCircle };
  const colorMap: Record<string, string> = {
    alert: "text-rose-500 bg-rose-50 dark:bg-rose-950/40",
    info: "text-sky-500 bg-sky-50 dark:bg-sky-950/40",
    success: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40",
    warning: "text-amber-500 bg-amber-50 dark:bg-amber-950/40",
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Notifications"
        subtitle={`${notifs.filter(n => !n.read).length} unread notifications`}
        action={
          <button onClick={() => setNotifs(n => n.map(x => ({ ...x, read: true })))}
            className="text-sm text-primary hover:underline font-semibold">
            Mark all as read
          </button>
        }
      />
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden divide-y divide-border">
        {notifs.map(notif => {
          const Icon = iconMap[notif.type];
          return (
            <div key={notif.id}
              className={`p-5 flex items-start gap-4 hover:bg-muted/20 transition-colors cursor-pointer ${!notif.read ? "bg-primary/3 dark:bg-primary/5" : ""}`}
              onClick={() => setNotifs(n => n.map(x => x.id === notif.id ? { ...x, read: true } : x))}>
              <div className={`p-2.5 rounded-xl flex-shrink-0 ${colorMap[notif.type]}`}>
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className={`text-sm font-semibold ${!notif.read ? "text-foreground" : "text-muted-foreground"}`}>{notif.title}</span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-muted-foreground">{notif.time}</span>
                    {!notif.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{notif.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── AUDIT LOGS ───────────────────────────────────────────────────────────────
function AuditLogsScreen() {
  const typeStyle: Record<string, BadgeVariant> = {
    approval: "success", ai: "indigo", update: "info", security: "danger",
    export: "warning", request: "default", acknowledgment: "default",
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Audit Logs"
        subtitle="Immutable activity trail with timestamps and actor attribution"
        action={
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input placeholder="Search logs…"
                className="pl-9 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 w-52" />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl text-sm hover:bg-muted/50 transition-all">
              <Download size={13} /> Export CSV
            </button>
          </div>
        }
      />
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              {["Actor", "Action", "Target", "Type", "Timestamp"].map(h => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {auditLogs.map(log => (
              <tr key={log.id} className="hover:bg-muted/15 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <Avatar initials={log.user.split(" ").map(n => n[0]).join("").slice(0, 2) || "SY"} size="sm" color="indigo" />
                    <span className="text-sm font-semibold text-foreground">{log.user}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-muted-foreground">{log.action}</td>
                <td className="px-5 py-4 text-sm text-foreground">{log.target}</td>
                <td className="px-5 py-4">
                  <Badge variant={typeStyle[log.type] || "default"}>{log.type}</Badge>
                </td>
                <td className="px-5 py-4 text-sm text-muted-foreground font-mono text-xs">{log.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────
function SettingsScreen() {
  const [tab, setTab] = useState("organization");
  const [toggles, setToggles] = useState([true, true, true, false]);
  const tabs = ["organization", "profile", "notifications", "integrations", "security"];

  return (
    <div className="space-y-8">
      <SectionHeader title="Settings" />
      <div className="flex gap-0 border-b border-border">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-3 text-sm font-semibold capitalize border-b-2 -mb-px transition-all ${tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "organization" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card rounded-2xl p-6 border border-border shadow-sm space-y-5">
            <h3 className="font-semibold text-foreground">Organization Details</h3>
            {[["Organization Name", "Acme Corporation"], ["Industry", "Healthcare & Logistics"], ["Employee Count", "1,247"], ["Headquarters", "Sydney, NSW, Australia"], ["Time Zone", "UTC+10:00 (AEST)"]].map(([label, value]) => (
              <div key={label}>
                <label className="block text-sm font-semibold text-foreground mb-1.5">{label}</label>
                <input defaultValue={value} className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground" />
              </div>
            ))}
            <button className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all shadow-sm">
              Save Changes
            </button>
          </div>

          <div className="space-y-5">
            <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
              <h3 className="font-semibold text-foreground mb-5">Feature Toggles</h3>
              <div className="space-y-4">
                {[
                  ["AI Fatigue Monitoring", "Real-time AI fatigue risk detection across all teams"],
                  ["Automated Shift Optimization", "AI-generated schedule recommendations weekly"],
                  ["Overtime Alerts", "Alert managers when employees exceed 40h/week"],
                  ["Compliance Auto-reports", "Automated Q-end compliance report generation"],
                ].map(([label, desc], i) => (
                  <div key={label} className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-foreground">{label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
                    </div>
                    <button
                      onClick={() => setToggles(t => t.map((v, j) => j === i ? !v : v))}
                      className={`w-11 h-6 rounded-full flex-shrink-0 flex items-center px-1 cursor-pointer transition-all duration-200 ${toggles[i] ? "bg-primary justify-end" : "bg-muted justify-start"}`}>
                      <div className="w-4 h-4 bg-white rounded-full shadow-sm transition-all" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30 rounded-2xl p-5 border border-indigo-200/60 dark:border-indigo-800/30">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center flex-shrink-0">
                  <Zap size={18} className="text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-sm">WorkSphere AI Pro</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">Your plan includes predictive analytics, advanced RBAC, API access, and priority support.</p>
                  <button className="mt-3 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                    Manage subscription <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-2xl p-16 border border-border shadow-sm flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Settings size={24} className="text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-foreground mb-2 capitalize">{tab} Settings</h3>
          <p className="text-sm text-muted-foreground max-w-xs">This section is fully available in the production version of WorkSphere AI.</p>
          <button className="mt-5 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all">
            Request Access
          </button>
        </div>
      )}
    </div>
  );
}

// ─── RBAC ─────────────────────────────────────────────────────────────────────
function RBACScreen() {
  const roles = [
    { name: "Super Admin", users: 2, color: "violet", perms: ["All system access", "RBAC management", "System settings", "API access"] },
    { name: "HR Manager", users: 8, color: "indigo", perms: ["View employees", "Approve leave", "Generate reports", "Manage contracts"] },
    { name: "Operations Manager", users: 14, color: "sky", perms: ["View schedules", "Edit shifts", "Approve overtime", "View analytics"] },
    { name: "Supervisor", users: 43, color: "emerald", perms: ["View team", "Submit requests", "View dept reports"] },
    { name: "Employee", users: 1180, color: "amber", perms: ["Own profile only", "Submit leave", "View schedule"] },
  ];

  const allPerms = [
    "View all employees", "Edit employee records", "Approve leave", "Approve overtime",
    "View analytics", "Export reports", "Edit shifts", "Create shifts",
    "RBAC management", "System settings", "View own profile", "Submit leave",
  ];

  const rolePerms: Record<string, string[]> = {
    "Super Admin": allPerms,
    "HR Manager": ["View all employees", "Edit employee records", "Approve leave", "View analytics", "Export reports"],
    "Operations Manager": ["View all employees", "Approve overtime", "View analytics", "Edit shifts", "Create shifts"],
    "Supervisor": ["View all employees", "View analytics"],
    "Employee": ["View own profile", "Submit leave"],
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        title="RBAC & Permissions"
        subtitle="Role-based access control — define and assign granular permissions"
        action={
          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm hover:bg-primary/90 transition-all">
            <Plus size={14} /> New Role
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {roles.map(role => (
          <div key={role.name} className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <div className={`w-3 h-3 rounded-full ${
                    role.color === "violet" ? "bg-violet-500" : role.color === "indigo" ? "bg-indigo-500" :
                    role.color === "sky" ? "bg-sky-500" : role.color === "emerald" ? "bg-emerald-500" : "bg-amber-500"
                  }`} />
                  <h3 className="font-bold text-foreground">{role.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{role.users.toLocaleString()} users assigned</p>
              </div>
              <div className="flex gap-1.5">
                <button className="p-2 rounded-xl border border-border hover:bg-muted/50 transition-colors"><Edit size={13} className="text-muted-foreground" /></button>
                <button className="p-2 rounded-xl border border-border hover:bg-muted/50 transition-colors"><Eye size={13} className="text-muted-foreground" /></button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {role.perms.map(p => (
                <Badge key={p} variant={role.name === "Super Admin" ? "indigo" : "default"}>{p}</Badge>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-2xl p-6 border border-border shadow-sm overflow-x-auto">
        <h3 className="font-semibold text-foreground mb-6">Permission Matrix</h3>
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider w-48">Permission</th>
              {roles.map(r => (
                <th key={r.name} className="pb-3 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider px-2">
                  {r.name.split(" ")[0]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {allPerms.map(perm => (
              <tr key={perm} className="hover:bg-muted/15">
                <td className="py-3 text-sm text-foreground font-medium">{perm}</td>
                {roles.map(role => {
                  const has = rolePerms[role.name]?.includes(perm) || false;
                  return (
                    <td key={role.name} className="py-3 text-center px-2">
                      {has ? (
                        <div className="w-5 h-5 bg-emerald-100 dark:bg-emerald-950/40 rounded-full flex items-center justify-center mx-auto">
                          <CheckCircle size={12} className="text-emerald-500" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 bg-muted rounded-full flex items-center justify-center mx-auto">
                          <X size={10} className="text-muted-foreground/40" />
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── AI CHATBOT ───────────────────────────────────────────────────────────────
function ChatbotPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState(initialChatMessages);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "Who has the highest fatigue risk today?",
    "Show me ICU staffing gaps",
    "Summarize pending leave requests",
    "Optimize this week's shifts",
  ];

  const send = (text?: string) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setMessages(m => [...m, { role: "user", content: msg }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      const reply = chatResponses[msg] || "I've analyzed your query against the current workforce data. For a detailed breakdown, I recommend opening the Analytics or AI Insights dashboard. Is there a specific team or metric you'd like me to focus on?";
      setMessages(m => [...m, { role: "assistant", content: reply }]);
    }, 900);
  };

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[560px] bg-card border border-border rounded-2xl shadow-2xl shadow-black/10 dark:shadow-black/40 flex flex-col z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 border border-white/20 flex items-center justify-center">
            <Brain size={17} className="text-white" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">WorkSphere AI</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs text-indigo-200">Active · GPT-4 powered</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors">
          <X size={17} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 mr-2 mt-1">
                <Zap size={12} className="text-white" />
              </div>
            )}
            <div className={`max-w-[82%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === "user"
                ? "bg-primary text-primary-foreground rounded-br-md"
                : "bg-muted/70 text-foreground rounded-bl-md"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
              <Zap size={12} className="text-white" />
            </div>
            <div className="bg-muted/70 px-4 py-3 rounded-2xl rounded-bl-md flex items-center gap-1.5">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick suggestions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-3 flex-shrink-0">
          <p className="text-xs text-muted-foreground mb-2 font-semibold">Quick questions</p>
          <div className="grid grid-cols-2 gap-1.5">
            {suggestions.map(s => (
              <button key={s} onClick={() => send(s)}
                className="text-xs text-left px-3 py-2.5 bg-muted/50 hover:bg-muted border border-border/40 rounded-xl text-muted-foreground hover:text-foreground transition-colors leading-snug">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <input value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Ask WorkSphere AI anything…"
            className="flex-1 px-4 py-2.5 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <button onClick={() => send()}
            className="p-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-all flex-shrink-0 disabled:opacity-40"
            disabled={!input.trim()}>
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── NAV ITEMS ────────────────────────────────────────────────────────────────
const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "analytics", label: "Analytics", icon: BarChart2 },
  { id: "shifts", label: "Shift Planner", icon: Calendar },
  { id: "employees", label: "Employees", icon: Users },
  { id: "ai-insights", label: "AI Insights", icon: Brain, badge: "3" },
  { id: "leave-ot", label: "Leave & Overtime", icon: ClipboardList, badge: "3" },
  { id: "heatmap", label: "Workforce Heatmap", icon: Map },
  { id: "notifications", label: "Notifications", icon: Bell, badge: "3" },
  { id: "audit", label: "Audit Logs", icon: FileText },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "rbac", label: "RBAC & Permissions", icon: Shield },
];

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<Role>("superadmin");
  const [page, setPage] = useState<Page>("dashboard");
  const [isDark, setIsDark] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  if (!isLoggedIn) {
    return <LoginScreen onLogin={(r) => { setRole(r); setIsLoggedIn(true); }} />;
  }

  const renderPage = () => {
    const pages: Record<Page, React.ReactNode> = {
      dashboard: <DashboardScreen role={role} />,
      analytics: <AnalyticsScreen />,
      shifts: <ShiftPlannerScreen />,
      employees: <EmployeeProfileScreen />,
      "ai-insights": <AIInsightsScreen />,
      "leave-ot": <LeaveOTScreen />,
      heatmap: <HeatmapScreen />,
      notifications: <NotificationsScreen />,
      audit: <AuditLogsScreen />,
      settings: <SettingsScreen />,
      rbac: <RBACScreen />,
    };
    return pages[page] || pages.dashboard;
  };

  const roleLabels: Record<Role, string> = {
    superadmin: "Super Admin", hrmanager: "HR Manager", opsmanager: "Ops Manager",
    supervisor: "Supervisor", employee: "Employee",
  };

  const roleInitials: Record<Role, string> = {
    superadmin: "SA", hrmanager: "HM", opsmanager: "OM", supervisor: "SV", employee: "EM",
  };

  return (
    <div className="min-h-screen bg-background flex font-[Inter,sans-serif]">
      {/* Sidebar */}
      <aside className={`${collapsed ? "w-[68px]" : "w-[248px]"} flex-shrink-0 h-screen sticky top-0 bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 z-30 overflow-hidden`}>
        {/* Logo */}
        <div className={`border-b border-sidebar-border flex items-center ${collapsed ? "h-16 justify-center px-4" : "h-16 px-5 gap-3"}`}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-500/20">
            <Zap className="w-4 h-4 text-white" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="text-sm font-bold text-foreground tracking-tight">WorkSphere AI</div>
              <div className="text-xs text-muted-foreground capitalize">{roleLabels[role]}</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const active = page === item.id;
            return (
              <button key={item.id} onClick={() => setPage(item.id as Page)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 rounded-xl text-sm font-semibold transition-all duration-150 ${collapsed ? "px-2.5 py-2.5 justify-center" : "px-3 py-2.5"} ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}>
                <item.icon size={17} className="flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${active ? "bg-white/20 text-white" : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"}`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className={`p-3 border-t border-sidebar-border space-y-0.5`}>
          {!collapsed && (
            <button onClick={() => setIsLoggedIn(false)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all">
              <LogOut size={16} /> Sign out
            </button>
          )}
          <button onClick={() => setCollapsed(!collapsed)}
            className={`w-full flex items-center rounded-xl text-sm font-semibold text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all ${collapsed ? "px-2.5 py-2.5 justify-center" : "gap-3 px-3 py-2.5"}`}>
            {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Collapse</span></>}
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-border bg-background/90 backdrop-blur-md sticky top-0 z-20 flex items-center gap-4 px-6 flex-shrink-0">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-sm font-bold text-foreground">{navItems.find(n => n.id === page)?.label}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative hidden sm:block">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input placeholder="Search WorkSphere…"
                className="w-52 pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:w-64 transition-all duration-200 text-foreground" />
            </div>

            <button onClick={() => setPage("notifications")}
              className="relative p-2.5 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors">
              <Bell size={16} className="text-muted-foreground" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">3</span>
            </button>

            <button onClick={() => setIsDark(!isDark)}
              className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors">
              {isDark ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-muted-foreground" />}
            </button>

            <div className="flex items-center gap-2.5 pl-3 border-l border-border">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="text-white text-xs font-bold">{roleInitials[role]}</span>
              </div>
              <div className="hidden md:block">
                <div className="text-xs font-bold text-foreground">{roleLabels[role]}</div>
                <div className="text-xs text-muted-foreground">Acme Corporation</div>
              </div>
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
            {renderPage()}
          </div>
        </main>
      </div>

      {/* AI Chat FAB */}
      {!chatOpen && (
        <button onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-2xl shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-200 flex items-center justify-center z-40">
          <MessageSquare size={22} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-background" />
        </button>
      )}

      {chatOpen && <ChatbotPanel onClose={() => setChatOpen(false)} />}
    </div>
  );
}
