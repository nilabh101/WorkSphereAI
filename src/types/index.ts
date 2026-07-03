// ─── SHARED TYPES FOR WORKSPHERE AI ──────────────────────────────────────────

export type Role = "superadmin" | "hr_manager" | "dept_manager" | "employee";

export type Page =
  | "login" | "dashboard" | "employees" | "departments" | "shifts"
  | "calendar" | "attendance" | "leave" | "payroll" | "overtime"
  | "fatigue" | "wellness" | "performance" | "training" | "projects"
  | "compliance" | "reports" | "analytics" | "notifications" | "audit"
  | "roles" | "organization" | "integrations" | "settings" | "support"
  | "ai-insights" | "heatmap" | "rbac";

export interface AuthUser {
  id: string;
  name: string;
  role: Role;
  dept: string;
  avatar: string;
  employeeId: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  dept: string;
  email: string;
  phone: string;
  status: "active" | "on-leave" | "absent" | "remote" | "at-risk";
  joinDate: string;
  shift: string;
  fatigue: number;
  wellness: number;
  performance: number;
  attendance: number;
  salary: number;
  location: string;
  avatar: string;
  manager: string;
  employeeId: string;
  shifts: number;
}

export interface Shift {
  id: string;
  employee: string;
  employeeId: string;
  day: string;
  date: string;
  start: string;
  end: string;
  type: "morning" | "day" | "evening" | "night";
  dept: string;
  status: "confirmed" | "pending" | "conflict";
  conflict?: boolean;
}

export interface LeaveRequest {
  id: number;
  employee: string;
  employeeId: string;
  type: string;
  start: string;
  end: string;
  days: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  appliedOn: string;
  managerId: string;
  dept: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success" | "ai" | "alert";
  time: string;
  read: boolean;
  priority: "low" | "medium" | "high";
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  target: string;
  type: "approval" | "ai" | "update" | "security" | "export" | "request" | "acknowledgment" | "login";
  time: string;
  ip: string;
}

export interface AIInsight {
  id: string;
  employee: string;
  avatar: string;
  riskLevel: "low" | "medium" | "high";
  riskPct: number;
  factors: string[];
  recommendation: string;
  replacements: string[];
  confidence: number;
}

export interface HeatmapRow {
  team: string;
  Mon: number;
  Tue: number;
  Wed: number;
  Thu: number;
  Fri: number;
  Sat: number;
  Sun: number;
}

export type BadgeVariant =
  | "default" | "success" | "warning" | "danger"
  | "info" | "indigo" | "ai";

export interface KpiCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  change?: number;
  positive?: boolean;
  color?: "indigo" | "emerald" | "amber" | "rose" | "sky" | "violet";
  sub?: string;
}
