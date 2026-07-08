/**
 * WorkSphere AI — Global App State Store
 *
 * All mutable data lives here as React state via Context.
 * Seed data (12 employees, 60 shifts, 5 leave requests) is pre-loaded
 * so the app shows realistic data immediately on launch.
 */
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Employee, Shift, LeaveRequest, Notification, AuditLog } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RBACRole {
  id: string;
  name: string;
  color: string;
  userCount: number;
  permissions: string[];
}

export interface OrgSettings {
  orgName: string;
  industry: string;
  headquarters: string;
  timezone: string;
  aiMonitoring: boolean;
  autoShiftOptimize: boolean;
  overtimeAlerts: boolean;
  complianceReports: boolean;
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

const SEED_EMPLOYEES: Employee[] = [
  // Engineering (3)
  { id: "e001", employeeId: "WS001", name: "Arjun Mehta",       role: "Senior Engineer",       dept: "Engineering",     email: "arjun.mehta@worksphere.io",    phone: "+1 (555) 101-2001", status: "active",   joinDate: "2021-03-15", shift: "Day",     fatigue: 28, wellness: 82, performance: 91, attendance: 96, salary: 95000,  location: "New York",      avatar: "AM", manager: "Priya Nair",      shifts: 22 },
  { id: "e002", employeeId: "WS002", name: "Lucas Ferreira",    role: "Frontend Developer",    dept: "Engineering",     email: "lucas.ferreira@worksphere.io", phone: "+1 (555) 101-2002", status: "active",   joinDate: "2022-07-01", shift: "Morning", fatigue: 42, wellness: 74, performance: 85, attendance: 93, salary: 78000,  location: "Austin",        avatar: "LF", manager: "Arjun Mehta",     shifts: 20 },
  { id: "e003", employeeId: "WS003", name: "Sofia Andersen",    role: "Backend Developer",     dept: "Engineering",     email: "sofia.andersen@worksphere.io", phone: "+1 (555) 101-2003", status: "remote",   joinDate: "2022-01-10", shift: "Day",     fatigue: 35, wellness: 78, performance: 88, attendance: 91, salary: 82000,  location: "Remote",        avatar: "SA", manager: "Arjun Mehta",     shifts: 19 },
  // Human Resources (2)
  { id: "e004", employeeId: "WS004", name: "Priya Nair",        role: "HR Manager",            dept: "Human Resources", email: "priya.nair@worksphere.io",     phone: "+1 (555) 101-2004", status: "active",   joinDate: "2020-05-20", shift: "Day",     fatigue: 20, wellness: 90, performance: 94, attendance: 98, salary: 88000,  location: "New York",      avatar: "PN", manager: "CEO",             shifts: 23 },
  { id: "e005", employeeId: "WS005", name: "Marcus Thompson",   role: "HR Specialist",         dept: "Human Resources", email: "marcus.t@worksphere.io",        phone: "+1 (555) 101-2005", status: "on-leave", joinDate: "2023-02-14", shift: "Morning", fatigue: 15, wellness: 88, performance: 79, attendance: 89, salary: 62000,  location: "Chicago",       avatar: "MT", manager: "Priya Nair",      shifts: 17 },
  // Operations (3)
  { id: "e006", employeeId: "WS006", name: "Chen Wei",          role: "Operations Manager",    dept: "Operations",      email: "chen.wei@worksphere.io",        phone: "+1 (555) 101-2006", status: "active",   joinDate: "2019-11-03", shift: "Day",     fatigue: 50, wellness: 65, performance: 87, attendance: 94, salary: 91000,  location: "San Francisco", avatar: "CW", manager: "CEO",             shifts: 24 },
  { id: "e007", employeeId: "WS007", name: "Amara Osei",        role: "Logistics Coordinator", dept: "Operations",      email: "amara.osei@worksphere.io",      phone: "+1 (555) 101-2007", status: "active",   joinDate: "2021-08-22", shift: "Evening", fatigue: 62, wellness: 60, performance: 80, attendance: 88, salary: 68000,  location: "Houston",       avatar: "AO", manager: "Chen Wei",        shifts: 21 },
  { id: "e008", employeeId: "WS008", name: "Rina Kobayashi",    role: "Supply Chain Analyst",  dept: "Operations",      email: "rina.k@worksphere.io",          phone: "+1 (555) 101-2008", status: "at-risk",  joinDate: "2022-04-18", shift: "Night",   fatigue: 78, wellness: 45, performance: 72, attendance: 82, salary: 71000,  location: "Seattle",       avatar: "RK", manager: "Chen Wei",        shifts: 18 },
  // Finance (2)
  { id: "e009", employeeId: "WS009", name: "David Okonkwo",     role: "Finance Manager",       dept: "Finance",         email: "david.o@worksphere.io",         phone: "+1 (555) 101-2009", status: "active",   joinDate: "2020-09-07", shift: "Day",     fatigue: 22, wellness: 85, performance: 96, attendance: 97, salary: 105000, location: "New York",      avatar: "DO", manager: "CEO",             shifts: 22 },
  { id: "e010", employeeId: "WS010", name: "Isabelle Dupont",   role: "Financial Analyst",     dept: "Finance",         email: "isabelle.d@worksphere.io",      phone: "+1 (555) 101-2010", status: "active",   joinDate: "2023-06-12", shift: "Morning", fatigue: 31, wellness: 80, performance: 83, attendance: 95, salary: 74000,  location: "Boston",        avatar: "ID", manager: "David Okonkwo",   shifts: 20 },
  // Marketing (2)
  { id: "e011", employeeId: "WS011", name: "James Okafor",      role: "Marketing Lead",        dept: "Marketing",       email: "james.okafor@worksphere.io",    phone: "+1 (555) 101-2011", status: "active",   joinDate: "2021-12-01", shift: "Day",     fatigue: 38, wellness: 76, performance: 89, attendance: 93, salary: 80000,  location: "Los Angeles",   avatar: "JO", manager: "CEO",             shifts: 21 },
  { id: "e012", employeeId: "WS012", name: "Yuki Tanaka",       role: "Content Strategist",    dept: "Marketing",       email: "yuki.tanaka@worksphere.io",     phone: "+1 (555) 101-2012", status: "active",   joinDate: "2022-10-30", shift: "Morning", fatigue: 29, wellness: 83, performance: 86, attendance: 94, salary: 65000,  location: "Los Angeles",   avatar: "YT", manager: "James Okafor",    shifts: 19 },
];

// Build shifts for the current Mon–Fri week — one shift per employee per day
function buildSeedShifts(): Shift[] {
  const shiftTypeMap: Array<"morning" | "day" | "evening" | "night"> =
    ["morning", "day", "day", "evening", "night", "day", "morning", "night", "day", "morning", "day", "morning"];
  const hours: Record<string, { start: string; end: string }> = {
    morning: { start: "06:00", end: "14:00" },
    day:     { start: "09:00", end: "17:00" },
    evening: { start: "14:00", end: "22:00" },
    night:   { start: "22:00", end: "06:00" },
  };
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;

  // Get Mon of current week
  const today = new Date();
  const dow = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dow === 0 ? 6 : dow - 1));

  const shifts: Shift[] = [];
  SEED_EMPLOYEES.forEach((emp, i) => {
    const t = shiftTypeMap[i % shiftTypeMap.length];
    dayLabels.forEach((label, di) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + di);
      shifts.push({
        id:         `ss_${emp.id}_${di}`,
        employee:   emp.name,
        employeeId: emp.id,
        day:        label,
        date:       d.toISOString().slice(0, 10),
        start:      hours[t].start,
        end:        hours[t].end,
        type:       t,
        dept:       emp.dept,
        status:     "confirmed",
        conflict:   false,
      });
    });
  });
  return shifts;
}

const SEED_SHIFTS: Shift[] = buildSeedShifts();

const SEED_LEAVE: LeaveRequest[] = [
  { id: 1001, employee: "Marcus Thompson",  employeeId: "e005", type: "Annual Leave",   start: "2026-07-07", end: "2026-07-11", days: 5, reason: "Family vacation",      status: "approved", appliedOn: "2026-06-25", managerId: "e004", dept: "Human Resources" },
  { id: 1002, employee: "Rina Kobayashi",   employeeId: "e008", type: "Sick Leave",     start: "2026-07-09", end: "2026-07-10", days: 2, reason: "Medical appointment",  status: "pending",  appliedOn: "2026-07-06", managerId: "e006", dept: "Operations" },
  { id: 1003, employee: "Amara Osei",       employeeId: "e007", type: "Personal Leave", start: "2026-07-14", end: "2026-07-14", days: 1, reason: "Personal errand",      status: "pending",  appliedOn: "2026-07-05", managerId: "e006", dept: "Operations" },
  { id: 1004, employee: "Lucas Ferreira",   employeeId: "e002", type: "Annual Leave",   start: "2026-07-21", end: "2026-07-25", days: 5, reason: "Summer break",         status: "pending",  appliedOn: "2026-07-01", managerId: "e001", dept: "Engineering" },
  { id: 1005, employee: "Isabelle Dupont",  employeeId: "e010", type: "Sick Leave",     start: "2026-07-03", end: "2026-07-04", days: 2, reason: "Flu recovery",         status: "approved", appliedOn: "2026-07-02", managerId: "e009", dept: "Finance" },
];

const SEED_NOTIFICATIONS: Notification[] = [
  { id: "n001", title: "Leave Approved",        message: "Marcus Thompson's Annual Leave was approved",    type: "success", time: "2 days ago",  read: false, priority: "low"    },
  { id: "n002", title: "New Leave Request",      message: "Rina Kobayashi applied for Sick Leave",         type: "info",    time: "1 day ago",   read: false, priority: "medium" },
  { id: "n003", title: "Fatigue Alert",          message: "Rina Kobayashi fatigue score reached 78%",      type: "warning", time: "3 hours ago", read: false, priority: "high"   },
  { id: "n004", title: "Shift Conflict Detected",message: "Amara Osei has overlapping shifts on Thursday", type: "alert",   time: "1 hour ago",  read: false, priority: "high"   },
  { id: "n005", title: "Leave Approved",         message: "Isabelle Dupont's Sick Leave was approved",     type: "success", time: "5 days ago",  read: true,  priority: "low"    },
];

const SEED_AUDIT: AuditLog[] = [
  { id: "a001", user: "Priya Nair",    action: "Approved Leave",       target: "Marcus Thompson - Annual Leave", type: "approval", time: "07/07/2026 09:15", ip: "192.168.1.10" },
  { id: "a002", user: "Priya Nair",    action: "Added Employee",       target: "Yuki Tanaka",                    type: "update",   time: "30/06/2026 14:22", ip: "192.168.1.10" },
  { id: "a003", user: "Chen Wei",      action: "Created Shift",        target: "Amara Osei - Thursday",          type: "update",   time: "06/07/2026 11:05", ip: "192.168.1.22" },
  { id: "a004", user: "David Okonkwo", action: "Approved Leave",       target: "Isabelle Dupont - Sick Leave",   type: "approval", time: "02/07/2026 08:47", ip: "192.168.1.31" },
  { id: "a005", user: "System",        action: "AI Fatigue Alert",     target: "Rina Kobayashi",                 type: "ai",       time: "07/07/2026 07:00", ip: "system" },
  { id: "a006", user: "Arjun Mehta",   action: "Updated Employee",     target: "Lucas Ferreira",                 type: "update",   time: "05/07/2026 16:33", ip: "192.168.1.14" },
];

// ─── Default state ────────────────────────────────────────────────────────────

const DEFAULT_ROLES: RBACRole[] = [
  { id: "r1", name: "Super Admin",        color: "violet",  userCount: 1, permissions: ["View all employees","Edit employee records","Approve leave","Approve overtime","View analytics","Export reports","Edit shifts","Create shifts","RBAC management","System settings","View own profile","Submit leave"] },
  { id: "r2", name: "HR Manager",         color: "indigo",  userCount: 1, permissions: ["View all employees","Edit employee records","Approve leave","View analytics","Export reports","View own profile","Submit leave"] },
  { id: "r3", name: "Operations Manager", color: "sky",     userCount: 1, permissions: ["View all employees","Approve overtime","View analytics","Edit shifts","Create shifts","View own profile","Submit leave"] },
  { id: "r4", name: "Supervisor",         color: "emerald", userCount: 3, permissions: ["View all employees","View analytics","View own profile","Submit leave"] },
  { id: "r5", name: "Employee",           color: "amber",   userCount: 6, permissions: ["View own profile","Submit leave"] },
];

const DEFAULT_ORG: OrgSettings = {
  orgName: "WorkSphere AI",
  industry: "Technology",
  headquarters: "New York, NY",
  timezone: "UTC-05:00",
  aiMonitoring: true,
  autoShiftOptimize: false,
  overtimeAlerts: true,
  complianceReports: false,
};

// ─── Context ──────────────────────────────────────────────────────────────────

interface StoreContextValue {
  employees:    Employee[];
  addEmployee:  (e: Omit<Employee, "id" | "employeeId">) => void;
  editEmployee: (id: string, patch: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  shifts:       Shift[];
  addShift:     (s: Omit<Shift, "id">) => void;
  editShift:    (id: string, patch: Partial<Shift>) => void;
  deleteShift:  (id: string) => void;
  resolveConflict: (id: string) => void;

  leaveRequests:    LeaveRequest[];
  addLeaveRequest:  (r: Omit<LeaveRequest, "id" | "appliedOn" | "status">) => void;
  approveLeave:     (id: number) => void;
  rejectLeave:      (id: number) => void;
  deleteLeave:      (id: number) => void;

  notifications:       Notification[];
  addNotification:     (n: Omit<Notification, "id" | "read" | "time">) => void;
  markNotifRead:       (id: string) => void;
  markAllNotifsRead:   () => void;
  deleteNotification:  (id: string) => void;

  auditLogs:   AuditLog[];
  addAuditLog: (log: Omit<AuditLog, "id" | "time">) => void;

  roles:      RBACRole[];
  addRole:    (r: Omit<RBACRole, "id">) => void;
  editRole:   (id: string, patch: Partial<RBACRole>) => void;
  deleteRole: (id: string) => void;

  org:       OrgSettings;
  saveOrg:   (patch: Partial<OrgSettings>) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

// ─── Utility ──────────────────────────────────────────────────────────────────

let _seq = 100; // start above seed IDs
function uid(prefix = "x") { return `${prefix}${Date.now()}${_seq++}`; }

function now() {
  return new Date()
    .toLocaleString("en-GB", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false })
    .replace(",", "");
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function StoreProvider({ children }: { children: ReactNode }) {
  const [employees,     setEmployees]     = useState<Employee[]>(SEED_EMPLOYEES);
  const [shifts,        setShifts]        = useState<Shift[]>(SEED_SHIFTS);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(SEED_LEAVE);
  const [notifications, setNotifications] = useState<Notification[]>(SEED_NOTIFICATIONS);
  const [auditLogs,     setAuditLogs]     = useState<AuditLog[]>(SEED_AUDIT);
  const [roles,         setRoles]         = useState<RBACRole[]>(DEFAULT_ROLES);
  const [org,           setOrg]           = useState<OrgSettings>(DEFAULT_ORG);

  // ── Employees ──────────────────────────────────────────────────────────────
  const addEmployee = useCallback((e: Omit<Employee, "id" | "employeeId">) => {
    const id   = uid("e");
    const code = `WS${String(_seq).padStart(3, "0")}`;
    setEmployees(prev => [...prev, { ...e, id, employeeId: code }]);
    addAuditLog({ user: "You", action: "Added Employee", target: e.name, type: "update", ip: "local" });
  }, []);

  const editEmployee = useCallback((id: string, patch: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...patch } : e));
    addAuditLog({ user: "You", action: "Updated Employee", target: id, type: "update", ip: "local" });
  }, []);

  const deleteEmployee = useCallback((id: string) => {
    setEmployees(prev => {
      const emp = prev.find(e => e.id === id);
      addAuditLog({ user: "You", action: "Deleted Employee", target: emp?.name ?? id, type: "security", ip: "local" });
      return prev.filter(e => e.id !== id);
    });
  }, []);

  // ── Shifts ─────────────────────────────────────────────────────────────────
  const addShift = useCallback((s: Omit<Shift, "id">) => {
    setShifts(prev => {
      const conflict = prev.some(x => x.employeeId === s.employeeId && x.day === s.day);
      return [...prev, { ...s, id: uid("s"), conflict }];
    });
  }, []);

  const editShift = useCallback((id: string, patch: Partial<Shift>) => {
    setShifts(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s));
  }, []);

  const deleteShift = useCallback((id: string) => {
    setShifts(prev => prev.filter(s => s.id !== id));
  }, []);

  const resolveConflict = useCallback((id: string) => {
    setShifts(prev => prev.map(s => s.id === id ? { ...s, conflict: false, status: "confirmed" } : s));
  }, []);

  // ── Leave Requests ─────────────────────────────────────────────────────────
  const addLeaveRequest = useCallback((r: Omit<LeaveRequest, "id" | "appliedOn" | "status">) => {
    const id = _seq++;
    setLeaveRequests(prev => [...prev, { ...r, id, status: "pending", appliedOn: new Date().toISOString().slice(0, 10) }]);
    addNotification({ title: "New Leave Request", message: `${r.employee} applied for ${r.type}`, type: "info", priority: "medium" });
  }, []);

  const approveLeave = useCallback((id: number) => {
    setLeaveRequests(prev => {
      const req = prev.find(r => r.id === id);
      addAuditLog({ user: "You", action: "Approved Leave", target: `${req?.employee} - ${req?.type}`, type: "approval", ip: "local" });
      addNotification({ title: "Leave Approved", message: `${req?.employee}'s ${req?.type} was approved`, type: "success", priority: "low" });
      return prev.map(r => r.id === id ? { ...r, status: "approved" } : r);
    });
  }, []);

  const rejectLeave = useCallback((id: number) => {
    setLeaveRequests(prev => {
      const req = prev.find(r => r.id === id);
      addAuditLog({ user: "You", action: "Rejected Leave", target: `${req?.employee} - ${req?.type}`, type: "approval", ip: "local" });
      return prev.map(r => r.id === id ? { ...r, status: "rejected" } : r);
    });
  }, []);

  const deleteLeave = useCallback((id: number) => {
    setLeaveRequests(prev => prev.filter(r => r.id !== id));
  }, []);

  // ── Notifications ──────────────────────────────────────────────────────────
  const addNotification = useCallback((n: Omit<Notification, "id" | "read" | "time">) => {
    setNotifications(prev => [{ ...n, id: uid("n"), read: false, time: "Just now" }, ...prev]);
  }, []);

  const markNotifRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotifsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  // ── Audit Logs ─────────────────────────────────────────────────────────────
  const addAuditLog = useCallback((log: Omit<AuditLog, "id" | "time">) => {
    setAuditLogs(prev => [{ ...log, id: uid("a"), time: now() }, ...prev]);
  }, []);

  // ── RBAC ───────────────────────────────────────────────────────────────────
  const addRole = useCallback((r: Omit<RBACRole, "id">) => {
    setRoles(prev => [...prev, { ...r, id: uid("r") }]);
  }, []);

  const editRole = useCallback((id: string, patch: Partial<RBACRole>) => {
    setRoles(prev => prev.map(r => r.id === id ? { ...r, ...patch } : r));
  }, []);

  const deleteRole = useCallback((id: string) => {
    setRoles(prev => prev.filter(r => r.id !== id));
  }, []);

  // ── Org Settings ───────────────────────────────────────────────────────────
  const saveOrg = useCallback((patch: Partial<OrgSettings>) => {
    setOrg(prev => ({ ...prev, ...patch }));
    addAuditLog({ user: "You", action: "Updated Organization Settings", target: "Organization", type: "update", ip: "local" });
  }, []);

  return (
    <StoreContext.Provider value={{
      employees, addEmployee, editEmployee, deleteEmployee,
      shifts, addShift, editShift, deleteShift, resolveConflict,
      leaveRequests, addLeaveRequest, approveLeave, rejectLeave, deleteLeave,
      notifications, addNotification, markNotifRead, markAllNotifsRead, deleteNotification,
      auditLogs, addAuditLog,
      roles, addRole, editRole, deleteRole,
      org, saveOrg,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within <StoreProvider>");
  return ctx;
}
