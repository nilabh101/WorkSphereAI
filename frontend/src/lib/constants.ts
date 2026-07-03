export const ROLES = {
  SUPER_ADMIN: "super_admin",
  HR_MANAGER: "hr_manager",
  OPS_MANAGER: "ops_manager",
  SUPERVISOR: "supervisor",
  EMPLOYEE: "employee",
  AUDITOR: "auditor",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  hr_manager: "HR Manager",
  ops_manager: "Operations Manager",
  supervisor: "Supervisor",
  employee: "Employee",
  auditor: "Auditor",
};

export const ROLE_COLORS: Record<UserRole, string> = {
  super_admin: "text-violet-600 bg-violet-50 dark:bg-violet-950/40",
  hr_manager: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40",
  ops_manager: "text-sky-600 bg-sky-50 dark:bg-sky-950/40",
  supervisor: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40",
  employee: "text-amber-600 bg-amber-50 dark:bg-amber-950/40",
  auditor: "text-slate-600 bg-slate-50 dark:bg-slate-800",
};

export const FATIGUE_THRESHOLDS = {
  LOW: 40,
  MODERATE: 65,
  HIGH: 80,
  CRITICAL: 90,
};

export const SHIFT_TYPES = {
  MORNING: "morning",
  DAY: "day",
  EVENING: "evening",
  NIGHT: "night",
} as const;

export const SHIFT_COLORS: Record<string, string> = {
  morning: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
  day: "bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-950/40 dark:text-sky-300",
  evening: "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300",
  night: "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300",
};

export const LEAVE_TYPES = [
  "Annual Leave",
  "Sick Leave",
  "Maternity Leave",
  "Paternity Leave",
  "Compassionate Leave",
  "Emergency Leave",
  "Study Leave",
  "Unpaid Leave",
] as const;

export const LEAVE_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  CANCELLED: "cancelled",
} as const;

export const COMPLIANCE_RULES = [
  "Maximum 48 hours per week (EU Working Time Directive)",
  "Minimum 11 hours rest between shifts",
  "Maximum 6 consecutive working days",
  "Minimum 20 days annual leave",
  "Night shift limit: 8 hours average per 24h period",
];

export const DEPARTMENTS = [
  "Engineering",
  "Human Resources",
  "Operations",
  "Finance",
  "Legal",
  "ICU",
  "Logistics",
  "Sales",
  "Marketing",
  "Product",
];

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/analytics", label: "Analytics", icon: "BarChart2" },
  { href: "/shifts", label: "Shift Planner", icon: "Calendar" },
  { href: "/employees", label: "Employees", icon: "Users" },
  { href: "/ai-insights", label: "AI Insights", icon: "Brain", badge: "AI" },
  { href: "/leave", label: "Leave & OT", icon: "ClipboardList" },
  { href: "/heatmap", label: "Workforce Heatmap", icon: "Map" },
  { href: "/notifications", label: "Notifications", icon: "Bell" },
  { href: "/audit", label: "Audit Logs", icon: "FileText" },
  { href: "/settings", label: "Settings", icon: "Settings" },
  { href: "/rbac", label: "RBAC & Permissions", icon: "Shield" },
];

export const CHART_COLORS = {
  indigo: "#4F46E5",
  violet: "#7C3AED",
  sky: "#0EA5E9",
  emerald: "#10B981",
  amber: "#F59E0B",
  rose: "#F43F5E",
  slate: "#64748B",
};

export const PAGINATION_DEFAULT = 20;
