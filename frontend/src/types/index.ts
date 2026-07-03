export type UserRole =
  | "super_admin"
  | "hr_manager"
  | "ops_manager"
  | "supervisor"
  | "employee"
  | "auditor";

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  department?: string;
  employee_id?: number;
  is_active: boolean;
  created_at: string;
}

export interface Employee {
  id: number;
  user_id: number;
  employee_code: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone?: string;
  department_id: number;
  department_name: string;
  job_title: string;
  role: UserRole;
  status: "active" | "inactive" | "on_leave" | "at-risk";
  hire_date: string;
  avatar_url?: string;
  fatigue_score: number;
  wellness_score: number;
  attendance_rate: number;
  shifts_this_month: number;
  weekly_hours: number;
  overtime_hours: number;
  leave_balance: number;
  skills: string[];
  manager_id?: number;
  manager_name?: string;
  created_at: string;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  head_id?: number;
  head_name?: string;
  employee_count: number;
  required_staffing: number;
  actual_staffing: number;
  coverage_pct: number;
  avg_fatigue: number;
  created_at: string;
}

export interface Shift {
  id: number;
  employee_id: number;
  employee_name: string;
  department_id: number;
  department_name: string;
  date: string;
  start_time: string;
  end_time: string;
  shift_type: "morning" | "day" | "evening" | "night";
  hours: number;
  status: "scheduled" | "completed" | "cancelled" | "swapped";
  has_conflict: boolean;
  conflict_reason?: string;
  notes?: string;
  created_at: string;
}

export interface LeaveRequest {
  id: number;
  employee_id: number;
  employee_name: string;
  department_name: string;
  leave_type: string;
  start_date: string;
  end_date: string;
  days: number;
  status: "pending" | "approved" | "rejected" | "cancelled";
  reason: string;
  approver_id?: number;
  approver_name?: string;
  approved_at?: string;
  notes?: string;
  created_at: string;
}

export interface OvertimeRequest {
  id: number;
  employee_id: number;
  employee_name: string;
  department_name: string;
  date: string;
  hours: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  approver_name?: string;
  created_at: string;
}

export interface FatigueScore {
  id: number;
  employee_id: number;
  employee_name: string;
  score: number;
  risk_level: "low" | "moderate" | "high" | "critical";
  weekly_hours: number;
  consecutive_shifts: number;
  night_shifts: number;
  overtime_hours: number;
  rest_gap_hours: number;
  factors: string[];
  recommendation: string;
  calculated_at: string;
}

export interface AIInsight {
  id: number;
  employee_id: number;
  employee_name: string;
  risk_level: "low" | "medium" | "high" | "critical";
  risk_pct: number;
  factors: string[];
  recommendation: string;
  replacements: string[];
  confidence: number;
  generated_at: string;
}

export interface Notification {
  id: number;
  type: "alert" | "info" | "success" | "warning";
  title: string;
  message: string;
  is_read: boolean;
  action_url?: string;
  created_at: string;
}

export interface AuditLog {
  id: number;
  user_id: number;
  user_name: string;
  action: string;
  resource_type: string;
  resource_id?: number;
  target: string;
  details?: Record<string, unknown>;
  ip_address?: string;
  log_type: "approval" | "ai" | "update" | "security" | "export" | "request" | "acknowledgment" | "login";
  created_at: string;
}

export interface DashboardStats {
  total_employees: number;
  active_employees: number;
  high_fatigue_count: number;
  compliance_score: number;
  shift_coverage: number;
  pending_leaves: number;
  pending_overtime: number;
  avg_attendance: number;
  open_shifts: number;
  burnout_risk_count: number;
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

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  confidence?: number;
}

export interface Permission {
  id: number;
  name: string;
  resource: string;
  action: string;
  description: string;
}

export interface Role {
  id: number;
  name: UserRole;
  label: string;
  description: string;
  user_count: number;
  permissions: Permission[];
  color: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  total?: number;
  page?: number;
  size?: number;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}
