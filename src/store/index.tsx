/**
 * WorkSphere AI — Global App State Store
 *
 * All mutable data (employees, shifts, leave, notifications, etc.) lives here
 * as React state via Context. Every screen reads from and writes to this store
 * so mutations persist across navigation within a session.
 *
 * No pre-populated entries — everything starts empty so the user adds their own.
 * Chart / analytics data is derived from real state rather than hardcoded.
 */
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Employee, Shift, LeaveRequest, Notification, AuditLog } from "@/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RBACRole {
  id: string;
  name: string;
  color: string;               // tailwind dot colour key
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

// ─── Default empty/seed state ─────────────────────────────────────────────────

const DEFAULT_ROLES: RBACRole[] = [
  { id: "r1", name: "Super Admin",        color: "violet",  userCount: 0, permissions: ["View all employees","Edit employee records","Approve leave","Approve overtime","View analytics","Export reports","Edit shifts","Create shifts","RBAC management","System settings","View own profile","Submit leave"] },
  { id: "r2", name: "HR Manager",         color: "indigo",  userCount: 0, permissions: ["View all employees","Edit employee records","Approve leave","View analytics","Export reports","View own profile","Submit leave"] },
  { id: "r3", name: "Operations Manager", color: "sky",     userCount: 0, permissions: ["View all employees","Approve overtime","View analytics","Edit shifts","Create shifts","View own profile","Submit leave"] },
  { id: "r4", name: "Supervisor",         color: "emerald", userCount: 0, permissions: ["View all employees","View analytics","View own profile","Submit leave"] },
  { id: "r5", name: "Employee",           color: "amber",   userCount: 0, permissions: ["View own profile","Submit leave"] },
];

const DEFAULT_ORG: OrgSettings = {
  orgName: "",
  industry: "",
  headquarters: "",
  timezone: "UTC+00:00",
  aiMonitoring: true,
  autoShiftOptimize: false,
  overtimeAlerts: true,
  complianceReports: false,
};

// ─── Context ──────────────────────────────────────────────────────────────────

interface StoreContextValue {
  // Employees
  employees:    Employee[];
  addEmployee:  (e: Omit<Employee, "id" | "employeeId">) => void;
  editEmployee: (id: string, patch: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;

  // Shifts
  shifts:       Shift[];
  addShift:     (s: Omit<Shift, "id">) => void;
  editShift:    (id: string, patch: Partial<Shift>) => void;
  deleteShift:  (id: string) => void;
  resolveConflict: (id: string) => void;

  // Leave Requests
  leaveRequests:    LeaveRequest[];
  addLeaveRequest:  (r: Omit<LeaveRequest, "id" | "appliedOn" | "status">) => void;
  approveLeave:     (id: number) => void;
  rejectLeave:      (id: number) => void;
  deleteLeave:      (id: number) => void;

  // Notifications
  notifications:       Notification[];
  addNotification:     (n: Omit<Notification, "id" | "read" | "time">) => void;
  markNotifRead:       (id: string) => void;
  markAllNotifsRead:   () => void;
  deleteNotification:  (id: string) => void;

  // Audit Logs
  auditLogs:   AuditLog[];
  addAuditLog: (log: Omit<AuditLog, "id" | "time">) => void;

  // RBAC
  roles:      RBACRole[];
  addRole:    (r: Omit<RBACRole, "id">) => void;
  editRole:   (id: string, patch: Partial<RBACRole>) => void;
  deleteRole: (id: string) => void;

  // Org settings
  org:       OrgSettings;
  saveOrg:   (patch: Partial<OrgSettings>) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

// ─── Utility ──────────────────────────────────────────────────────────────────

let _seq = 1;
function uid(prefix = "x") { return `${prefix}${Date.now()}${_seq++}`; }

function now() {
  return new Date().toLocaleString("en-GB", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false }).replace(",", "");
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function StoreProvider({ children }: { children: ReactNode }) {
  const [employees,     setEmployees]     = useState<Employee[]>([]);
  const [shifts,        setShifts]        = useState<Shift[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [auditLogs,     setAuditLogs]     = useState<AuditLog[]>([]);
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
    const emp = employees.find(e => e.id === id);
    setEmployees(prev => prev.filter(e => e.id !== id));
    addAuditLog({ user: "You", action: "Deleted Employee", target: emp?.name ?? id, type: "security", ip: "local" });
  }, [employees]);

  // ── Shifts ─────────────────────────────────────────────────────────────────
  const addShift = useCallback((s: Omit<Shift, "id">) => {
    // Conflict detection: same employee, same day
    const conflict = shifts.some(x => x.employeeId === s.employeeId && x.day === s.day);
    setShifts(prev => [...prev, { ...s, id: uid("s"), conflict }]);
  }, [shifts]);

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
    const req = leaveRequests.find(r => r.id === id);
    setLeaveRequests(prev => prev.map(r => r.id === id ? { ...r, status: "approved" } : r));
    addAuditLog({ user: "You", action: "Approved Leave", target: `${req?.employee} - ${req?.type}`, type: "approval", ip: "local" });
    addNotification({ title: "Leave Approved", message: `${req?.employee}'s ${req?.type} was approved`, type: "success", priority: "low" });
  }, [leaveRequests]);

  const rejectLeave = useCallback((id: number) => {
    const req = leaveRequests.find(r => r.id === id);
    setLeaveRequests(prev => prev.map(r => r.id === id ? { ...r, status: "rejected" } : r));
    addAuditLog({ user: "You", action: "Rejected Leave", target: `${req?.employee} - ${req?.type}`, type: "approval", ip: "local" });
  }, [leaveRequests]);

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
