import { useState, useEffect, useRef, useCallback } from "react";
import {
  LayoutDashboard, Users, Building2, CalendarDays, Clock, TrendingUp,
  DollarSign, AlertTriangle, Heart, Award, FolderOpen, CheckSquare,
  Shield, BarChart3, Bell, FileText, Settings, HelpCircle, LogOut,
  Search, Plus, ChevronDown, ChevronRight, X, Menu, Moon, Sun,
  Zap, Brain, Activity, MapPin, Globe, Filter, Download, Upload,
  Eye, Edit, Trash2, MoreHorizontal, ArrowUp, ArrowDown, ArrowRight,
  CheckCircle, XCircle, AlertCircle, Info, RefreshCw, Send,
  Mic, MessageSquare, Sparkles, Bot, User, UserCheck, UserX,
  Calendar, Timer, Coffee, Briefcase, Phone, Mail, Star,
  TrendingDown, Layers, GitBranch, Lock, Unlock, Key, Database,
  Wifi, WifiOff, ChevronLeft, ChevronUp, Hash, Command, Loader2,
  PieChart, LineChart as LineChartIcon, BarChart2, Play, Pause, StopCircle,
  Flag, Tag, Bookmark, Share2, Copy, ExternalLink, RotateCcw, Save,
  ClipboardList, UserPlus, LogIn, Building, MapPinIcon, Navigation,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart as RechartsPie,
  Pie, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from "recharts";

// ─── TYPES ────────────────────────────────────────────────────────────────────
type Role = "superadmin" | "hr_manager" | "dept_manager" | "employee";
type Page =
  | "login" | "dashboard" | "employees" | "departments" | "shifts"
  | "calendar" | "attendance" | "leave" | "payroll" | "overtime"
  | "fatigue" | "wellness" | "performance" | "training" | "projects"
  | "compliance" | "reports" | "analytics" | "notifications" | "audit"
  | "roles" | "organization" | "integrations" | "settings" | "support";

interface Employee {
  id: string; name: string; role: string; dept: string; email: string;
  phone: string; status: "active" | "on-leave" | "absent" | "remote";
  joinDate: string; shift: string; fatigue: number; wellness: number;
  performance: number; attendance: number; salary: number; location: string;
  avatar: string; manager: string; employeeId: string;
}

interface Shift {
  id: string; employeeId: string; date: string; start: string; end: string;
  type: "morning" | "evening" | "night" | "off"; dept: string; status: "confirmed" | "pending" | "conflict";
}

interface LeaveRequest {
  id: string; employeeId: string; employeeName: string; type: string;
  from: string; to: string; days: number; reason: string;
  status: "pending" | "approved" | "rejected"; appliedOn: string; managerId: string;
}

interface Notification {
  id: string; title: string; message: string; type: "info" | "warning" | "error" | "success" | "ai";
  time: string; read: boolean; priority: "low" | "medium" | "high";
}

interface AuthUser { id: string; name: string; role: Role; dept: string; avatar: string; employeeId: string; }

// ─── DATA ────────────────────────────────────────────────────────────────────
const USERS: Record<string, { password: string; user: AuthUser }> = {
  "admin@worksphere.ai": { password: "admin123", user: { id: "u1", name: "Arjun Sharma", role: "superadmin", dept: "Executive", avatar: "AS", employeeId: "WS001" } },
  "hr@worksphere.ai": { password: "hr123", user: { id: "u2", name: "Priya Nair", role: "hr_manager", dept: "Human Resources", avatar: "PN", employeeId: "WS002" } },
  "manager@worksphere.ai": { password: "mgr123", user: { id: "u3", name: "Rajesh Kumar", role: "dept_manager", dept: "Engineering", avatar: "RK", employeeId: "WS003" } },
  "emp@worksphere.ai": { password: "emp123", user: { id: "u4", name: "Meera Patel", role: "employee", dept: "Engineering", avatar: "MP", employeeId: "WS042" } },
};

const EMPLOYEES: Employee[] = [
  { id: "e1", name: "Arjun Sharma", role: "CTO", dept: "Executive", email: "arjun.s@worksphere.ai", phone: "+91-98765-43210", status: "active", joinDate: "2019-03-15", shift: "Morning", fatigue: 18, wellness: 92, performance: 97, attendance: 99, salary: 280000, location: "New Delhi HQ", avatar: "AS", manager: "Board", employeeId: "WS001" },
  { id: "e2", name: "Priya Nair", role: "HR Director", dept: "Human Resources", email: "priya.n@worksphere.ai", phone: "+91-97654-32109", status: "active", joinDate: "2020-01-10", shift: "Morning", fatigue: 42, wellness: 78, performance: 91, attendance: 97, salary: 185000, location: "Bangalore", avatar: "PN", manager: "Arjun Sharma", employeeId: "WS002" },
  { id: "e3", name: "Rajesh Kumar", role: "Engineering Lead", dept: "Engineering", email: "rajesh.k@worksphere.ai", phone: "+91-96543-21098", status: "active", joinDate: "2020-07-22", shift: "Morning", fatigue: 65, wellness: 61, performance: 88, attendance: 94, salary: 210000, location: "Bangalore", avatar: "RK", manager: "Arjun Sharma", employeeId: "WS003" },
  { id: "e4", name: "Meera Patel", role: "Senior Engineer", dept: "Engineering", email: "meera.p@worksphere.ai", phone: "+91-95432-10987", status: "active", joinDate: "2021-02-01", shift: "Morning", fatigue: 38, wellness: 84, performance: 93, attendance: 96, salary: 145000, location: "Bangalore", avatar: "MP", manager: "Rajesh Kumar", employeeId: "WS042" },
  { id: "e5", name: "Vikram Singh", role: "Operations Head", dept: "Operations", email: "vikram.s@worksphere.ai", phone: "+91-94321-09876", status: "active", joinDate: "2019-11-05", shift: "Rotational", fatigue: 72, wellness: 55, performance: 85, attendance: 91, salary: 195000, location: "Mumbai", avatar: "VS", manager: "Arjun Sharma", employeeId: "WS004" },
  { id: "e6", name: "Ananya Roy", role: "Data Scientist", dept: "Analytics", email: "ananya.r@worksphere.ai", phone: "+91-93210-98765", status: "remote", joinDate: "2022-04-15", shift: "Flexible", fatigue: 29, wellness: 88, performance: 95, attendance: 98, salary: 175000, location: "Kolkata (Remote)", avatar: "AR", manager: "Arjun Sharma", employeeId: "WS005" },
  { id: "e7", name: "Suresh Menon", role: "Security Manager", dept: "Security", email: "suresh.m@worksphere.ai", phone: "+91-92109-87654", status: "active", joinDate: "2018-06-30", shift: "Night", fatigue: 81, wellness: 44, performance: 79, attendance: 88, salary: 155000, location: "Chennai", avatar: "SM", manager: "Vikram Singh", employeeId: "WS006" },
  { id: "e8", name: "Divya Krishnan", role: "HR Manager", dept: "Human Resources", email: "divya.k@worksphere.ai", phone: "+91-91098-76543", status: "on-leave", joinDate: "2021-08-20", shift: "Morning", fatigue: 35, wellness: 71, performance: 87, attendance: 89, salary: 125000, location: "Hyderabad", avatar: "DK", manager: "Priya Nair", employeeId: "WS007" },
  { id: "e9", name: "Amit Joshi", role: "Backend Engineer", dept: "Engineering", email: "amit.j@worksphere.ai", phone: "+91-90987-65432", status: "active", joinDate: "2022-01-17", shift: "Morning", fatigue: 54, wellness: 72, performance: 90, attendance: 95, salary: 120000, location: "Bangalore", avatar: "AJ", manager: "Rajesh Kumar", employeeId: "WS043" },
  { id: "e10", name: "Neha Gupta", role: "Compliance Officer", dept: "Legal", email: "neha.g@worksphere.ai", phone: "+91-89876-54321", status: "active", joinDate: "2020-09-14", shift: "Morning", fatigue: 31, wellness: 82, performance: 89, attendance: 97, salary: 140000, location: "New Delhi", avatar: "NG", manager: "Arjun Sharma", employeeId: "WS008" },
  { id: "e11", name: "Karan Malhotra", role: "DevOps Engineer", dept: "Engineering", email: "karan.m@worksphere.ai", phone: "+91-88765-43210", status: "active", joinDate: "2021-11-03", shift: "Evening", fatigue: 61, wellness: 67, performance: 86, attendance: 93, salary: 135000, location: "Bangalore", avatar: "KM", manager: "Rajesh Kumar", employeeId: "WS044" },
  { id: "e12", name: "Pooja Iyer", role: "UX Designer", dept: "Product", email: "pooja.i@worksphere.ai", phone: "+91-87654-32109", status: "active", joinDate: "2022-06-01", shift: "Morning", fatigue: 25, wellness: 91, performance: 94, attendance: 99, salary: 130000, location: "Bangalore", avatar: "PI", manager: "Arjun Sharma", employeeId: "WS009" },
  { id: "e13", name: "Rahul Verma", role: "Night Supervisor", dept: "Operations", email: "rahul.v@worksphere.ai", phone: "+91-86543-21098", status: "active", joinDate: "2019-04-22", shift: "Night", fatigue: 88, wellness: 38, performance: 76, attendance: 85, salary: 98000, location: "Mumbai", avatar: "RV", manager: "Vikram Singh", employeeId: "WS010" },
  { id: "e14", name: "Sunita Rao", role: "Payroll Specialist", dept: "Finance", email: "sunita.r@worksphere.ai", phone: "+91-85432-10987", status: "active", joinDate: "2020-12-08", shift: "Morning", fatigue: 22, wellness: 86, performance: 92, attendance: 98, salary: 115000, location: "Hyderabad", avatar: "SR", manager: "Priya Nair", employeeId: "WS011" },
  { id: "e15", name: "Mohammed Khan", role: "QA Lead", dept: "Engineering", email: "mohammed.k@worksphere.ai", phone: "+91-84321-09876", status: "absent", joinDate: "2021-05-19", shift: "Morning", fatigue: 46, wellness: 69, performance: 84, attendance: 82, salary: 125000, location: "Pune", avatar: "MK", manager: "Rajesh Kumar", employeeId: "WS045" },
];

const SHIFTS: Shift[] = [
  { id: "s1", employeeId: "e3", date: "2026-07-03", start: "08:00", end: "17:00", type: "morning", dept: "Engineering", status: "confirmed" },
  { id: "s2", employeeId: "e4", date: "2026-07-03", start: "08:00", end: "17:00", type: "morning", dept: "Engineering", status: "confirmed" },
  { id: "s3", employeeId: "e7", date: "2026-07-03", start: "22:00", end: "06:00", type: "night", dept: "Security", status: "confirmed" },
  { id: "s4", employeeId: "e11", date: "2026-07-03", start: "14:00", end: "23:00", type: "evening", dept: "Engineering", status: "pending" },
  { id: "s5", employeeId: "e13", date: "2026-07-03", start: "22:00", end: "06:00", type: "night", dept: "Operations", status: "conflict" },
  { id: "s6", employeeId: "e5", date: "2026-07-04", start: "08:00", end: "17:00", type: "morning", dept: "Operations", status: "confirmed" },
  { id: "s7", employeeId: "e9", date: "2026-07-04", start: "08:00", end: "17:00", type: "morning", dept: "Engineering", status: "confirmed" },
];

const LEAVE_REQUESTS: LeaveRequest[] = [
  { id: "l1", employeeId: "e8", employeeName: "Divya Krishnan", type: "Medical Leave", from: "2026-07-01", to: "2026-07-10", days: 10, reason: "Post-surgery recovery", status: "approved", appliedOn: "2026-06-28", managerId: "u2" },
  { id: "l2", employeeId: "e15", employeeName: "Mohammed Khan", type: "Annual Leave", from: "2026-07-03", to: "2026-07-05", days: 3, reason: "Family event", status: "pending", appliedOn: "2026-07-01", managerId: "u3" },
  { id: "l3", employeeId: "e9", employeeName: "Amit Joshi", type: "Casual Leave", from: "2026-07-08", to: "2026-07-08", days: 1, reason: "Personal work", status: "pending", appliedOn: "2026-07-02", managerId: "u3" },
  { id: "l4", employeeId: "e11", employeeName: "Karan Malhotra", type: "Emergency Leave", from: "2026-07-10", to: "2026-07-12", days: 3, reason: "Family emergency", status: "pending", appliedOn: "2026-07-03", managerId: "u3" },
  { id: "l5", employeeId: "e6", employeeName: "Ananya Roy", type: "Annual Leave", from: "2026-07-15", to: "2026-07-22", days: 8, reason: "Planned vacation", status: "approved", appliedOn: "2026-06-20", managerId: "u1" },
];

const NOTIFICATIONS: Notification[] = [
  { id: "n1", title: "AI Burnout Alert", message: "Rahul Verma shows 88% fatigue risk — 6th consecutive night shift detected.", type: "ai", time: "2 min ago", read: false, priority: "high" },
  { id: "n2", title: "Shift Conflict", message: "Mohammed Khan's approved leave overlaps with a scheduled shift on July 5.", type: "warning", time: "15 min ago", read: false, priority: "high" },
  { id: "n3", title: "Leave Request", message: "Karan Malhotra applied for Emergency Leave (Jul 10–12).", type: "info", time: "1 hr ago", read: false, priority: "medium" },
  { id: "n4", title: "Compliance Violation", message: "Night shift group in Operations exceeds 72-hour weekly limit.", type: "error", time: "2 hr ago", read: false, priority: "high" },
  { id: "n5", title: "Payroll Processed", message: "June 2026 payroll for 142 employees processed successfully.", type: "success", time: "3 hr ago", read: true, priority: "low" },
  { id: "n6", title: "New Employee Joined", message: "Dr. Preethi Acharya joined as Chief Medical Officer.", type: "info", time: "1 day ago", read: true, priority: "low" },
  { id: "n7", title: "AI Insight", message: "Productivity forecast for Engineering dept shows 12% improvement expected next week.", type: "ai", time: "1 day ago", read: true, priority: "medium" },
];

// ─── CHARTS DATA ──────────────────────────────────────────────────────────────
const attendanceData = [
  { day: "Mon", present: 138, absent: 7, late: 5 },
  { day: "Tue", present: 141, absent: 4, late: 5 },
  { day: "Wed", present: 136, absent: 9, late: 5 },
  { day: "Thu", present: 143, absent: 2, late: 5 },
  { day: "Fri", present: 140, absent: 5, late: 5 },
  { day: "Sat", present: 89, absent: 56, late: 5 },
];

const productivityData = [
  { month: "Jan", score: 82, target: 85 }, { month: "Feb", score: 79, target: 85 },
  { month: "Mar", score: 85, target: 85 }, { month: "Apr", score: 88, target: 87 },
  { month: "May", score: 91, target: 87 }, { month: "Jun", score: 89, target: 88 },
  { month: "Jul", score: 93, target: 88 },
];

const fatigueData = [
  { week: "W1", engineering: 45, operations: 62, security: 78, hr: 31 },
  { week: "W2", engineering: 52, operations: 67, security: 82, hr: 28 },
  { week: "W3", engineering: 48, operations: 71, security: 85, hr: 35 },
  { week: "W4", engineering: 61, operations: 69, security: 81, hr: 29 },
];

const deptData = [
  { name: "Engineering", value: 52, color: "#6366f1" },
  { name: "Operations", value: 31, color: "#22d3ee" },
  { name: "Security", value: 12, color: "#f59e0b" },
  { name: "HR", value: 18, color: "#10b981" },
  { name: "Others", value: 22, color: "#8b5cf6" },
];

const overtimeData = [
  { dept: "Engineering", hours: 128, cost: 192000 },
  { dept: "Operations", hours: 204, cost: 306000 },
  { dept: "Security", hours: 312, cost: 312000 },
  { dept: "HR", hours: 48, cost: 72000 },
  { dept: "Finance", hours: 36, cost: 54000 },
];

const weeklyTrend = [
  { day: "Mon", fatigue: 52 }, { day: "Tue", fatigue: 58 }, { day: "Wed", fatigue: 61 },
  { day: "Thu", fatigue: 55 }, { day: "Fri", fatigue: 67 }, { day: "Sat", fatigue: 71 },
  { day: "Sun", fatigue: 49 },
];

const auditLogs = [
  { id: "a1", user: "Arjun Sharma", action: "Updated Role", target: "Vikram Singh → Operations Director", time: "2026-07-03 14:32", ip: "192.168.1.45", severity: "medium" },
  { id: "a2", user: "Priya Nair", action: "Approved Leave", target: "Divya Krishnan - Medical Leave", time: "2026-07-03 13:15", ip: "192.168.1.62", severity: "low" },
  { id: "a3", user: "System", action: "AI Alert Triggered", target: "Burnout risk: Rahul Verma (88%)", time: "2026-07-03 12:48", ip: "System", severity: "high" },
  { id: "a4", user: "Rajesh Kumar", action: "Modified Shift", target: "Engineering - July 5 schedule", time: "2026-07-03 11:20", ip: "192.168.1.78", severity: "low" },
  { id: "a5", user: "Priya Nair", action: "Exported Report", target: "June 2026 Payroll Report (PDF)", time: "2026-07-03 10:05", ip: "192.168.1.62", severity: "low" },
  { id: "a6", user: "System", action: "Compliance Violation", target: "Operations team - 72hr limit exceeded", time: "2026-07-03 09:30", ip: "System", severity: "high" },
  { id: "a7", user: "Arjun Sharma", action: "Login", target: "admin@worksphere.ai from New Delhi", time: "2026-07-03 08:55", ip: "203.45.78.12", severity: "low" },
];

const ROLES_PERMISSIONS = {
  superadmin: { label: "Super Admin", color: "#ef4444", permissions: ["all"] },
  hr_manager: { label: "HR Manager", color: "#f59e0b", permissions: ["employees.view", "employees.edit", "leave.approve", "payroll.view", "reports.export", "attendance.view"] },
  dept_manager: { label: "Department Manager", color: "#6366f1", permissions: ["employees.view", "shifts.edit", "leave.approve", "attendance.view", "overtime.approve"] },
  employee: { label: "Employee", color: "#10b981", permissions: ["profile.view", "leave.request", "attendance.clock", "payslip.view"] },
};

const NAV_ITEMS: { id: Page; label: string; icon: any; roles: Role[]; group: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["superadmin","hr_manager","dept_manager","employee"], group: "main" },
  { id: "employees", label: "Employees", icon: Users, roles: ["superadmin","hr_manager","dept_manager"], group: "main" },
  { id: "departments", label: "Departments", icon: Building2, roles: ["superadmin","hr_manager"], group: "main" },
  { id: "shifts", label: "Shift Planning", icon: CalendarDays, roles: ["superadmin","hr_manager","dept_manager"], group: "workforce" },
  { id: "attendance", label: "Attendance", icon: Clock, roles: ["superadmin","hr_manager","dept_manager","employee"], group: "workforce" },
  { id: "leave", label: "Leave Management", icon: Coffee, roles: ["superadmin","hr_manager","dept_manager","employee"], group: "workforce" },
  { id: "overtime", label: "Overtime", icon: Timer, roles: ["superadmin","hr_manager","dept_manager"], group: "workforce" },
  { id: "payroll", label: "Payroll", icon: DollarSign, roles: ["superadmin","hr_manager","employee"], group: "workforce" },
  { id: "fatigue", label: "Fatigue Center", icon: Brain, roles: ["superadmin","hr_manager","dept_manager"], group: "intelligence" },
  { id: "wellness", label: "Wellness", icon: Heart, roles: ["superadmin","hr_manager"], group: "intelligence" },
  { id: "performance", label: "Performance", icon: TrendingUp, roles: ["superadmin","hr_manager","dept_manager"], group: "intelligence" },
  { id: "analytics", label: "Analytics", icon: BarChart3, roles: ["superadmin","hr_manager"], group: "intelligence" },
  { id: "compliance", label: "Compliance", icon: Shield, roles: ["superadmin","hr_manager"], group: "governance" },
  { id: "reports", label: "Reports", icon: FileText, roles: ["superadmin","hr_manager"], group: "governance" },
  { id: "audit", label: "Audit Logs", icon: Activity, roles: ["superadmin"], group: "governance" },
  { id: "roles", label: "Roles & Permissions", icon: Key, roles: ["superadmin"], group: "governance" },
  { id: "notifications", label: "Notifications", icon: Bell, roles: ["superadmin","hr_manager","dept_manager","employee"], group: "system" },
  { id: "organization", label: "Organization", icon: Globe, roles: ["superadmin"], group: "system" },
  { id: "settings", label: "Settings", icon: Settings, roles: ["superadmin","hr_manager"], group: "system" },
  { id: "support", label: "Support", icon: HelpCircle, roles: ["superadmin","hr_manager","dept_manager","employee"], group: "system" },
];

const NAV_GROUPS = [
  { id: "main", label: "Core" },
  { id: "workforce", label: "Workforce" },
  { id: "intelligence", label: "Intelligence" },
  { id: "governance", label: "Governance" },
  { id: "system", label: "System" },
];

// ─── UTILS ────────────────────────────────────────────────────────────────────
const statusColor: Record<string, string> = {
  active: "text-emerald-400 bg-emerald-400/10",
  "on-leave": "text-amber-400 bg-amber-400/10",
  absent: "text-red-400 bg-red-400/10",
  remote: "text-cyan-400 bg-cyan-400/10",
};
const statusDot: Record<string, string> = {
  active: "bg-emerald-400", "on-leave": "bg-amber-400", absent: "bg-red-400", remote: "bg-cyan-400",
};

function fmtSalary(n: number) {
  return "₹" + (n / 1000).toFixed(0) + "k";
}

function fatigueColor(f: number) {
  if (f < 40) return "text-emerald-400";
  if (f < 65) return "text-amber-400";
  return "text-red-400";
}

function fatigueBar(f: number) {
  if (f < 40) return "bg-emerald-500";
  if (f < 65) return "bg-amber-500";
  return "bg-red-500";
}

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const s = { sm: "w-7 h-7 text-xs", md: "w-9 h-9 text-sm", lg: "w-12 h-12 text-base" }[size];
  const colors = ["bg-indigo-500", "bg-cyan-500", "bg-purple-500", "bg-emerald-500", "bg-amber-500"];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <div className={`${s} ${color} rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0`}>
      {name.split(" ").map(n => n[0]).join("").slice(0, 2)}
    </div>
  );
}

function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "success" | "warning" | "error" | "ai" | "info" }) {
  const v = {
    default: "bg-slate-700 text-slate-300",
    success: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
    warning: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
    error: "bg-red-500/15 text-red-400 border border-red-500/20",
    ai: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/20",
    info: "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20",
  }[variant];
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${v}`}>{children}</span>;
}

function KPICard({ label, value, change, changeLabel, icon: Icon, color = "indigo", sub }: {
  label: string; value: string | number; change?: number; changeLabel?: string;
  icon: any; color?: string; sub?: string;
}) {
  const colorMap: Record<string, string> = {
    indigo: "text-indigo-400 bg-indigo-500/10",
    cyan: "text-cyan-400 bg-cyan-500/10",
    emerald: "text-emerald-400 bg-emerald-500/10",
    amber: "text-amber-400 bg-amber-500/10",
    red: "text-red-400 bg-red-500/10",
    purple: "text-purple-400 bg-purple-500/10",
  };
  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-indigo-500/30 transition-colors group">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${colorMap[color] || colorMap.indigo}`}>
          <Icon size={18} className={colorMap[color]?.split(" ")[0]} />
        </div>
        {change !== undefined && (
          <span className={`flex items-center gap-1 text-xs ${change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {change >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-foreground font-mono">{value}</div>
      <div className="text-sm text-muted-foreground mt-1">{label}</div>
      {sub && <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>}
      {changeLabel && <div className="text-xs text-muted-foreground mt-1">{changeLabel}</div>}
    </div>
  );
}

function ProgressBar({ value, max = 100, color = "bg-indigo-500" }: { value: number; max?: number; color?: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function SectionHeader({ title, sub, actions }: { title: string; sub?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        {sub && <p className="text-sm text-muted-foreground mt-0.5">{sub}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

function Btn({ children, variant = "primary", size = "md", onClick, disabled, icon: Icon }: {
  children?: React.ReactNode; variant?: "primary" | "secondary" | "ghost" | "danger" | "ai";
  size?: "sm" | "md" | "lg"; onClick?: () => void; disabled?: boolean; icon?: any;
}) {
  const v = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500/30",
    secondary: "bg-white/5 hover:bg-white/10 text-foreground border border-border",
    ghost: "hover:bg-white/5 text-muted-foreground hover:text-foreground border border-transparent",
    danger: "bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/20",
    ai: "bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/20",
  }[variant];
  const s = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2 text-sm", lg: "px-5 py-2.5 text-sm" }[size];
  return (
    <button onClick={onClick} disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-lg font-medium transition-all ${v} ${s} disabled:opacity-40 disabled:cursor-not-allowed`}>
      {Icon && <Icon size={14} />}{children}
    </button>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
function Sidebar({ currentPage, setPage, user, collapsed, setCollapsed }: {
  currentPage: Page; setPage: (p: Page) => void; user: AuthUser;
  collapsed: boolean; setCollapsed: (c: boolean) => void;
}) {
  const allowed = NAV_ITEMS.filter(i => i.roles.includes(user.role));
  const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <aside className={`h-full flex flex-col bg-sidebar border-r border-sidebar-border transition-all duration-300 ${collapsed ? "w-16" : "w-60"} flex-shrink-0`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-sidebar-border">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
          <Zap size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="text-sm font-bold text-foreground leading-none">WorkSphere</div>
            <div className="text-xs text-cyan-400 font-medium">AI</div>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="ml-auto text-muted-foreground hover:text-foreground transition-colors">
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 scrollbar-none">
        {NAV_GROUPS.map(group => {
          const items = allowed.filter(i => i.group === group.id);
          if (!items.length) return null;
          return (
            <div key={group.id} className="mb-2">
              {!collapsed && (
                <div className="px-4 py-1.5 text-xs font-semibold text-muted-foreground tracking-widest uppercase">{group.label}</div>
              )}
              {items.map(item => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                const isNotif = item.id === "notifications";
                return (
                  <button key={item.id} onClick={() => setPage(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-all relative ${isActive ? "bg-indigo-600/15 text-indigo-400 border-r-2 border-indigo-500" : "text-muted-foreground hover:text-foreground hover:bg-white/5"}`}
                    title={collapsed ? item.label : undefined}>
                    <div className="relative flex-shrink-0">
                      <Icon size={16} />
                      {isNotif && unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">{unreadCount}</span>
                      )}
                    </div>
                    {!collapsed && <span className="font-medium">{item.label}</span>}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-sidebar-border p-3">
        <div className={`flex items-center gap-3 rounded-lg px-2 py-2 ${collapsed ? "justify-center" : ""}`}>
          <Avatar name={user.name} size="sm" />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium text-foreground truncate">{user.name}</div>
              <div className="text-xs text-muted-foreground capitalize">{ROLES_PERMISSIONS[user.role].label}</div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

// ─── TOPBAR ──────────────────────────────────────────────────────────────────
function TopBar({ user, setPage, onLogout, onCmdK, onAI, notifications }: {
  user: AuthUser; setPage: (p: Page) => void; onLogout: () => void;
  onCmdK: () => void; onAI: () => void; notifications: Notification[];
}) {
  const unread = notifications.filter(n => !n.read).length;
  const [search, setSearch] = useState("");
  const [showProfile, setShowProfile] = useState(false);

  return (
    <header className="h-14 border-b border-border bg-background/80 backdrop-blur-sm flex items-center px-4 gap-3 flex-shrink-0 z-20">
      {/* Search */}
      <button onClick={onCmdK}
        className="flex items-center gap-2 bg-white/5 hover:bg-white/8 border border-border rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-all flex-1 max-w-xs">
        <Search size={14} />
        <span>Search anything...</span>
        <span className="ml-auto flex items-center gap-0.5 text-xs opacity-50">
          <Command size={10} /><span>K</span>
        </span>
      </button>

      <div className="flex items-center gap-1.5 ml-auto">
        {/* AI Copilot */}
        <button onClick={onAI}
          className="flex items-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 text-cyan-400 rounded-lg px-3 py-1.5 text-xs font-medium transition-all">
          <Sparkles size={13} />AI Copilot
        </button>

        {/* Notifications */}
        <button onClick={() => setPage("notifications")} className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all">
          <Bell size={18} />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] flex items-center justify-center font-bold">{unread}</span>
          )}
        </button>

        {/* Profile */}
        <div className="relative">
          <button onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/5 transition-all">
            <Avatar name={user.name} size="sm" />
            <ChevronDown size={14} className="text-muted-foreground" />
          </button>
          {showProfile && (
            <div className="absolute right-0 top-10 w-52 bg-popover border border-border rounded-xl shadow-2xl py-1 z-50">
              <div className="px-4 py-3 border-b border-border">
                <div className="text-sm font-medium text-foreground">{user.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{ROLES_PERMISSIONS[user.role].label}</div>
              </div>
              <button onClick={() => { setPage("settings"); setShowProfile(false); }} className="w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 flex items-center gap-2">
                <Settings size={14} />Profile & Settings
              </button>
              <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 flex items-center gap-2">
                <LogOut size={14} />Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function LoginPage({ onLogin }: { onLogin: (user: AuthUser) => void }) {
  const [email, setEmail] = useState("admin@worksphere.ai");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const demoAccounts = [
    { label: "Super Admin", email: "admin@worksphere.ai", pass: "admin123", color: "text-red-400" },
    { label: "HR Manager", email: "hr@worksphere.ai", pass: "hr123", color: "text-amber-400" },
    { label: "Dept Manager", email: "manager@worksphere.ai", pass: "mgr123", color: "text-indigo-400" },
    { label: "Employee", email: "emp@worksphere.ai", pass: "emp123", color: "text-emerald-400" },
  ];

  function handleLogin() {
    setError("");
    setLoading(true);
    setTimeout(() => {
      const found = USERS[email];
      if (found && found.password === password) {
        onLogin(found.user);
      } else {
        setError("Invalid credentials. Use one of the demo accounts below.");
      }
      setLoading(false);
    }, 800);
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel */}
      <div className="hidden lg:flex flex-col w-1/2 bg-gradient-to-br from-indigo-900/40 via-background to-cyan-900/20 border-r border-border p-12 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center">
            <Zap size={20} className="text-white" />
          </div>
          <div>
            <div className="text-lg font-bold text-foreground">WorkSphere</div>
            <div className="text-sm text-cyan-400 font-semibold tracking-wide">AI Platform</div>
          </div>
        </div>

        <div>
          <div className="inline-flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full px-4 py-1.5 text-xs text-cyan-400 font-medium mb-6">
            <Sparkles size={12} />AI-Powered Workforce Intelligence
          </div>
          <h2 className="text-4xl font-bold text-foreground leading-tight mb-4">
            Enterprise-grade<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">workforce management</span><br />
            for the modern era.
          </h2>
          <p className="text-muted-foreground text-base leading-relaxed">
            Trusted by ISRO, DRDO, major hospitals, airlines, and Fortune 500 companies to manage 10,000+ employees with AI precision.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[{ label: "Employees Managed", val: "500K+" }, { label: "Orgs Deployed", val: "2,400+" }, { label: "Uptime SLA", val: "99.99%" }].map(s => (
            <div key={s.label} className="bg-white/5 border border-border rounded-xl p-4">
              <div className="text-xl font-bold text-foreground font-mono">{s.val}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
            <p className="text-muted-foreground mt-1 text-sm">Sign in to your WorkSphere workspace</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-input-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                placeholder="you@company.ai" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleLogin()}
                  className="w-full bg-input-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all pr-10"
                  placeholder="••••••••" />
                <button onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <Eye size={14} />
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2.5 text-xs">
                <AlertCircle size={13} />{error}
              </div>
            )}

            <button onClick={handleLogin} disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg py-2.5 text-sm font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
              {loading ? "Authenticating..." : "Sign In"}
            </button>
          </div>

          {/* Demo accounts */}
          <div className="mt-8">
            <div className="text-xs text-muted-foreground mb-3 text-center">Quick Demo Login</div>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map(acc => (
                <button key={acc.email} onClick={() => { setEmail(acc.email); setPassword(acc.pass); }}
                  className="text-left bg-white/3 hover:bg-white/6 border border-border rounded-lg p-2.5 transition-all">
                  <div className={`text-xs font-semibold ${acc.color}`}>{acc.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 truncate">{acc.email}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD PAGE ───────────────────────────────────────────────────────────
function DashboardPage({ user, setPage }: { user: AuthUser; setPage: (p: Page) => void }) {
  const active = EMPLOYEES.filter(e => e.status === "active").length;
  const onLeave = EMPLOYEES.filter(e => e.status === "on-leave").length;
  const absent = EMPLOYEES.filter(e => e.status === "absent").length;
  const highRisk = EMPLOYEES.filter(e => e.fatigue >= 70);
  const pendingLeave = LEAVE_REQUESTS.filter(l => l.status === "pending");

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Good {new Date().getHours() < 12 ? "morning" : new Date().getHours() < 17 ? "afternoon" : "evening"}, {user.name.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">Here's your workforce overview for today, July 3, 2026</p>
        </div>
        <div className="flex items-center gap-2">
          <Btn variant="secondary" icon={RefreshCw} size="sm">Refresh</Btn>
          <Btn variant="primary" icon={Plus} size="sm">Quick Action</Btn>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <KPICard label="Total Employees" value="150" change={4} icon={Users} color="indigo" sub="142 active today" />
        <KPICard label="Present Today" value={active} change={2} icon={CheckCircle} color="emerald" sub={`${((active/150)*100).toFixed(0)}% attendance`} />
        <KPICard label="On Leave" value={onLeave} icon={Coffee} color="amber" sub="2 approved today" />
        <KPICard label="High Fatigue" value={highRisk.length} change={-8} icon={Brain} color="red" sub="AI monitored" />
        <KPICard label="Org Health" value="87%" change={3} icon={Activity} color="cyan" sub="Compliance: 94%" />
        <KPICard label="Pending Approvals" value={pendingLeave.length} icon={ClipboardList} color="purple" sub="Requires action" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Attendance Chart */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-semibold text-foreground">Weekly Attendance</div>
              <div className="text-xs text-muted-foreground">This week • 150 employees total</div>
            </div>
            <Btn variant="ghost" size="sm" icon={Download}>Export</Btn>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={attendanceData} barSize={18}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid rgba(148,163,184,0.1)", borderRadius: "8px", color: "#e2e8f0" }} />
              <Bar dataKey="present" fill="#6366f1" radius={[4, 4, 0, 0]} name="Present" />
              <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} name="Absent" />
              <Bar dataKey="late" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Late" />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Dept Distribution */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-sm font-semibold text-foreground mb-1">Dept Distribution</div>
          <div className="text-xs text-muted-foreground mb-4">Employee headcount by team</div>
          <ResponsiveContainer width="100%" height={160}>
            <RechartsPie>
              <Pie data={deptData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" stroke="none">
                {deptData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid rgba(148,163,184,0.1)", borderRadius: "8px", color: "#e2e8f0" }} />
            </RechartsPie>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {deptData.map(d => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
                  <span className="text-xs text-muted-foreground">{d.name}</span>
                </div>
                <span className="text-xs font-mono font-medium text-foreground">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Productivity + Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Productivity Trend */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm font-semibold text-foreground">Productivity Score</div>
              <div className="text-xs text-muted-foreground">Monthly trend vs target</div>
            </div>
            <Badge variant="ai"><Sparkles size={10} />AI Insight</Badge>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={productivityData}>
              <defs>
                <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} domain={[70, 100]} />
              <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid rgba(148,163,184,0.1)", borderRadius: "8px", color: "#e2e8f0" }} />
              <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} fill="url(#prodGrad)" name="Score" />
              <Line type="monotone" dataKey="target" stroke="#22d3ee" strokeWidth={1.5} strokeDasharray="4 4" dot={false} name="Target" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* AI Alerts */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-foreground">AI Alerts</div>
            <button onClick={() => setPage("notifications")} className="text-xs text-indigo-400 hover:text-indigo-300">View all</button>
          </div>
          <div className="space-y-3">
            {NOTIFICATIONS.filter(n => !n.read).slice(0, 4).map(n => (
              <div key={n.id} className={`p-3 rounded-lg border text-xs ${n.type === "error" || n.priority === "high" ? "bg-red-500/8 border-red-500/20" : n.type === "warning" ? "bg-amber-500/8 border-amber-500/20" : n.type === "ai" ? "bg-cyan-500/8 border-cyan-500/20" : "bg-white/3 border-border"}`}>
                <div className="font-semibold text-foreground">{n.title}</div>
                <div className="text-muted-foreground mt-0.5 leading-relaxed">{n.message}</div>
                <div className="text-muted-foreground mt-1 opacity-60">{n.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* High Risk Employees + Pending Leave */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* High Risk */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Brain size={15} className="text-red-400" />High Risk Employees
            </div>
            <button onClick={() => setPage("fatigue")} className="text-xs text-indigo-400">Fatigue Center →</button>
          </div>
          <div className="space-y-3">
            {highRisk.map(e => (
              <div key={e.id} className="flex items-center gap-3">
                <Avatar name={e.name} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{e.name}</div>
                  <div className="text-xs text-muted-foreground">{e.dept} · {e.shift} shift</div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-mono font-bold ${fatigueColor(e.fatigue)}`}>{e.fatigue}%</div>
                  <div className="text-xs text-muted-foreground">fatigue</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Leave */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-semibold text-foreground flex items-center gap-2">
              <ClipboardList size={15} className="text-amber-400" />Pending Leave Requests
            </div>
            <button onClick={() => setPage("leave")} className="text-xs text-indigo-400">Manage →</button>
          </div>
          <div className="space-y-3">
            {pendingLeave.map(l => (
              <div key={l.id} className="flex items-center gap-3 p-3 bg-white/3 rounded-lg">
                <Avatar name={l.employeeName} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground">{l.employeeName}</div>
                  <div className="text-xs text-muted-foreground">{l.type} · {l.days} day{l.days > 1 ? "s" : ""} · {l.from}</div>
                </div>
                <Badge variant="warning">Pending</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── EMPLOYEES PAGE ───────────────────────────────────────────────────────────
function EmployeesPage({ user }: { user: AuthUser }) {
  const [view, setView] = useState<"table" | "card">("table");
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Employee | null>(null);

  const depts = ["all", ...Array.from(new Set(EMPLOYEES.map(e => e.dept)))];
  const myEmployees = user.role === "dept_manager"
    ? EMPLOYEES.filter(e => e.dept === user.dept)
    : EMPLOYEES;

  const filtered = myEmployees.filter(e => {
    const q = search.toLowerCase();
    const matchQ = !q || e.name.toLowerCase().includes(q) || e.dept.toLowerCase().includes(q) || e.role.toLowerCase().includes(q);
    const matchD = deptFilter === "all" || e.dept === deptFilter;
    const matchS = statusFilter === "all" || e.status === statusFilter;
    return matchQ && matchD && matchS;
  });

  return (
    <div className="p-6">
      <SectionHeader title="Employee Directory" sub={`${filtered.length} of ${myEmployees.length} employees`}
        actions={<>
          <Btn variant="secondary" icon={Download} size="sm">Export</Btn>
          {user.role !== "employee" && <Btn variant="primary" icon={UserPlus} size="sm">Add Employee</Btn>}
        </>}
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search employees..." className="bg-input-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-foreground w-60 focus:outline-none focus:ring-1 focus:ring-indigo-500/50" />
        </div>
        <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)}
          className="bg-input-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none">
          {depts.map(d => <option key={d} value={d}>{d === "all" ? "All Departments" : d}</option>)}
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="bg-input-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="on-leave">On Leave</option>
          <option value="absent">Absent</option>
          <option value="remote">Remote</option>
        </select>
        <div className="ml-auto flex items-center gap-1 bg-input-background border border-border rounded-lg p-1">
          <button onClick={() => setView("table")} className={`px-3 py-1 rounded text-xs font-medium transition-all ${view === "table" ? "bg-indigo-600 text-white" : "text-muted-foreground hover:text-foreground"}`}>Table</button>
          <button onClick={() => setView("card")} className={`px-3 py-1 rounded text-xs font-medium transition-all ${view === "card" ? "bg-indigo-600 text-white" : "text-muted-foreground hover:text-foreground"}`}>Cards</button>
        </div>
      </div>

      {view === "table" ? (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Employee", "Department", "Shift", "Status", "Fatigue", "Attendance", "Wellness", ""].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((e, i) => (
                <tr key={e.id} className="border-b border-border/50 hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={e.name} size="sm" />
                      <div>
                        <div className="font-medium text-foreground">{e.name}</div>
                        <div className="text-xs text-muted-foreground">{e.role} · {e.employeeId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{e.dept}</td>
                  <td className="px-4 py-3 text-muted-foreground">{e.shift}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[e.status]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot[e.status]}`} />{e.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-mono font-bold ${fatigueColor(e.fatigue)}`}>{e.fatigue}%</span>
                      <div className="w-16"><ProgressBar value={e.fatigue} color={fatigueBar(e.fatigue)} /></div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-foreground">{e.attendance}%</td>
                  <td className="px-4 py-3 text-xs font-mono text-foreground">{e.wellness}%</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelected(e)} className="text-xs text-indigo-400 hover:text-indigo-300">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(e => (
            <div key={e.id} className="bg-card border border-border rounded-xl p-5 hover:border-indigo-500/30 transition-all cursor-pointer" onClick={() => setSelected(e)}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar name={e.name} size="lg" />
                  <div>
                    <div className="font-semibold text-foreground">{e.name}</div>
                    <div className="text-xs text-muted-foreground">{e.role}</div>
                    <div className="text-xs text-muted-foreground">{e.employeeId}</div>
                  </div>
                </div>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[e.status]}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusDot[e.status]}`} />{e.status}
                </span>
              </div>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><Building2 size={12} />{e.dept}</div>
                <div className="flex items-center gap-2"><MapPin size={12} />{e.location}</div>
                <div className="flex items-center gap-2"><Mail size={12} />{e.email}</div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border">
                <div className="text-center">
                  <div className={`text-sm font-bold font-mono ${fatigueColor(e.fatigue)}`}>{e.fatigue}%</div>
                  <div className="text-xs text-muted-foreground">Fatigue</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold font-mono text-foreground">{e.attendance}%</div>
                  <div className="text-xs text-muted-foreground">Attend.</div>
                </div>
                <div className="text-center">
                  <div className="text-sm font-bold font-mono text-emerald-400">{e.wellness}%</div>
                  <div className="text-xs text-muted-foreground">Wellness</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Employee Detail Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-4">
                <Avatar name={selected.name} size="lg" />
                <div>
                  <div className="text-lg font-semibold text-foreground">{selected.name}</div>
                  <div className="text-sm text-muted-foreground">{selected.role} · {selected.dept}</div>
                  <div className="text-xs text-muted-foreground font-mono">{selected.employeeId}</div>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground p-2 hover:bg-white/5 rounded-lg">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 grid grid-cols-2 gap-4">
              {[
                { label: "Email", value: selected.email, icon: Mail },
                { label: "Phone", value: selected.phone, icon: Phone },
                { label: "Location", value: selected.location, icon: MapPin },
                { label: "Shift", value: selected.shift, icon: Clock },
                { label: "Join Date", value: selected.joinDate, icon: Calendar },
                { label: "Manager", value: selected.manager, icon: User },
                { label: "Salary", value: fmtSalary(selected.salary) + "/mo", icon: DollarSign },
                { label: "Status", value: selected.status, icon: Activity },
              ].map(f => (
                <div key={f.label} className="bg-white/3 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1"><f.icon size={12} />{f.label}</div>
                  <div className="text-sm font-medium text-foreground capitalize">{f.value}</div>
                </div>
              ))}
            </div>
            <div className="px-6 pb-6">
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Fatigue Risk", value: selected.fatigue + "%", color: fatigueColor(selected.fatigue), bar: fatigueBar(selected.fatigue) },
                  { label: "Wellness Score", value: selected.wellness + "%", color: "text-emerald-400", bar: "bg-emerald-500" },
                  { label: "Performance", value: selected.performance + "%", color: "text-indigo-400", bar: "bg-indigo-500" },
                ].map(m => (
                  <div key={m.label} className="bg-white/3 rounded-lg p-4">
                    <div className="text-xs text-muted-foreground mb-2">{m.label}</div>
                    <div className={`text-xl font-bold font-mono ${m.color}`}>{m.value}</div>
                    <div className="mt-2"><ProgressBar value={parseInt(m.value)} color={m.bar} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SHIFT PLANNING PAGE ──────────────────────────────────────────────────────
function ShiftPlanningPage({ user }: { user: AuthUser }) {
  const [weekOffset, setWeekOffset] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDept, setSelectedDept] = useState("all");
  const [conflicts] = useState(SHIFTS.filter(s => s.status === "conflict").length);
  const [toast, setToast] = useState("");

  const days = ["Mon Jul 6", "Tue Jul 7", "Wed Jul 8", "Thu Jul 9", "Fri Jul 10", "Sat Jul 11", "Sun Jul 12"];
  const employees = user.role === "dept_manager" ? EMPLOYEES.filter(e => e.dept === user.dept) : EMPLOYEES;
  const depts = Array.from(new Set(EMPLOYEES.map(e => e.dept)));

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  }

  const shiftColors: Record<string, string> = {
    morning: "bg-indigo-500/20 border-indigo-500/40 text-indigo-300",
    evening: "bg-amber-500/20 border-amber-500/40 text-amber-300",
    night: "bg-purple-500/20 border-purple-500/40 text-purple-300",
    off: "bg-white/5 border-border text-muted-foreground",
    conflict: "bg-red-500/20 border-red-500/40 text-red-300",
  };

  return (
    <div className="p-6">
      <SectionHeader title="Shift Planning" sub="AI-assisted schedule management"
        actions={<>
          <Btn variant="ai" icon={Sparkles} size="sm" onClick={() => showToast("AI generating optimal schedule...")}>AI Suggest</Btn>
          <Btn variant="secondary" icon={RotateCcw} size="sm" onClick={() => showToast("Schedule version restored")}>Undo</Btn>
          <Btn variant="primary" icon={Plus} size="sm" onClick={() => setShowAddModal(true)}>Add Shift</Btn>
        </>}
      />

      {/* Conflict Banner */}
      {conflicts > 0 && (
        <div className="mb-4 flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-sm">
          <AlertTriangle size={16} className="text-red-400 flex-shrink-0" />
          <span className="text-red-300 font-medium">{conflicts} shift conflict{conflicts > 1 ? "s" : ""} detected by AI.</span>
          <span className="text-red-400/70">Rahul Verma is on 6th consecutive night shift — exceeds compliance limit.</span>
          <Btn variant="danger" size="sm" onClick={() => showToast("Conflict resolved: shift reassigned")}>Resolve</Btn>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => setWeekOffset(w => w - 1)} className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground hover:text-foreground transition-all">
          <ChevronLeft size={16} />
        </button>
        <div className="text-sm font-medium text-foreground">Week of July {6 + weekOffset * 7}, 2026</div>
        <button onClick={() => setWeekOffset(w => w + 1)} className="p-2 hover:bg-white/5 rounded-lg text-muted-foreground hover:text-foreground transition-all">
          <ChevronRight size={16} />
        </button>
        <div className="ml-auto flex items-center gap-2">
          <select value={selectedDept} onChange={e => setSelectedDept(e.target.value)}
            className="bg-input-background border border-border rounded-lg px-3 py-1.5 text-xs text-foreground focus:outline-none">
            <option value="all">All Departments</option>
            {depts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Shift Grid */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="grid" style={{ gridTemplateColumns: "200px repeat(7, 1fr)" }}>
          {/* Header */}
          <div className="px-4 py-3 border-b border-r border-border bg-background/50">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Employee</span>
          </div>
          {days.map(d => (
            <div key={d} className="px-2 py-3 border-b border-r border-border bg-background/50 text-center">
              <div className="text-xs font-semibold text-foreground">{d.split(" ")[0]}</div>
              <div className="text-xs text-muted-foreground">{d.split(" ")[1]}</div>
            </div>
          ))}

          {/* Rows */}
          {employees.slice(0, 8).map((emp, i) => (
            <>
              <div key={`name-${emp.id}`} className="flex items-center gap-2 px-3 py-3 border-b border-r border-border/50">
                <Avatar name={emp.name} size="sm" />
                <div className="min-w-0">
                  <div className="text-xs font-medium text-foreground truncate">{emp.name.split(" ")[0]}</div>
                  <div className="text-xs text-muted-foreground truncate">{emp.dept}</div>
                </div>
              </div>
              {days.map((d, di) => {
                const shiftType = di === 5 || di === 6 ? "off" : i % 3 === 0 && di % 2 === 0 ? "morning" : i % 3 === 1 ? "evening" : i === 6 ? "conflict" : "morning";
                const times = { morning: "08:00–17:00", evening: "14:00–23:00", night: "22:00–06:00", off: "Day Off", conflict: "22:00–06:00 ⚠" }[shiftType];
                return (
                  <div key={`${emp.id}-${d}`} className="px-2 py-2 border-b border-r border-border/50 flex items-center justify-center">
                    <div className={`w-full rounded-md border px-2 py-1.5 text-center cursor-pointer hover:opacity-80 transition-all ${shiftColors[shiftType]}`}
                      onClick={() => showToast(`Editing ${emp.name}'s shift on ${d}`)}>
                      <div className="text-xs font-medium capitalize">{shiftType}</div>
                      <div className="text-xs opacity-70">{times}</div>
                    </div>
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-4">
        {[["Morning", "bg-indigo-500"], ["Evening", "bg-amber-500"], ["Night", "bg-purple-500"], ["Off", "bg-white/20"], ["Conflict", "bg-red-500"]].map(([l, c]) => (
          <div key={l} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <div className={`w-2.5 h-2.5 rounded-sm ${c}`} />{l}
          </div>
        ))}
      </div>

      {/* Add Shift Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-foreground">Add New Shift</h2>
              <button onClick={() => setShowAddModal(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              {[["Employee", "select-emp"], ["Department", "select-dept"], ["Date", "date"], ["Start Time", "time"], ["End Time", "time"], ["Shift Type", "select-type"]].map(([l, t]) => (
                <div key={l}>
                  <label className="block text-xs font-medium text-foreground mb-1.5">{l}</label>
                  {t === "select-emp" ? (
                    <select className="w-full bg-input-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500/50">
                      {EMPLOYEES.map(e => <option key={e.id}>{e.name}</option>)}
                    </select>
                  ) : t === "select-dept" ? (
                    <select className="w-full bg-input-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500/50">
                      {depts.map(d => <option key={d}>{d}</option>)}
                    </select>
                  ) : t === "select-type" ? (
                    <select className="w-full bg-input-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500/50">
                      {["Morning", "Evening", "Night"].map(s => <option key={s}>{s}</option>)}
                    </select>
                  ) : (
                    <input type={t} className="w-full bg-input-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500/50" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <Btn variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Btn>
              <Btn variant="primary" icon={Save} onClick={() => { setShowAddModal(false); showToast("Shift created successfully"); }}>Save Shift</Btn>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-2xl z-50 flex items-center gap-2">
          <CheckCircle size={15} />{toast}
        </div>
      )}
    </div>
  );
}

// ─── FATIGUE CENTER ───────────────────────────────────────────────────────────
function FatigueCenterPage() {
  const highRisk = EMPLOYEES.filter(e => e.fatigue >= 70);
  const medRisk = EMPLOYEES.filter(e => e.fatigue >= 40 && e.fatigue < 70);
  const lowRisk = EMPLOYEES.filter(e => e.fatigue < 40);

  return (
    <div className="p-6 space-y-6">
      <SectionHeader title="Fatigue Intelligence Center" sub="AI-powered burnout detection and risk analysis"
        actions={<>
          <Badge variant="ai"><Sparkles size={10} />AI Active</Badge>
          <Btn variant="secondary" icon={Download} size="sm">Export Report</Btn>
        </>}
      />

      {/* Risk Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3"><AlertTriangle size={18} className="text-red-400" /><span className="text-sm font-semibold text-red-400">High Risk</span></div>
          <div className="text-3xl font-bold font-mono text-red-400">{highRisk.length}</div>
          <div className="text-sm text-red-300/70 mt-1">Employees — Immediate action required</div>
          <ProgressBar value={highRisk.length} max={EMPLOYEES.length} color="bg-red-500" />
        </div>
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3"><AlertCircle size={18} className="text-amber-400" /><span className="text-sm font-semibold text-amber-400">Medium Risk</span></div>
          <div className="text-3xl font-bold font-mono text-amber-400">{medRisk.length}</div>
          <div className="text-sm text-amber-300/70 mt-1">Employees — Monitor closely</div>
          <ProgressBar value={medRisk.length} max={EMPLOYEES.length} color="bg-amber-500" />
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3"><CheckCircle size={18} className="text-emerald-400" /><span className="text-sm font-semibold text-emerald-400">Low Risk</span></div>
          <div className="text-3xl font-bold font-mono text-emerald-400">{lowRisk.length}</div>
          <div className="text-sm text-emerald-300/70 mt-1">Employees — Healthy status</div>
          <ProgressBar value={lowRisk.length} max={EMPLOYEES.length} color="bg-emerald-500" />
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Dept Fatigue Trend */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-sm font-semibold text-foreground mb-1">Department Fatigue Trend</div>
          <div className="text-xs text-muted-foreground mb-4">4-week rolling average (%)</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={fatigueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="week" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid rgba(148,163,184,0.1)", borderRadius: "8px", color: "#e2e8f0" }} />
              <Legend />
              <Line type="monotone" dataKey="engineering" stroke="#6366f1" strokeWidth={2} dot={false} name="Engineering" />
              <Line type="monotone" dataKey="operations" stroke="#22d3ee" strokeWidth={2} dot={false} name="Operations" />
              <Line type="monotone" dataKey="security" stroke="#ef4444" strokeWidth={2} dot={false} name="Security" />
              <Line type="monotone" dataKey="hr" stroke="#10b981" strokeWidth={2} dot={false} name="HR" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Fatigue */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-sm font-semibold text-foreground mb-1">This Week's Trend</div>
          <div className="text-xs text-muted-foreground mb-4">Organization average daily fatigue</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weeklyTrend}>
              <defs>
                <linearGradient id="fatGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid rgba(148,163,184,0.1)", borderRadius: "8px", color: "#e2e8f0" }} />
              <Area type="monotone" dataKey="fatigue" stroke="#ef4444" strokeWidth={2} fill="url(#fatGrad)" name="Avg Fatigue %" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Employee Risk Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="text-sm font-semibold text-foreground">Employee Risk Rankings</div>
          <Badge variant="ai"><Brain size={10} />AI Powered</Badge>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Employee</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Shift Type</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Fatigue</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Risk Level</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">AI Recommendation</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {[...EMPLOYEES].sort((a, b) => b.fatigue - a.fatigue).map(e => (
              <tr key={e.id} className="border-b border-border/50 hover:bg-white/3 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar name={e.name} size="sm" />
                    <div>
                      <div className="font-medium text-foreground">{e.name}</div>
                      <div className="text-xs text-muted-foreground">{e.dept}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{e.shift}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-bold font-mono ${fatigueColor(e.fatigue)}`}>{e.fatigue}%</span>
                    <div className="w-20"><ProgressBar value={e.fatigue} color={fatigueBar(e.fatigue)} /></div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={e.fatigue >= 70 ? "error" : e.fatigue >= 40 ? "warning" : "success"}>
                    {e.fatigue >= 70 ? "High Risk" : e.fatigue >= 40 ? "Medium" : "Low Risk"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {e.fatigue >= 70 ? "Mandatory rest period — remove from night shifts" : e.fatigue >= 40 ? "Monitor closely, consider schedule adjustment" : "No action needed"}
                </td>
                <td className="px-4 py-3">
                  {e.fatigue >= 60 && <Btn variant="danger" size="sm" onClick={() => {}}>Alert Manager</Btn>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── ATTENDANCE PAGE ───────────────────────────────────────────────────────────
function AttendancePage({ user }: { user: AuthUser }) {
  const [clockedIn, setClockedIn] = useState(false);
  const [clockTime, setClockTime] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [toast, setToast] = useState("");

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  function handleClock() {
    const t = currentTime.toLocaleTimeString();
    if (!clockedIn) { setClockedIn(true); setClockTime(t); showToast(`Clocked in at ${t}`); }
    else { setClockedIn(false); showToast(`Clocked out at ${t}`); }
  }

  const liveStatus = [
    { name: "Rajesh Kumar", status: "active", clockIn: "08:12", dept: "Engineering" },
    { name: "Meera Patel", status: "active", clockIn: "08:45", dept: "Engineering" },
    { name: "Vikram Singh", status: "active", clockIn: "09:00", dept: "Operations" },
    { name: "Divya Krishnan", status: "on-leave", clockIn: "—", dept: "HR" },
    { name: "Mohammed Khan", status: "absent", clockIn: "—", dept: "Engineering" },
    { name: "Ananya Roy", status: "remote", clockIn: "09:30", dept: "Analytics" },
  ];

  return (
    <div className="p-6 space-y-6">
      <SectionHeader title="Attendance" sub="Live tracking and analytics"
        actions={<Btn variant="secondary" icon={Download} size="sm">Export CSV</Btn>}
      />

      {/* Clock widget — visible to all */}
      <div className="bg-gradient-to-br from-indigo-600/20 to-cyan-600/10 border border-indigo-500/20 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Current Time</div>
            <div className="text-4xl font-bold font-mono text-foreground tracking-tight">
              {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </div>
            <div className="text-sm text-muted-foreground mt-1">{currentTime.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
            {clockedIn && <div className="mt-2 flex items-center gap-2 text-xs text-emerald-400"><div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />Clocked in at {clockTime}</div>}
          </div>
          <button onClick={handleClock}
            className={`w-24 h-24 rounded-full border-2 flex flex-col items-center justify-center gap-1 transition-all font-semibold text-sm ${clockedIn ? "border-red-500 bg-red-500/15 text-red-400 hover:bg-red-500/25" : "border-emerald-500 bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"}`}>
            {clockedIn ? <><StopCircle size={24} />Clock Out</> : <><Play size={24} />Clock In</>}
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Present Today" value="136" change={2} icon={CheckCircle} color="emerald" />
        <KPICard label="Late Arrivals" value="8" icon={Clock} color="amber" />
        <KPICard label="Absent" value="6" icon={XCircle} color="red" />
        <KPICard label="Remote" value="12" icon={Globe} color="cyan" />
      </div>

      {/* Live Status Table */}
      {user.role !== "employee" && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="text-sm font-semibold text-foreground flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />Live Attendance
            </div>
            <div className="text-xs text-muted-foreground">{currentTime.toLocaleTimeString()}</div>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Employee", "Department", "Clock In", "Status", "Hours Worked"].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {liveStatus.map((e, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-white/3 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={e.name} size="sm" />
                      <span className="font-medium text-foreground">{e.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{e.dept}</td>
                  <td className="px-5 py-3 font-mono text-foreground">{e.clockIn}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[e.status]}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusDot[e.status]}`} />{e.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-mono text-foreground">
                    {e.clockIn !== "—" ? `${(5 + i * 0.7).toFixed(1)}h` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-2xl z-50 flex items-center gap-2">
          <CheckCircle size={15} />{toast}
        </div>
      )}
    </div>
  );
}

// ─── LEAVE PAGE ───────────────────────────────────────────────────────────────
function LeavePage({ user }: { user: AuthUser }) {
  const [leaves, setLeaves] = useState(LEAVE_REQUESTS);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState("");
  const [form, setForm] = useState({ type: "Annual Leave", from: "", to: "", reason: "" });

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  function handleApprove(id: string) {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: "approved" as const } : l));
    showToast("Leave approved and employee notified");
  }
  function handleReject(id: string) {
    setLeaves(prev => prev.map(l => l.id === id ? { ...l, status: "rejected" as const } : l));
    showToast("Leave rejected");
  }
  function handleApply() {
    if (!form.from || !form.to || !form.reason) { showToast("Please fill all fields"); return; }
    const newLeave: LeaveRequest = {
      id: `l${Date.now()}`, employeeId: user.id, employeeName: user.name,
      type: form.type, from: form.from, to: form.to,
      days: Math.ceil((new Date(form.to).getTime() - new Date(form.from).getTime()) / 86400000) + 1,
      reason: form.reason, status: "pending", appliedOn: new Date().toISOString().split("T")[0],
      managerId: "u3",
    };
    setLeaves(prev => [newLeave, ...prev]);
    setShowForm(false);
    setForm({ type: "Annual Leave", from: "", to: "", reason: "" });
    showToast("Leave request submitted successfully");
  }

  const canApprove = user.role === "superadmin" || user.role === "hr_manager" || user.role === "dept_manager";
  const myLeaves = user.role === "employee" ? leaves.filter(l => l.employeeId === user.id) : leaves;

  return (
    <div className="p-6 space-y-6">
      <SectionHeader title="Leave Management" sub="Track, request, and approve leave"
        actions={<Btn variant="primary" icon={Plus} size="sm" onClick={() => setShowForm(true)}>Request Leave</Btn>}
      />

      {/* Leave Balances */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { type: "Annual Leave", used: 8, total: 21, color: "indigo" },
          { type: "Medical Leave", used: 3, total: 12, color: "emerald" },
          { type: "Casual Leave", used: 2, total: 6, color: "amber" },
          { type: "Emergency Leave", used: 0, total: 3, color: "red" },
        ].map(b => (
          <div key={b.type} className="bg-card border border-border rounded-xl p-4">
            <div className="text-xs font-medium text-muted-foreground mb-2">{b.type}</div>
            <div className="text-2xl font-bold font-mono text-foreground">{b.total - b.used}<span className="text-sm text-muted-foreground">/{b.total}</span></div>
            <div className="text-xs text-muted-foreground mb-2">days remaining</div>
            <ProgressBar value={b.used} max={b.total} color={`bg-${b.color}-500`} />
          </div>
        ))}
      </div>

      {/* Leave Requests Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="text-sm font-semibold text-foreground">Leave Requests</div>
          {canApprove && (
            <Btn variant="secondary" size="sm" icon={CheckSquare}
              onClick={() => { leaves.filter(l => l.status === "pending").forEach(l => handleApprove(l.id)); showToast("All pending leaves approved"); }}>
              Bulk Approve
            </Btn>
          )}
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {(canApprove ? ["Employee", "Type", "Duration", "Days", "Reason", "Applied", "Status", ""] : ["Type", "Duration", "Days", "Status"]).map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {myLeaves.map(l => (
              <tr key={l.id} className="border-b border-border/50 hover:bg-white/3 transition-colors">
                {canApprove && (
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3"><Avatar name={l.employeeName} size="sm" />
                      <span className="font-medium text-foreground">{l.employeeName}</span>
                    </div>
                  </td>
                )}
                <td className="px-5 py-3 text-muted-foreground">{l.type}</td>
                <td className="px-5 py-3 text-foreground font-mono text-xs">{l.from} → {l.to}</td>
                <td className="px-5 py-3 text-foreground font-mono">{l.days}d</td>
                {canApprove && <td className="px-5 py-3 text-muted-foreground text-xs">{l.reason}</td>}
                {canApprove && <td className="px-5 py-3 text-muted-foreground text-xs">{l.appliedOn}</td>}
                <td className="px-5 py-3">
                  <Badge variant={l.status === "approved" ? "success" : l.status === "rejected" ? "error" : "warning"}>
                    {l.status}
                  </Badge>
                </td>
                {canApprove && (
                  <td className="px-5 py-3">
                    {l.status === "pending" && (
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => handleApprove(l.id)} className="px-2.5 py-1 bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-medium transition-all">Approve</button>
                        <button onClick={() => handleReject(l.id)} className="px-2.5 py-1 bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/20 rounded-lg text-xs font-medium transition-all">Reject</button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Leave Request Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-card border border-border rounded-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-foreground">Request Leave</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Leave Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                  className="w-full bg-input-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500/50">
                  {["Annual Leave", "Medical Leave", "Casual Leave", "Emergency Leave", "Half-Day"].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">From</label>
                  <input type="date" value={form.from} onChange={e => setForm({ ...form, from: e.target.value })}
                    className="w-full bg-input-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500/50" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5">To</label>
                  <input type="date" value={form.to} onChange={e => setForm({ ...form, to: e.target.value })}
                    className="w-full bg-input-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500/50" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">Reason</label>
                <textarea value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })}
                  rows={3} className="w-full bg-input-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500/50 resize-none"
                  placeholder="Briefly describe the reason..." />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Btn variant="secondary" onClick={() => setShowForm(false)}>Cancel</Btn>
              <Btn variant="primary" icon={Send} onClick={handleApply}>Submit Request</Btn>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-2xl z-50 flex items-center gap-2">
          <CheckCircle size={15} />{toast}
        </div>
      )}
    </div>
  );
}

// ─── OVERTIME PAGE ────────────────────────────────────────────────────────────
function OvertimePage() {
  const [toast, setToast] = useState("");
  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  return (
    <div className="p-6 space-y-6">
      <SectionHeader title="Overtime Management" sub="Track, approve, and analyze overtime hours"
        actions={<Btn variant="primary" icon={Plus} size="sm" onClick={() => showToast("Overtime request form opened")}>Request Overtime</Btn>}
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Total OT Hours" value="728h" change={-12} icon={Clock} color="amber" sub="This month" />
        <KPICard label="OT Cost" value="₹9.4L" change={-8} icon={DollarSign} color="red" sub="vs ₹10.2L last month" />
        <KPICard label="Pending Approvals" value="14" icon={ClipboardList} color="indigo" />
        <KPICard label="AI Flag: Over-utilization" value="3" icon={AlertTriangle} color="red" sub="Employees at risk" />
      </div>
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="text-sm font-semibold text-foreground mb-4">Department Overtime Analysis</div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={overtimeData} layout="vertical" barSize={16}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
            <XAxis type="number" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis dataKey="dept" type="category" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} width={80} />
            <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid rgba(148,163,184,0.1)", borderRadius: "8px", color: "#e2e8f0" }} />
            <Bar dataKey="hours" fill="#f59e0b" radius={[0, 4, 4, 0]} name="Hours" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      {toast && (
        <div className="fixed bottom-6 right-6 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-2xl z-50 flex items-center gap-2">
          <CheckCircle size={15} />{toast}
        </div>
      )}
    </div>
  );
}

// ─── PAYROLL PAGE ─────────────────────────────────────────────────────────────
function PayrollPage({ user }: { user: AuthUser }) {
  const [toast, setToast] = useState("");
  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  const payslips = user.role === "employee"
    ? [{ month: "June 2026", gross: 145000, deductions: 18500, net: 126500, status: "paid" }]
    : EMPLOYEES.slice(0, 8).map(e => ({ name: e.name, dept: e.dept, gross: e.salary, deductions: Math.round(e.salary * 0.13), net: Math.round(e.salary * 0.87), status: "paid" }));

  return (
    <div className="p-6 space-y-6">
      <SectionHeader title="Payroll" sub={user.role === "employee" ? "Your salary and payslips" : "Organization payroll management"}
        actions={<>
          <Btn variant="secondary" icon={Download} size="sm" onClick={() => showToast("Payroll report exported as PDF")}>Export PDF</Btn>
          {user.role !== "employee" && <Btn variant="primary" icon={Play} size="sm" onClick={() => showToast("Payroll processing initiated for July 2026")}>Run Payroll</Btn>}
        </>}
      />
      {user.role !== "employee" && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard label="Total Payroll" value="₹1.84Cr" change={3} icon={DollarSign} color="emerald" sub="July 2026" />
          <KPICard label="Avg Salary" value="₹1.23L" icon={TrendingUp} color="indigo" />
          <KPICard label="Employees Paid" value="142" icon={CheckCircle} color="emerald" sub="June 2026 processed" />
          <KPICard label="Pending" value="8" icon={Clock} color="amber" sub="Awaiting approval" />
        </div>
      )}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="text-sm font-semibold text-foreground">{user.role === "employee" ? "My Payslips" : "Payroll Summary — July 2026"}</div>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {user.role === "employee"
                ? ["Month", "Gross Pay", "Deductions", "Net Pay", "Status", ""].map(h => <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>)
                : ["Employee", "Department", "Gross Pay", "Deductions", "Net Pay", "Status"].map(h => <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>)
              }
            </tr>
          </thead>
          <tbody>
            {user.role === "employee" ? (
              payslips.map((p: any, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-white/3 transition-colors">
                  <td className="px-5 py-3 font-medium text-foreground">{p.month}</td>
                  <td className="px-5 py-3 font-mono text-foreground">₹{p.gross.toLocaleString()}</td>
                  <td className="px-5 py-3 font-mono text-red-400">-₹{p.deductions.toLocaleString()}</td>
                  <td className="px-5 py-3 font-mono font-bold text-emerald-400">₹{p.net.toLocaleString()}</td>
                  <td className="px-5 py-3"><Badge variant="success">Credited</Badge></td>
                  <td className="px-5 py-3"><Btn variant="ghost" size="sm" icon={Download} onClick={() => showToast("Payslip downloaded")}>Download</Btn></td>
                </tr>
              ))
            ) : (
              payslips.map((p: any, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-white/3 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3"><Avatar name={p.name} size="sm" /><span className="font-medium text-foreground">{p.name}</span></div>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{p.dept}</td>
                  <td className="px-5 py-3 font-mono text-foreground">₹{p.gross.toLocaleString()}</td>
                  <td className="px-5 py-3 font-mono text-red-400">-₹{p.deductions.toLocaleString()}</td>
                  <td className="px-5 py-3 font-mono font-bold text-emerald-400">₹{p.net.toLocaleString()}</td>
                  <td className="px-5 py-3"><Badge variant="success">Paid</Badge></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {toast && (
        <div className="fixed bottom-6 right-6 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-2xl z-50 flex items-center gap-2">
          <CheckCircle size={15} />{toast}
        </div>
      )}
    </div>
  );
}

// ─── REPORTS PAGE ─────────────────────────────────────────────────────────────
function ReportsPage() {
  const [toast, setToast] = useState("");
  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  const reports = [
    { name: "Attendance Report", desc: "Daily/Monthly attendance analysis with trends", icon: Clock, color: "indigo" },
    { name: "Leave Report", desc: "Leave balance, usage, and approval analytics", icon: Coffee, color: "amber" },
    { name: "Payroll Report", desc: "Salary, deductions, and cost breakdown", icon: DollarSign, color: "emerald" },
    { name: "Fatigue Report", desc: "AI burnout risk and shift analysis", icon: Brain, color: "red" },
    { name: "Compliance Report", desc: "Labor law violations and audit trail", icon: Shield, color: "purple" },
    { name: "Department Report", desc: "Dept-wise productivity and headcount", icon: Building2, color: "cyan" },
    { name: "Shift Report", desc: "Schedule coverage and efficiency metrics", icon: CalendarDays, color: "amber" },
    { name: "AI Insights Report", desc: "Predictive analytics and recommendations", icon: Sparkles, color: "cyan" },
  ];

  return (
    <div className="p-6 space-y-6">
      <SectionHeader title="Reports" sub="Generate, export, and share organizational reports"
        actions={<Badge variant="ai"><Sparkles size={10} />AI-Generated Insights Available</Badge>}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {reports.map(r => {
          const colorMap: Record<string, string> = {
            indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
            amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
            emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
            red: "text-red-400 bg-red-500/10 border-red-500/20",
            purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
            cyan: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
          };
          return (
            <div key={r.name} className="bg-card border border-border rounded-xl p-5 hover:border-indigo-500/30 transition-all">
              <div className={`inline-flex p-2.5 rounded-xl border mb-4 ${colorMap[r.color]}`}>
                <r.icon size={18} />
              </div>
              <div className="text-sm font-semibold text-foreground mb-1">{r.name}</div>
              <div className="text-xs text-muted-foreground mb-4 leading-relaxed">{r.desc}</div>
              <div className="flex items-center gap-2">
                <button onClick={() => showToast(`${r.name} generated as PDF`)} className="flex-1 py-1.5 bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-400 border border-indigo-500/20 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5">
                  <FileText size={11} />PDF
                </button>
                <button onClick={() => showToast(`${r.name} exported as Excel`)} className="flex-1 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5">
                  <Download size={11} />Excel
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {toast && (
        <div className="fixed bottom-6 right-6 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-2xl z-50 flex items-center gap-2">
          <CheckCircle size={15} />{toast}
        </div>
      )}
    </div>
  );
}

// ─── COMPLIANCE PAGE ──────────────────────────────────────────────────────────
function CompliancePage() {
  const violations = [
    { rule: "Max 72 hrs/week", dept: "Operations", severity: "high", count: 3, employees: ["Rahul Verma", "Suresh Menon", "+1"] },
    { rule: "Min 11hr rest between shifts", dept: "Security", severity: "high", count: 2, employees: ["Suresh Menon", "Guard #14"] },
    { rule: "Night shift limit (4 consecutive)", dept: "Operations", severity: "medium", count: 1, employees: ["Rahul Verma"] },
  ];
  const [toast, setToast] = useState("");
  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  return (
    <div className="p-6 space-y-6">
      <SectionHeader title="Compliance Center" sub="Labor law adherence and regulatory monitoring" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard label="Compliance Score" value="91%" change={-3} icon={Shield} color="emerald" />
        <KPICard label="Active Violations" value={violations.length} icon={AlertTriangle} color="red" sub="Requires immediate action" />
        <KPICard label="Rules Monitored" value="47" icon={CheckSquare} color="indigo" />
        <KPICard label="Audit Ready" value="Yes" icon={CheckCircle} color="emerald" />
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <div className="text-sm font-semibold text-foreground">Active Violations</div>
        </div>
        <div className="p-5 space-y-3">
          {violations.map((v, i) => (
            <div key={i} className="flex items-start gap-4 p-4 bg-red-500/5 border border-red-500/20 rounded-xl">
              <AlertTriangle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-foreground">{v.rule}</span>
                  <Badge variant="error">High</Badge>
                </div>
                <div className="text-xs text-muted-foreground">{v.dept} · {v.count} employee{v.count > 1 ? "s" : ""}: {v.employees.join(", ")}</div>
              </div>
              <Btn variant="danger" size="sm" onClick={() => showToast("Manager notified and shift adjusted")}>Resolve</Btn>
            </div>
          ))}
        </div>
      </div>
      {toast && (
        <div className="fixed bottom-6 right-6 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-2xl z-50 flex items-center gap-2">
          <CheckCircle size={15} />{toast}
        </div>
      )}
    </div>
  );
}

// ─── AUDIT LOGS PAGE ──────────────────────────────────────────────────────────
function AuditLogsPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const filtered = auditLogs.filter(l => {
    const matchF = filter === "all" || l.severity === filter;
    const matchQ = !search || l.user.toLowerCase().includes(search.toLowerCase()) || l.action.toLowerCase().includes(search.toLowerCase());
    return matchF && matchQ;
  });
  const [toast, setToast] = useState("");

  return (
    <div className="p-6 space-y-6">
      <SectionHeader title="Audit Logs" sub="Complete audit trail of all system actions"
        actions={<Btn variant="secondary" icon={Download} size="sm" onClick={() => { setToast("Audit log exported"); setTimeout(() => setToast(""), 3000); }}>Export</Btn>}
      />
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search logs..."
            className="bg-input-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-foreground w-56 focus:outline-none" />
        </div>
        {["all", "high", "medium", "low"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${filter === f ? "bg-indigo-600 text-white" : "bg-white/5 text-muted-foreground hover:text-foreground"}`}>
            {f === "all" ? "All Events" : `${f} severity`}
          </button>
        ))}
      </div>
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              {["Time", "User", "Action", "Target", "IP", "Severity"].map(h => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(log => (
              <tr key={log.id} className="border-b border-border/50 hover:bg-white/3 transition-colors">
                <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{log.time}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2"><Avatar name={log.user === "System" ? "SY" : log.user} size="sm" /><span className="text-foreground font-medium">{log.user}</span></div>
                </td>
                <td className="px-5 py-3 text-foreground">{log.action}</td>
                <td className="px-5 py-3 text-muted-foreground text-xs">{log.target}</td>
                <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{log.ip}</td>
                <td className="px-5 py-3"><Badge variant={log.severity === "high" ? "error" : log.severity === "medium" ? "warning" : "default"}>{log.severity}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {toast && (
        <div className="fixed bottom-6 right-6 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-2xl z-50 flex items-center gap-2">
          <CheckCircle size={15} />{toast}
        </div>
      )}
    </div>
  );
}

// ─── ROLES PAGE ───────────────────────────────────────────────────────────────
function RolesPage() {
  const [selectedRole, setSelectedRole] = useState<string>("superadmin");
  const allPerms = [
    "employees.view", "employees.edit", "employees.delete",
    "shifts.view", "shifts.edit", "shifts.delete",
    "leave.approve", "leave.request",
    "payroll.view", "payroll.edit",
    "reports.export", "reports.view",
    "attendance.view", "attendance.clock",
    "overtime.approve", "overtime.request",
    "compliance.view", "audit.view",
    "roles.manage", "settings.manage",
    "profile.view", "payslip.view",
  ];
  const [toast, setToast] = useState("");

  return (
    <div className="p-6 space-y-6">
      <SectionHeader title="Roles & Permissions" sub="Visual RBAC builder and permission matrix"
        actions={<Btn variant="primary" icon={Plus} size="sm" onClick={() => { setToast("New role created"); setTimeout(() => setToast(""), 3000); }}>Create Role</Btn>}
      />

      <div className="grid grid-cols-4 gap-4 mb-6">
        {Object.entries(ROLES_PERMISSIONS).map(([k, r]) => (
          <button key={k} onClick={() => setSelectedRole(k)}
            className={`p-4 rounded-xl border text-left transition-all ${selectedRole === k ? "border-indigo-500/50 bg-indigo-500/10" : "border-border bg-card hover:border-indigo-500/20"}`}>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full" style={{ background: r.color }} />
              <span className="text-sm font-semibold text-foreground">{r.label}</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {r.permissions[0] === "all" ? "All permissions" : `${r.permissions.length} permissions`}
            </div>
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="text-sm font-semibold text-foreground">Permission Matrix — {ROLES_PERMISSIONS[selectedRole as keyof typeof ROLES_PERMISSIONS]?.label}</div>
          <Btn variant="primary" size="sm" icon={Save} onClick={() => { setToast("Permissions saved successfully"); setTimeout(() => setToast(""), 3000); }}>Save Changes</Btn>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {allPerms.map(perm => {
              const roleData = ROLES_PERMISSIONS[selectedRole as keyof typeof ROLES_PERMISSIONS];
              const hasAll = roleData?.permissions[0] === "all";
              const hasPerm = hasAll || roleData?.permissions.includes(perm);
              return (
                <div key={perm} className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${hasPerm ? "bg-indigo-500/8 border-indigo-500/20" : "bg-white/2 border-border"}`}>
                  <div className={`w-4 h-4 rounded flex items-center justify-center flex-shrink-0 ${hasPerm ? "bg-indigo-500" : "bg-white/10 border border-border"}`}>
                    {hasPerm && <CheckCircle size={12} className="text-white" />}
                  </div>
                  <span className="text-xs font-mono text-foreground">{perm}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {toast && (
        <div className="fixed bottom-6 right-6 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-2xl z-50 flex items-center gap-2">
          <CheckCircle size={15} />{toast}
        </div>
      )}
    </div>
  );
}

// ─── ANALYTICS PAGE ───────────────────────────────────────────────────────────
function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <SectionHeader title="Analytics" sub="Executive insights and predictive analytics" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-sm font-semibold text-foreground mb-1">Productivity vs Fatigue Correlation</div>
          <div className="text-xs text-muted-foreground mb-4">AI-detected inverse relationship</div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={productivityData}>
              <defs>
                <linearGradient id="p2Grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid rgba(148,163,184,0.1)", borderRadius: "8px", color: "#e2e8f0" }} />
              <Area type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} fill="url(#p2Grad)" name="Productivity Score" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="text-sm font-semibold text-foreground mb-1">Department Performance Radar</div>
          <div className="text-xs text-muted-foreground mb-4">Multi-metric comparison</div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={[
              { metric: "Attendance", Engineering: 95, Operations: 88, Security: 84, HR: 97 },
              { metric: "Productivity", Engineering: 91, Operations: 79, Security: 74, HR: 88 },
              { metric: "Wellness", Engineering: 72, Operations: 55, Security: 42, HR: 82 },
              { metric: "Compliance", Engineering: 96, Operations: 78, Security: 68, HR: 99 },
              { metric: "Satisfaction", Engineering: 84, Operations: 71, Security: 65, HR: 90 },
            ]}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="metric" tick={{ fill: "#64748b", fontSize: 11 }} />
              <Radar name="Engineering" dataKey="Engineering" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} />
              <Radar name="Operations" dataKey="Operations" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.1} />
              <Radar name="Security" dataKey="Security" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} />
              <Legend />
              <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid rgba(148,163,184,0.1)", borderRadius: "8px", color: "#e2e8f0" }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="text-sm font-semibold text-foreground">Overtime Cost Trend by Department</div>
          <Badge variant="ai"><Sparkles size={10} />AI Forecast</Badge>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={overtimeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="dept" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#0a1628", border: "1px solid rgba(148,163,184,0.1)", borderRadius: "8px", color: "#e2e8f0" }} formatter={(v: any) => [`₹${(v/1000).toFixed(0)}k`, "Cost"]} />
            <Bar dataKey="cost" fill="#6366f1" radius={[4, 4, 0, 0]} name="OT Cost (₹)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── NOTIFICATIONS PAGE ───────────────────────────────────────────────────────
function NotificationsPage({ notifications, setNotifications }: {
  notifications: Notification[];
  setNotifications: (n: Notification[]) => void;
}) {
  function markRead(id: string) {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  }
  function markAllRead() {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  }

  const typeIcon: Record<string, any> = { info: Info, warning: AlertTriangle, error: XCircle, success: CheckCircle, ai: Sparkles };
  const typeColor: Record<string, string> = {
    info: "text-indigo-400 bg-indigo-500/10",
    warning: "text-amber-400 bg-amber-500/10",
    error: "text-red-400 bg-red-500/10",
    success: "text-emerald-400 bg-emerald-500/10",
    ai: "text-cyan-400 bg-cyan-500/10",
  };

  return (
    <div className="p-6 space-y-6">
      <SectionHeader title="Notifications" sub={`${notifications.filter(n => !n.read).length} unread`}
        actions={<Btn variant="ghost" size="sm" onClick={markAllRead}>Mark all read</Btn>}
      />
      <div className="space-y-2">
        {notifications.map(n => {
          const Icon = typeIcon[n.type] || Info;
          return (
            <div key={n.id} onClick={() => markRead(n.id)}
              className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer hover:bg-white/3 ${!n.read ? "bg-white/3 border-border" : "border-transparent opacity-60"}`}>
              <div className={`p-2 rounded-lg flex-shrink-0 ${typeColor[n.type]}`}><Icon size={16} /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-semibold text-foreground">{n.title}</span>
                  {!n.read && <span className="w-2 h-2 bg-indigo-500 rounded-full" />}
                  <Badge variant={n.priority === "high" ? "error" : n.priority === "medium" ? "warning" : "default"}>{n.priority}</Badge>
                </div>
                <div className="text-sm text-muted-foreground leading-relaxed">{n.message}</div>
                <div className="text-xs text-muted-foreground mt-1.5">{n.time}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── SETTINGS PAGE ────────────────────────────────────────────────────────────
function SettingsPage({ user }: { user: AuthUser }) {
  const [toast, setToast] = useState("");
  const [name, setName] = useState(user.name);
  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(""), 3000); }

  return (
    <div className="p-6 space-y-6">
      <SectionHeader title="Settings" sub="Manage your profile and organization preferences" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="text-sm font-semibold text-foreground mb-4">Profile Information</div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Full Name", value: name, onChange: setName },
              ].map(f => (
                <div key={f.label} className="col-span-2">
                  <label className="block text-xs font-medium text-foreground mb-1.5">{f.label}</label>
                  <input value={f.value} onChange={e => f.onChange(e.target.value)}
                    className="w-full bg-input-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500/50" />
                </div>
              ))}
              {[
                { label: "Employee ID", value: user.employeeId },
                { label: "Department", value: user.dept },
                { label: "Role", value: ROLES_PERMISSIONS[user.role].label },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-medium text-foreground mb-1.5">{f.label}</label>
                  <div className="bg-input-background border border-border rounded-lg px-3 py-2 text-sm text-muted-foreground">{f.value}</div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Btn variant="primary" icon={Save} onClick={() => showToast("Profile updated successfully")}>Save Changes</Btn>
            </div>
          </div>

          {user.role === "superadmin" && (
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="text-sm font-semibold text-foreground mb-4">Organization Settings</div>
              <div className="space-y-3">
                {[
                  { label: "Organization Name", value: "WorkSphere Technologies Pvt. Ltd." },
                  { label: "Industry", value: "Technology / Enterprise SaaS" },
                  { label: "Headquarters", value: "Bangalore, Karnataka, India" },
                  { label: "Fiscal Year", value: "April – March" },
                ].map(f => (
                  <div key={f.label}>
                    <label className="block text-xs font-medium text-foreground mb-1.5">{f.label}</label>
                    <input defaultValue={f.value}
                      className="w-full bg-input-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-indigo-500/50" />
                  </div>
                ))}
              </div>
              <div className="mt-4"><Btn variant="primary" icon={Save} onClick={() => showToast("Organization settings saved")}>Save</Btn></div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="text-sm font-semibold text-foreground mb-4">Security</div>
            <div className="space-y-3">
              <Btn variant="secondary" icon={Key} onClick={() => showToast("Password reset email sent")}>Change Password</Btn>
              <Btn variant="secondary" icon={Shield} onClick={() => showToast("2FA setup initiated")}>Enable 2FA</Btn>
              {user.role === "superadmin" && <Btn variant="secondary" icon={Database} onClick={() => showToast("API key generated")}>Generate API Key</Btn>}
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="text-sm font-semibold text-foreground mb-4">Preferences</div>
            <div className="space-y-3">
              {[
                { label: "Email Notifications", enabled: true },
                { label: "AI Alerts", enabled: true },
                { label: "Shift Reminders", enabled: true },
                { label: "Weekly Summary", enabled: false },
              ].map(p => (
                <div key={p.label} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{p.label}</span>
                  <button onClick={() => showToast(`${p.label} preference updated`)}
                    className={`w-10 h-5 rounded-full transition-all ${p.enabled ? "bg-indigo-500" : "bg-white/15"} relative flex items-center`}>
                    <span className={`w-4 h-4 rounded-full bg-white shadow transition-all absolute ${p.enabled ? "right-0.5" : "left-0.5"}`} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {toast && (
        <div className="fixed bottom-6 right-6 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-2xl z-50 flex items-center gap-2">
          <CheckCircle size={15} />{toast}
        </div>
      )}
    </div>
  );
}

// ─── DEPARTMENTS PAGE ─────────────────────────────────────────────────────────
function DepartmentsPage() {
  const [toast, setToast] = useState("");
  const depts = [
    { name: "Engineering", head: "Rajesh Kumar", count: 52, health: 88, fatigue: 55, color: "#6366f1" },
    { name: "Operations", head: "Vikram Singh", count: 31, health: 74, fatigue: 68, color: "#22d3ee" },
    { name: "Human Resources", head: "Priya Nair", count: 18, health: 92, fatigue: 31, color: "#10b981" },
    { name: "Security", head: "Suresh Menon", count: 12, health: 61, fatigue: 82, color: "#f59e0b" },
    { name: "Analytics", head: "Ananya Roy", count: 8, health: 94, fatigue: 28, color: "#8b5cf6" },
    { name: "Finance", head: "Sunita Rao", count: 11, health: 90, fatigue: 22, color: "#ec4899" },
    { name: "Legal", head: "Neha Gupta", count: 6, health: 91, fatigue: 30, color: "#14b8a6" },
    { name: "Product", head: "Pooja Iyer", count: 12, health: 95, fatigue: 24, color: "#f97316" },
  ];
  return (
    <div className="p-6 space-y-6">
      <SectionHeader title="Departments" sub="Organization structure and departmental health"
        actions={<Btn variant="primary" icon={Plus} size="sm" onClick={() => { setToast("New department created"); setTimeout(() => setToast(""), 3000); }}>Add Department</Btn>}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {depts.map(d => (
          <div key={d.name} className="bg-card border border-border rounded-xl p-5 hover:border-indigo-500/30 transition-all">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-3 h-3 rounded-full" style={{ background: d.color }} />
              <div className="text-sm font-semibold text-foreground">{d.name}</div>
            </div>
            <div className="text-2xl font-bold font-mono text-foreground mb-1">{d.count}</div>
            <div className="text-xs text-muted-foreground mb-3">employees · Head: {d.head.split(" ")[0]}</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Health</span>
                <span className="text-emerald-400 font-mono">{d.health}%</span>
              </div>
              <ProgressBar value={d.health} color="bg-emerald-500" />
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Fatigue</span>
                <span className={`font-mono ${fatigueColor(d.fatigue)}`}>{d.fatigue}%</span>
              </div>
              <ProgressBar value={d.fatigue} color={fatigueBar(d.fatigue)} />
            </div>
          </div>
        ))}
      </div>
      {toast && (
        <div className="fixed bottom-6 right-6 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-2xl z-50 flex items-center gap-2">
          <CheckCircle size={15} />{toast}
        </div>
      )}
    </div>
  );
}

// ─── SUPPORT PAGE ─────────────────────────────────────────────────────────────
function SupportPage() {
  const [toast, setToast] = useState("");
  return (
    <div className="p-6 space-y-6">
      <SectionHeader title="Help & Support" sub="Documentation, tutorials, and contact support" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: FileText, label: "Documentation", desc: "Complete guides and API reference", action: "Browse Docs" },
          { icon: Play, label: "Video Tutorials", desc: "Step-by-step walkthroughs", action: "Watch Videos" },
          { icon: MessageSquare, label: "Contact Support", desc: "24/7 enterprise support team", action: "Open Ticket" },
        ].map(i => (
          <div key={i.label} className="bg-card border border-border rounded-xl p-5">
            <i.icon size={24} className="text-indigo-400 mb-3" />
            <div className="text-sm font-semibold text-foreground mb-1">{i.label}</div>
            <div className="text-xs text-muted-foreground mb-4">{i.desc}</div>
            <Btn variant="secondary" size="sm" onClick={() => { setToast(`${i.action} opened`); setTimeout(() => setToast(""), 3000); }}>{i.action}</Btn>
          </div>
        ))}
      </div>
      {toast && (
        <div className="fixed bottom-6 right-6 bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium shadow-2xl z-50 flex items-center gap-2">
          <CheckCircle size={15} />{toast}
        </div>
      )}
    </div>
  );
}

// ─── AI COPILOT ───────────────────────────────────────────────────────────────
function AICopilot({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState([
    { role: "ai", content: "Hello! I'm WorkSphere AI Copilot. I can help you analyze workforce data, detect risks, generate reports, and optimize schedules. What would you like to know?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const suggestions = [
    "Who has the highest fatigue risk today?",
    "Generate a shift optimization plan for next week",
    "Summarize attendance trends for Engineering dept",
    "Which employees are approaching overtime limits?",
  ];

  const aiResponses: Record<string, string> = {
    "fatigue": "Based on current data: **Rahul Verma** (88%), **Suresh Menon** (81%), and **Karan Malhotra** (61%) are your highest fatigue risks. Rahul Verma has worked 6 consecutive night shifts — I recommend immediate rest intervention.",
    "overtime": "3 employees are approaching overtime limits this week: Rahul Verma (68h), Suresh Menon (71h), and team in Operations. The operations night shift group has exceeded the 72-hour weekly compliance threshold.",
    "attendance": "Engineering department shows 95.2% attendance this week — above org average of 91.4%. Absent employees today: Mohammed Khan (unexcused). Late arrivals peaked on Wednesday (11 employees, mostly Operations).",
    "shift": "For next week's schedule, I recommend: 1) Remove Rahul Verma from night shifts and assign to morning rotation. 2) Redistribute Security coverage to 4 employees instead of 3. 3) Add one Engineering resource to Thursday evening — current coverage is 78% of demand.",
    "default": "I've analyzed the workforce data. The key insights are: Overall org health is at 87%, fatigue risk is elevated in Security (avg 81%) and Operations (avg 68%). I recommend reviewing the Operations night schedule and approving Divya Krishnan's return-to-work plan.",
  };

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  function send(msg: string = input) {
    if (!msg.trim()) return;
    setMessages(prev => [...prev, { role: "user", content: msg }]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const lower = msg.toLowerCase();
      const key = Object.keys(aiResponses).find(k => lower.includes(k)) || "default";
      setMessages(prev => [...prev, { role: "ai", content: aiResponses[key] }]);
      setTyping(false);
    }, 1200);
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-card border border-cyan-500/20 rounded-2xl shadow-2xl z-50 flex flex-col" style={{ boxShadow: "0 0 40px rgba(34,211,238,0.1)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center">
          <Sparkles size={16} className="text-cyan-400" />
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground">AI Copilot</div>
          <div className="flex items-center gap-1.5 text-xs text-cyan-400"><div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />Active · GPT-WS-4</div>
        </div>
        <button onClick={onClose} className="ml-auto text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-white/5 rounded-lg"><X size={16} /></button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            {m.role === "ai" && (
              <div className="w-7 h-7 rounded-full bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                <Bot size={13} className="text-cyan-400" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${m.role === "ai" ? "bg-white/5 text-foreground" : "bg-indigo-600 text-white"}`}>
              {m.content}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex gap-2.5">
            <div className="w-7 h-7 rounded-full bg-cyan-500/15 border border-cyan-500/20 flex items-center justify-center">
              <Bot size={13} className="text-cyan-400" />
            </div>
            <div className="bg-white/5 rounded-2xl px-4 py-3 flex gap-1.5">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Suggestions */}
      {messages.length === 1 && (
        <div className="px-4 pb-2 space-y-1.5">
          {suggestions.map(s => (
            <button key={s} onClick={() => send(s)} className="w-full text-left text-xs text-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/15 border border-cyan-500/10 rounded-lg px-3 py-2 transition-all">
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 bg-input-background border border-border rounded-xl px-3 py-2">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
            placeholder="Ask about your workforce..." className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
          <button onClick={() => send()} className="p-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-all">
            <Send size={13} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── COMMAND PALETTE ──────────────────────────────────────────────────────────
function CommandPalette({ onClose, setPage }: { onClose: () => void; setPage: (p: Page) => void }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const allCommands = [
    ...NAV_ITEMS.map(n => ({ label: n.label, sub: "Navigate", action: () => { setPage(n.id); onClose(); }, icon: n.icon })),
    { label: "Add Employee", sub: "Quick Action", action: () => { setPage("employees"); onClose(); }, icon: UserPlus },
    { label: "Request Leave", sub: "Quick Action", action: () => { setPage("leave"); onClose(); }, icon: Coffee },
    { label: "Generate Report", sub: "Quick Action", action: () => { setPage("reports"); onClose(); }, icon: FileText },
    { label: "Open AI Copilot", sub: "AI", action: () => onClose(), icon: Sparkles },
  ];

  const filtered = allCommands.filter(c =>
    !query || c.label.toLowerCase().includes(query.toLowerCase()) || c.sub.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-start justify-center pt-24" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
          <Search size={16} className="text-muted-foreground" />
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search actions, pages, employees..." className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none" />
          <kbd className="text-xs text-muted-foreground bg-white/5 border border-border rounded px-2 py-1">ESC</kbd>
        </div>
        <div className="p-2 max-h-80 overflow-y-auto">
          {filtered.map((c, i) => (
            <button key={i} onClick={c.action}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-left transition-all">
              <c.icon size={15} className="text-muted-foreground" />
              <div>
                <div className="text-sm font-medium text-foreground">{c.label}</div>
                <div className="text-xs text-muted-foreground">{c.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── GENERIC PLACEHOLDER ─────────────────────────────────────────────────────
function PlaceholderPage({ title, icon: Icon }: { title: string; icon: any }) {
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-96">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
        <Icon size={28} className="text-indigo-400" />
      </div>
      <h2 className="text-lg font-semibold text-foreground mb-2">{title}</h2>
      <p className="text-muted-foreground text-sm text-center max-w-sm">This module is available in the full enterprise deployment. Contact your administrator to enable access.</p>
      <Btn variant="primary" icon={Sparkles} size="sm" onClick={() => {}}>Request Access</Btn>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showCmdPalette, setShowCmdPalette] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  // Keyboard shortcut for command palette
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setShowCmdPalette(p => !p); }
      if (e.key === "Escape") { setShowCmdPalette(false); setShowAI(false); }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  if (!user) return <LoginPage onLogin={u => { setUser(u); setCurrentPage("dashboard"); }} />;

  function renderPage() {
    switch (currentPage) {
      case "dashboard": return <DashboardPage user={user!} setPage={setCurrentPage} />;
      case "employees": return <EmployeesPage user={user!} />;
      case "departments": return <DepartmentsPage />;
      case "shifts": return <ShiftPlanningPage user={user!} />;
      case "attendance": return <AttendancePage user={user!} />;
      case "leave": return <LeavePage user={user!} />;
      case "overtime": return <OvertimePage />;
      case "payroll": return <PayrollPage user={user!} />;
      case "fatigue": return <FatigueCenterPage />;
      case "compliance": return <CompliancePage />;
      case "reports": return <ReportsPage />;
      case "audit": return <AuditLogsPage />;
      case "roles": return <RolesPage />;
      case "analytics": return <AnalyticsPage />;
      case "notifications": return <NotificationsPage notifications={notifications} setNotifications={setNotifications} />;
      case "settings": return <SettingsPage user={user!} />;
      case "support": return <SupportPage />;
      case "wellness": return <PlaceholderPage title="Wellness Center" icon={Heart} />;
      case "performance": return <PlaceholderPage title="Performance Management" icon={TrendingUp} />;
      case "training": return <PlaceholderPage title="Training & Development" icon={Award} />;
      case "projects": return <PlaceholderPage title="Projects & Tasks" icon={FolderOpen} />;
      case "organization": return <PlaceholderPage title="Organization Management" icon={Globe} />;
      case "integrations": return <PlaceholderPage title="Integrations" icon={Layers} />;
      case "calendar": return <PlaceholderPage title="Calendar" icon={Calendar} />;
      default: return <DashboardPage user={user!} setPage={setCurrentPage} />;
    }
  }

  return (
    <div className="h-screen flex bg-background text-foreground overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Sidebar currentPage={currentPage} setPage={setCurrentPage} user={user} collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar user={user} setPage={setCurrentPage} onLogout={() => { setUser(null); setCurrentPage("dashboard"); }}
          onCmdK={() => setShowCmdPalette(true)} onAI={() => setShowAI(a => !a)} notifications={notifications} />
        <main className="flex-1 overflow-y-auto">{renderPage()}</main>
      </div>
      {showAI && <AICopilot onClose={() => setShowAI(false)} />}
      {showCmdPalette && <CommandPalette onClose={() => setShowCmdPalette(false)} setPage={setCurrentPage} />}
    </div>
  );
}
