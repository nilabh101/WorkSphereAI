// ─── WORKSPHERE AI — MOCK DATA LAYER ─────────────────────────────────────────
// Central data file used by all feature screens.
// Replace individual exports with API calls as backend comes online.

import type {
  Employee, Shift, LeaveRequest, Notification, AuditLog, AIInsight, HeatmapRow,
} from "@/types";

// ─── EMPLOYEES ────────────────────────────────────────────────────────────────
export const employees: Employee[] = [
  { id: "e1", name: "Arjun Sharma", role: "CTO", dept: "Executive", email: "arjun.s@worksphere.ai", phone: "+91-98765-43210", status: "active", joinDate: "2019-03-15", shift: "Morning", fatigue: 18, wellness: 92, performance: 97, attendance: 99, salary: 280000, location: "New Delhi HQ", avatar: "AS", manager: "Board", employeeId: "WS001", shifts: 20 },
  { id: "e2", name: "Priya Nair", role: "HR Director", dept: "Human Resources", email: "priya.n@worksphere.ai", phone: "+91-97654-32109", status: "active", joinDate: "2020-01-10", shift: "Morning", fatigue: 42, wellness: 78, performance: 91, attendance: 97, salary: 185000, location: "Bangalore", avatar: "PN", manager: "Arjun Sharma", employeeId: "WS002", shifts: 18 },
  { id: "e3", name: "Rajesh Kumar", role: "Engineering Lead", dept: "Engineering", email: "rajesh.k@worksphere.ai", phone: "+91-96543-21098", status: "active", joinDate: "2020-07-22", shift: "Morning", fatigue: 65, wellness: 61, performance: 88, attendance: 94, salary: 210000, location: "Bangalore", avatar: "RK", manager: "Arjun Sharma", employeeId: "WS003", shifts: 21 },
  { id: "e4", name: "Meera Patel", role: "Senior Engineer", dept: "Engineering", email: "meera.p@worksphere.ai", phone: "+91-95432-10987", status: "active", joinDate: "2021-02-01", shift: "Morning", fatigue: 38, wellness: 84, performance: 93, attendance: 96, salary: 145000, location: "Bangalore", avatar: "MP", manager: "Rajesh Kumar", employeeId: "WS042", shifts: 19 },
  { id: "e5", name: "Vikram Singh", role: "Operations Head", dept: "Operations", email: "vikram.s@worksphere.ai", phone: "+91-94321-09876", status: "active", joinDate: "2019-11-05", shift: "Rotational", fatigue: 72, wellness: 55, performance: 85, attendance: 91, salary: 195000, location: "Mumbai", avatar: "VS", manager: "Arjun Sharma", employeeId: "WS004", shifts: 22 },
  { id: "e6", name: "Ananya Roy", role: "Data Scientist", dept: "Analytics", email: "ananya.r@worksphere.ai", phone: "+91-93210-98765", status: "remote", joinDate: "2022-04-15", shift: "Flexible", fatigue: 29, wellness: 88, performance: 95, attendance: 98, salary: 175000, location: "Kolkata (Remote)", avatar: "AR", manager: "Arjun Sharma", employeeId: "WS005", shifts: 17 },
  { id: "e7", name: "Suresh Menon", role: "Security Manager", dept: "Security", email: "suresh.m@worksphere.ai", phone: "+91-92109-87654", status: "active", joinDate: "2018-06-30", shift: "Night", fatigue: 81, wellness: 44, performance: 79, attendance: 88, salary: 155000, location: "Chennai", avatar: "SM", manager: "Vikram Singh", employeeId: "WS006", shifts: 24 },
  { id: "e8", name: "Divya Krishnan", role: "HR Manager", dept: "Human Resources", email: "divya.k@worksphere.ai", phone: "+91-91098-76543", status: "on-leave", joinDate: "2021-08-20", shift: "Morning", fatigue: 35, wellness: 71, performance: 87, attendance: 89, salary: 125000, location: "Hyderabad", avatar: "DK", manager: "Priya Nair", employeeId: "WS007", shifts: 15 },
  { id: "e9", name: "Amit Joshi", role: "Backend Engineer", dept: "Engineering", email: "amit.j@worksphere.ai", phone: "+91-90987-65432", status: "active", joinDate: "2022-01-17", shift: "Morning", fatigue: 54, wellness: 72, performance: 90, attendance: 95, salary: 120000, location: "Bangalore", avatar: "AJ", manager: "Rajesh Kumar", employeeId: "WS043", shifts: 20 },
  { id: "e10", name: "Neha Gupta", role: "Compliance Officer", dept: "Legal", email: "neha.g@worksphere.ai", phone: "+91-89876-54321", status: "active", joinDate: "2020-09-14", shift: "Morning", fatigue: 31, wellness: 82, performance: 89, attendance: 97, salary: 140000, location: "New Delhi", avatar: "NG", manager: "Arjun Sharma", employeeId: "WS008", shifts: 18 },
  { id: "e11", name: "Karan Malhotra", role: "DevOps Engineer", dept: "Engineering", email: "karan.m@worksphere.ai", phone: "+91-88765-43210", status: "active", joinDate: "2021-11-03", shift: "Evening", fatigue: 61, wellness: 67, performance: 86, attendance: 93, salary: 135000, location: "Bangalore", avatar: "KM", manager: "Rajesh Kumar", employeeId: "WS044", shifts: 21 },
  { id: "e12", name: "Pooja Iyer", role: "UX Designer", dept: "Product", email: "pooja.i@worksphere.ai", phone: "+91-87654-32109", status: "active", joinDate: "2022-06-01", shift: "Morning", fatigue: 25, wellness: 91, performance: 94, attendance: 99, salary: 130000, location: "Bangalore", avatar: "PI", manager: "Arjun Sharma", employeeId: "WS009", shifts: 19 },
  { id: "e13", name: "Rahul Verma", role: "Night Supervisor", dept: "Operations", email: "rahul.v@worksphere.ai", phone: "+91-86543-21098", status: "at-risk", joinDate: "2019-04-22", shift: "Night", fatigue: 88, wellness: 38, performance: 76, attendance: 85, salary: 98000, location: "Mumbai", avatar: "RV", manager: "Vikram Singh", employeeId: "WS010", shifts: 26 },
  { id: "e14", name: "Sunita Rao", role: "Payroll Specialist", dept: "Finance", email: "sunita.r@worksphere.ai", phone: "+91-85432-10987", status: "active", joinDate: "2020-12-08", shift: "Morning", fatigue: 22, wellness: 86, performance: 92, attendance: 98, salary: 115000, location: "Hyderabad", avatar: "SR", manager: "Priya Nair", employeeId: "WS011", shifts: 18 },
  { id: "e15", name: "Mohammed Khan", role: "QA Lead", dept: "Engineering", email: "mohammed.k@worksphere.ai", phone: "+91-84321-09876", status: "absent", joinDate: "2021-05-19", shift: "Morning", fatigue: 46, wellness: 69, performance: 84, attendance: 82, salary: 125000, location: "Pune", avatar: "MK", manager: "Rajesh Kumar", employeeId: "WS045", shifts: 16 },
  { id: "e16", name: "Dr. Preethi Acharya", role: "Chief Medical Officer", dept: "ICU", email: "preethi.a@worksphere.ai", phone: "+91-82234-56789", status: "active", joinDate: "2018-01-08", shift: "Night", fatigue: 35, wellness: 77, performance: 94, attendance: 98, salary: 260000, location: "New Delhi HQ", avatar: "PA", manager: "Arjun Sharma", employeeId: "WS012", shifts: 23 },
  { id: "e17", name: "Maya Desai", role: "Marketing Director", dept: "Marketing", email: "maya.d@worksphere.ai", phone: "+91-81111-22233", status: "active", joinDate: "2021-03-11", shift: "Morning", fatigue: 40, wellness: 70, performance: 88, attendance: 96, salary: 160000, location: "Bangalore", avatar: "MD", manager: "Arjun Sharma", employeeId: "WS013", shifts: 16 },
  { id: "e18", name: "Ravi Patel", role: "Sales Manager", dept: "Sales", email: "ravi.p@worksphere.ai", phone: "+91-79999-88877", status: "active", joinDate: "2020-05-22", shift: "Morning", fatigue: 52, wellness: 63, performance: 84, attendance: 91, salary: 158000, location: "Mumbai", avatar: "RP", manager: "Arjun Sharma", employeeId: "WS014", shifts: 18 },
  { id: "e19", name: "Sahana Menon", role: "Customer Success Lead", dept: "Customer Success", email: "sahana.m@worksphere.ai", phone: "+91-78888-77766", status: "remote", joinDate: "2022-08-09", shift: "Flexible", fatigue: 28, wellness: 90, performance: 92, attendance: 99, salary: 130000, location: "Chennai (Remote)", avatar: "SM", manager: "Priya Nair", employeeId: "WS015", shifts: 15 },
  { id: "e20", name: "Geeta Singh", role: "Procurement Specialist", dept: "Procurement", email: "geeta.s@worksphere.ai", phone: "+91-76666-55544", status: "active", joinDate: "2021-09-28", shift: "Morning", fatigue: 47, wellness: 73, performance: 86, attendance: 93, salary: 110000, location: "Hyderabad", avatar: "GS", manager: "Sunita Rao", employeeId: "WS016", shifts: 17 },
  { id: "e21", name: "Aditya Kapoor", role: "Facilities Coordinator", dept: "Facilities", email: "aditya.k@worksphere.ai", phone: "+91-75555-44433", status: "on-leave", joinDate: "2019-10-15", shift: "Rotational", fatigue: 30, wellness: 64, performance: 80, attendance: 88, salary: 90000, location: "Bangalore", avatar: "AK", manager: "Vikram Singh", employeeId: "WS017", shifts: 14 },
  { id: "e22", name: "Nidhi Choudhary", role: "Training Manager", dept: "Training", email: "nidhi.c@worksphere.ai", phone: "+91-74444-33322", status: "active", joinDate: "2023-01-05", shift: "Morning", fatigue: 33, wellness: 86, performance: 91, attendance: 97, salary: 122000, location: "Bangalore", avatar: "NC", manager: "Priya Nair", employeeId: "WS018", shifts: 16 },
  { id: "e23", name: "Sanjay Rao", role: "Legal Counsel", dept: "Legal", email: "sanjay.r@worksphere.ai", phone: "+91-73333-22211", status: "active", joinDate: "2021-11-19", shift: "Morning", fatigue: 36, wellness: 79, performance: 88, attendance: 96, salary: 138000, location: "New Delhi", avatar: "SJ", manager: "Neha Gupta", employeeId: "WS019", shifts: 17 },
  { id: "e24", name: "Kavya Sinha", role: "Product Manager", dept: "Product", email: "kavya.s@worksphere.ai", phone: "+91-72222-11100", status: "active", joinDate: "2021-02-15", shift: "Morning", fatigue: 44, wellness: 72, performance: 89, attendance: 95, salary: 148000, location: "Bangalore", avatar: "KS", manager: "Pooja Iyer", employeeId: "WS020", shifts: 18 },
  { id: "e25", name: "Tarun Bose", role: "Finance Analyst", dept: "Finance", email: "tarun.b@worksphere.ai", phone: "+91-71111-00099", status: "absent", joinDate: "2022-03-18", shift: "Morning", fatigue: 56, wellness: 60, performance: 83, attendance: 80, salary: 98000, location: "Hyderabad", avatar: "TB", manager: "Sunita Rao", employeeId: "WS021", shifts: 14 },
  { id: "e26", name: "Leena Nair", role: "Talent Acquisition", dept: "Human Resources", email: "leena.n@worksphere.ai", phone: "+91-70000-99988", status: "at-risk", joinDate: "2022-07-26", shift: "Morning", fatigue: 79, wellness: 48, performance: 81, attendance: 90, salary: 112000, location: "Bangalore", avatar: "LN", manager: "Priya Nair", employeeId: "WS022", shifts: 20 },
  { id: "e27", name: "Arjun Mehta", role: "Cybersecurity Analyst", dept: "Security", email: "arjun.m@worksphere.ai", phone: "+91-68888-77766", status: "active", joinDate: "2020-11-11", shift: "Night", fatigue: 66, wellness: 58, performance: 87, attendance: 92, salary: 142000, location: "Chennai", avatar: "AM", manager: "Suresh Menon", employeeId: "WS023", shifts: 22 },
];

// ─── SHIFTS ───────────────────────────────────────────────────────────────────
export const shifts: Shift[] = [
  { id: "s1", employee: "Rajesh Kumar", employeeId: "e3", day: "Mon", date: "2026-07-07", start: "08:00", end: "17:00", type: "morning", dept: "Engineering", status: "confirmed", conflict: false },
  { id: "s2", employee: "Meera Patel", employeeId: "e4", day: "Mon", date: "2026-07-07", start: "08:00", end: "17:00", type: "morning", dept: "Engineering", status: "confirmed", conflict: false },
  { id: "s3", employee: "Suresh Menon", employeeId: "e7", day: "Mon", date: "2026-07-07", start: "22:00", end: "06:00", type: "night", dept: "Security", status: "confirmed", conflict: false },
  { id: "s4", employee: "Karan Malhotra", employeeId: "e11", day: "Mon", date: "2026-07-07", start: "14:00", end: "23:00", type: "evening", dept: "Engineering", status: "pending", conflict: false },
  { id: "s5", employee: "Rahul Verma", employeeId: "e13", day: "Mon", date: "2026-07-07", start: "22:00", end: "06:00", type: "night", dept: "Operations", status: "conflict", conflict: true },
  { id: "s6", employee: "Vikram Singh", employeeId: "e5", day: "Tue", date: "2026-07-08", start: "08:00", end: "17:00", type: "morning", dept: "Operations", status: "confirmed", conflict: false },
  { id: "s7", employee: "Amit Joshi", employeeId: "e9", day: "Tue", date: "2026-07-08", start: "08:00", end: "17:00", type: "morning", dept: "Engineering", status: "confirmed", conflict: false },
  { id: "s8", employee: "Rajesh Kumar", employeeId: "e3", day: "Tue", date: "2026-07-08", start: "08:00", end: "17:00", type: "morning", dept: "Engineering", status: "confirmed", conflict: false },
  { id: "s9", employee: "Suresh Menon", employeeId: "e7", day: "Tue", date: "2026-07-08", start: "22:00", end: "06:00", type: "night", dept: "Security", status: "conflict", conflict: true },
  { id: "s10", employee: "Meera Patel", employeeId: "e4", day: "Wed", date: "2026-07-09", start: "08:00", end: "17:00", type: "morning", dept: "Engineering", status: "confirmed", conflict: false },
  { id: "s11", employee: "Amit Joshi", employeeId: "e9", day: "Wed", date: "2026-07-09", start: "08:00", end: "17:00", type: "morning", dept: "Engineering", status: "confirmed", conflict: false },
  { id: "s12", employee: "Rahul Verma", employeeId: "e13", day: "Wed", date: "2026-07-09", start: "22:00", end: "06:00", type: "night", dept: "Operations", status: "confirmed", conflict: false },
  { id: "s13", employee: "Karan Malhotra", employeeId: "e11", day: "Thu", date: "2026-07-10", start: "14:00", end: "23:00", type: "evening", dept: "Engineering", status: "confirmed", conflict: false },
  { id: "s14", employee: "Vikram Singh", employeeId: "e5", day: "Thu", date: "2026-07-10", start: "08:00", end: "17:00", type: "morning", dept: "Operations", status: "confirmed", conflict: false },
  { id: "s15", employee: "Rajesh Kumar", employeeId: "e3", day: "Fri", date: "2026-07-11", start: "08:00", end: "17:00", type: "morning", dept: "Engineering", status: "confirmed", conflict: false },
  { id: "s16", employee: "Dr. Preethi Acharya", employeeId: "e16", day: "Mon", date: "2026-07-07", start: "22:00", end: "06:00", type: "night", dept: "ICU", status: "confirmed", conflict: false },
  { id: "s17", employee: "Maya Desai", employeeId: "e17", day: "Tue", date: "2026-07-08", start: "09:00", end: "17:00", type: "morning", dept: "Marketing", status: "confirmed", conflict: false },
  { id: "s18", employee: "Ravi Patel", employeeId: "e18", day: "Wed", date: "2026-07-09", start: "09:00", end: "17:00", type: "morning", dept: "Sales", status: "confirmed", conflict: false },
  { id: "s19", employee: "Arjun Mehta", employeeId: "e27", day: "Tue", date: "2026-07-08", start: "22:00", end: "06:00", type: "night", dept: "Security", status: "confirmed", conflict: false },
  { id: "s20", employee: "Nidhi Choudhary", employeeId: "e22", day: "Thu", date: "2026-07-10", start: "09:00", end: "17:00", type: "morning", dept: "Training", status: "pending", conflict: false },
  { id: "s21", employee: "Aditya Kapoor", employeeId: "e21", day: "Tue", date: "2026-07-08", start: "08:00", end: "16:00", type: "day", dept: "Facilities", status: "confirmed", conflict: false },
];

// ─── LEAVE REQUESTS ───────────────────────────────────────────────────────────
export const leaveRequests: LeaveRequest[] = [
  { id: 1, employee: "Divya Krishnan", employeeId: "e8", type: "Medical Leave", start: "2026-07-01", end: "2026-07-10", days: 10, reason: "Post-surgery recovery", status: "approved", appliedOn: "2026-06-28", managerId: "u2", dept: "Human Resources" },
  { id: 2, employee: "Mohammed Khan", employeeId: "e15", type: "Annual Leave", start: "2026-07-03", end: "2026-07-05", days: 3, reason: "Family event", status: "pending", appliedOn: "2026-07-01", managerId: "u3", dept: "Engineering" },
  { id: 3, employee: "Amit Joshi", employeeId: "e9", type: "Casual Leave", start: "2026-07-08", end: "2026-07-08", days: 1, reason: "Personal work", status: "pending", appliedOn: "2026-07-02", managerId: "u3", dept: "Engineering" },
  { id: 4, employee: "Karan Malhotra", employeeId: "e11", type: "Emergency Leave", start: "2026-07-10", end: "2026-07-12", days: 3, reason: "Family emergency", status: "pending", appliedOn: "2026-07-03", managerId: "u3", dept: "Engineering" },
  { id: 5, employee: "Ananya Roy", employeeId: "e6", type: "Annual Leave", start: "2026-07-15", end: "2026-07-22", days: 8, reason: "Planned vacation", status: "approved", appliedOn: "2026-06-20", managerId: "u1", dept: "Analytics" },
  { id: 6, employee: "Neha Gupta", employeeId: "e10", type: "Sick Leave", start: "2026-07-04", end: "2026-07-05", days: 2, reason: "Fever and rest", status: "approved", appliedOn: "2026-07-03", managerId: "u1", dept: "Legal" },
  { id: 7, employee: "Sunita Rao", employeeId: "e14", type: "Annual Leave", start: "2026-07-20", end: "2026-07-25", days: 6, reason: "Family vacation", status: "rejected", appliedOn: "2026-07-01", managerId: "u2", dept: "Finance" },
  { id: 8, employee: "Aditya Kapoor", employeeId: "e21", type: "Annual Leave", start: "2026-07-11", end: "2026-07-15", days: 5, reason: "Home renovation support", status: "approved", appliedOn: "2026-07-05", managerId: "u5", dept: "Facilities" },
  { id: 9, employee: "Tarun Bose", employeeId: "e25", type: "Sick Leave", start: "2026-07-11", end: "2026-07-13", days: 3, reason: "Flu recovery", status: "pending", appliedOn: "2026-07-09", managerId: "u2", dept: "Finance" },
  { id: 10, employee: "Leena Nair", employeeId: "e26", type: "Emergency Leave", start: "2026-07-12", end: "2026-07-14", days: 3, reason: "Family medical emergency", status: "pending", appliedOn: "2026-07-10", managerId: "u2", dept: "Human Resources" },
];

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
export const notifications: Notification[] = [
  { id: "n1", title: "AI Burnout Alert", message: "Rahul Verma shows 88% fatigue risk — 6th consecutive night shift detected.", type: "ai", time: "2 min ago", read: false, priority: "high" },
  { id: "n2", title: "Shift Conflict", message: "Mohammed Khan's approved leave overlaps with a scheduled shift on July 5.", type: "warning", time: "15 min ago", read: false, priority: "high" },
  { id: "n3", title: "Leave Request", message: "Karan Malhotra applied for Emergency Leave (Jul 10–12).", type: "info", time: "1 hr ago", read: false, priority: "medium" },
  { id: "n4", title: "Compliance Violation", message: "Night shift group in Operations exceeds 72-hour weekly limit.", type: "error", time: "2 hr ago", read: false, priority: "high" },
  { id: "n5", title: "Payroll Processed", message: "June 2026 payroll for 142 employees processed successfully.", type: "success", time: "3 hr ago", read: true, priority: "low" },
  { id: "n6", title: "New Employee Joined", message: "Dr. Preethi Acharya joined as Chief Medical Officer.", type: "info", time: "1 day ago", read: true, priority: "low" },
  { id: "n7", title: "AI Insight", message: "Productivity forecast for Engineering dept shows 12% improvement expected next week.", type: "ai", time: "1 day ago", read: true, priority: "medium" },
  { id: "n8", title: "Schedule Published", message: "Week of July 7–13 schedule published for all departments.", type: "success", time: "2 days ago", read: true, priority: "low" },
];

// ─── AUDIT LOGS ───────────────────────────────────────────────────────────────
export const auditLogs: AuditLog[] = [
  { id: "a1", user: "Arjun Sharma", action: "Updated Role", target: "Vikram Singh → Operations Director", type: "update", time: "2026-07-03 14:32", ip: "192.168.1.45" },
  { id: "a2", user: "Priya Nair", action: "Approved Leave", target: "Divya Krishnan - Medical Leave", type: "approval", time: "2026-07-03 13:15", ip: "192.168.1.62" },
  { id: "a3", user: "System", action: "AI Alert Triggered", target: "Burnout risk: Rahul Verma (88%)", type: "ai", time: "2026-07-03 12:48", ip: "System" },
  { id: "a4", user: "Rajesh Kumar", action: "Modified Shift", target: "Engineering - July 5 schedule", type: "update", time: "2026-07-03 11:20", ip: "192.168.1.78" },
  { id: "a5", user: "Priya Nair", action: "Exported Report", target: "June 2026 Payroll Report (PDF)", type: "export", time: "2026-07-03 10:05", ip: "192.168.1.62" },
  { id: "a6", user: "System", action: "Compliance Violation", target: "Operations team - 72hr limit exceeded", type: "security", time: "2026-07-03 09:30", ip: "System" },
  { id: "a7", user: "Arjun Sharma", action: "Login", target: "admin@worksphere.ai from New Delhi", type: "login", time: "2026-07-03 08:55", ip: "203.45.78.12" },
  { id: "a8", user: "Meera Patel", action: "Submitted Leave Request", target: "Casual Leave - Jul 15", type: "request", time: "2026-07-02 16:40", ip: "192.168.1.91" },
  { id: "a9", user: "Rajesh Kumar", action: "Acknowledged AI Recommendation", target: "Rotate ICU night shift team", type: "acknowledgment", time: "2026-07-02 14:10", ip: "192.168.1.78" },
  { id: "a10", user: "Priya Nair", action: "Rejected Leave Request", target: "Sunita Rao - Annual Leave Jul 20", type: "approval", time: "2026-07-02 11:05", ip: "192.168.1.62" },
];

// ─── AI INSIGHTS ──────────────────────────────────────────────────────────────
export const aiInsights: AIInsight[] = [
  {
    id: "ai1",
    employee: "Rahul Verma",
    avatar: "RV",
    riskLevel: "high",
    riskPct: 88,
    factors: ["6 consecutive night shifts", "72+ hours this week", "No rest day in 9 days", "Low wellness score (38/100)"],
    recommendation: "Immediately remove from next 2 night shifts. Schedule mandatory rest day. Book wellness consultation. Rotate with Vikram Singh for Tuesday shift.",
    replacements: ["Vikram Singh — Fatigue: 72%", "Ananya Roy — Fatigue: 29%"],
    confidence: 94,
  },
  {
    id: "ai2",
    employee: "Suresh Menon",
    avatar: "SM",
    riskLevel: "high",
    riskPct: 81,
    factors: ["5 consecutive night shifts", "65+ weekly hours", "Below average wellness (44/100)", "Consecutive weekends worked"],
    recommendation: "Swap Tuesday night shift with a day-shift colleague. Enforce 2-day weekend rest block. Consider night shift allowance review.",
    replacements: ["Rajesh Kumar — Fatigue: 65%", "Amit Joshi — Fatigue: 54%"],
    confidence: 89,
  },
  {
    id: "ai3",
    employee: "Rajesh Kumar",
    avatar: "RK",
    riskLevel: "medium",
    riskPct: 65,
    factors: ["Above average weekly hours (52h)", "Managing 4 direct reports simultaneously", "Missed last two scheduled breaks"],
    recommendation: "Delegate shift approval tasks to Meera Patel this week. Encourage 30-min lunch breaks. No additional overtime until score drops below 50%.",
    replacements: ["Meera Patel — Fatigue: 38%", "Pooja Iyer — Fatigue: 25%"],
    confidence: 76,
  },
  {
    id: "ai4",
    employee: "Vikram Singh",
    avatar: "VS",
    riskLevel: "medium",
    riskPct: 72,
    factors: ["Rotational shift pattern — circadian disruption", "Travel fatigue (Mumbai ↔ Bangalore)", "Missed 2 wellness check-ins"],
    recommendation: "Stabilize to fixed morning shift for next 2 weeks. Arrange remote work option for non-critical days to reduce travel fatigue.",
    replacements: ["Karan Malhotra — Fatigue: 61%", "Neha Gupta — Fatigue: 31%"],
    confidence: 81,
  },
];

// ─── HEATMAP DATA ─────────────────────────────────────────────────────────────
export const heatmapData: HeatmapRow[] = [
  { team: "Engineering", Mon: 72, Tue: 78, Wed: 81, Thu: 75, Fri: 68, Sat: 35, Sun: 28 },
  { team: "Operations", Mon: 88, Tue: 91, Wed: 87, Thu: 93, Fri: 85, Sat: 72, Sun: 65 },
  { team: "Security", Mon: 62, Tue: 65, Wed: 68, Thu: 71, Fri: 64, Sat: 82, Sun: 85 },
  { team: "HR", Mon: 45, Tue: 48, Wed: 52, Thu: 47, Fri: 41, Sat: 15, Sun: 12 },
  { team: "Finance", Mon: 55, Tue: 58, Wed: 61, Thu: 53, Fri: 49, Sat: 18, Sun: 10 },
  { team: "Product", Mon: 67, Tue: 72, Wed: 74, Thu: 69, Fri: 63, Sat: 31, Sun: 22 },
  { team: "Legal", Mon: 38, Tue: 42, Wed: 44, Thu: 40, Fri: 36, Sat: 8, Sun: 5 },
  { team: "ICU", Mon: 95, Tue: 89, Wed: 92, Thu: 96, Fri: 90, Sat: 88, Sun: 85 },
];

// ─── CHART DATA ───────────────────────────────────────────────────────────────

/** Fatigue trend — months × team/industry/threshold lines */
export const fatigueData = [
  { month: "Jan", team: 42, industry: 48, threshold: 70 },
  { month: "Feb", team: 45, industry: 47, threshold: 70 },
  { month: "Mar", team: 51, industry: 49, threshold: 70 },
  { month: "Apr", team: 48, industry: 50, threshold: 70 },
  { month: "May", team: 55, industry: 51, threshold: 70 },
  { month: "Jun", team: 61, industry: 52, threshold: 70 },
  { month: "Jul", team: 58, industry: 53, threshold: 70 },
];

/** Weekly workload — days × fatigue/overtime bars */
export const weeklyWorkloadData = [
  { day: "Mon", fatigue: 52, ot: 4 },
  { day: "Tue", fatigue: 58, ot: 6 },
  { day: "Wed", fatigue: 61, ot: 8 },
  { day: "Thu", fatigue: 55, ot: 5 },
  { day: "Fri", fatigue: 67, ot: 10 },
  { day: "Sat", fatigue: 71, ot: 7 },
  { day: "Sun", fatigue: 49, ot: 3 },
];

/** Compliance breakdown — pie chart */
export const complianceData = [
  { name: "Working Hours", value: 92, color: "#4F46E5" },
  { name: "Rest Periods", value: 85, color: "#10B981" },
  { name: "Overtime Limits", value: 78, color: "#F59E0B" },
  { name: "Annual Leave", value: 94, color: "#0EA5E9" },
];

/** Staffing coverage — department bar chart */
export const staffingData = [
  { dept: "Engineering", required: 52, actual: 49 },
  { dept: "Operations", required: 38, actual: 28 },
  { dept: "Security", required: 24, actual: 22 },
  { dept: "HR", required: 18, actual: 18 },
  { dept: "Finance", required: 15, actual: 14 },
  { dept: "Product", required: 12, actual: 12 },
];

// ─── TOOLTIP STYLE (recharts) ─────────────────────────────────────────────────
export const tooltipStyle = {
  background: "hsl(var(--card))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "12px",
  color: "hsl(var(--foreground))",
  fontSize: 12,
  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
};
