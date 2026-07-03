// ─── EMPLOYEES ────────────────────────────────────────────────────────────────
export const employees = [
  { id: 1, name: "Sarah Chen", role: "Senior Nurse", dept: "ICU", avatar: "SC", fatigue: 72, wellness: 65, attendance: 94, shifts: 24, status: "active" },
  { id: 2, name: "Marcus Rivera", role: "Operations Lead", dept: "Logistics", avatar: "MR", fatigue: 45, wellness: 88, attendance: 98, shifts: 20, status: "active" },
  { id: 3, name: "Priya Patel", role: "HR Specialist", dept: "Human Resources", avatar: "PP", fatigue: 30, wellness: 92, attendance: 100, shifts: 22, status: "active" },
  { id: 4, name: "James O'Brien", role: "Warehouse Manager", dept: "Operations", avatar: "JO", fatigue: 85, wellness: 48, attendance: 89, shifts: 28, status: "at-risk" },
  { id: 5, name: "Aisha Kamara", role: "Compliance Officer", dept: "Legal", avatar: "AK", fatigue: 25, wellness: 95, attendance: 100, shifts: 18, status: "active" },
  { id: 6, name: "David Kim", role: "Engineering Lead", dept: "Engineering", avatar: "DK", fatigue: 60, wellness: 75, attendance: 96, shifts: 22, status: "active" },
];

// ─── CHARTS ───────────────────────────────────────────────────────────────────
export const fatigueData = [
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

export const staffingData = [
  { dept: "ICU", required: 12, actual: 9 },
  { dept: "Logistics", required: 20, actual: 19 },
  { dept: "HR", required: 8, actual: 8 },
  { dept: "Operations", required: 15, actual: 11 },
  { dept: "Engineering", required: 10, actual: 10 },
  { dept: "Legal", required: 6, actual: 5 },
];

export const complianceData = [
  { name: "Compliant", value: 87, color: "#10B981" },
  { name: "At Risk", value: 8, color: "#F59E0B" },
  { name: "Non-compliant", value: 5, color: "#F43F5E" },
];

export const weeklyWorkloadData = [
  { day: "Mon", hours: 8.2, fatigue: 45, ot: 0.5 },
  { day: "Tue", hours: 8.5, fatigue: 48, ot: 0.8 },
  { day: "Wed", hours: 9.1, fatigue: 58, ot: 1.1 },
  { day: "Thu", hours: 8.8, fatigue: 52, ot: 0.9 },
  { day: "Fri", hours: 8.4, fatigue: 55, ot: 0.6 },
  { day: "Sat", hours: 7.2, fatigue: 38, ot: 0 },
  { day: "Sun", hours: 6.8, fatigue: 30, ot: 0 },
];

// ─── SHIFTS ───────────────────────────────────────────────────────────────────
export const shifts = [
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

// ─── LEAVE REQUESTS ───────────────────────────────────────────────────────────
export const leaveRequests = [
  { id: 1, employee: "Sarah Chen", type: "Annual Leave", start: "2024-08-15", end: "2024-08-19", days: 5, status: "pending", reason: "Family vacation planned" },
  { id: 2, employee: "James O'Brien", type: "Sick Leave", start: "2024-08-10", end: "2024-08-12", days: 3, status: "approved", reason: "Medical appointment" },
  { id: 3, employee: "David Kim", type: "Overtime", start: "2024-08-08", end: "2024-08-08", days: 1, status: "pending", reason: "Q3 project delivery deadline" },
  { id: 4, employee: "Priya Patel", type: "Annual Leave", start: "2024-09-01", end: "2024-09-05", days: 5, status: "approved", reason: "Personal travel" },
  { id: 5, employee: "Marcus Rivera", type: "Overtime", start: "2024-08-12", end: "2024-08-12", days: 1, status: "rejected", reason: "Department over OT budget" },
  { id: 6, employee: "Aisha Kamara", type: "Maternity Leave", start: "2024-09-15", end: "2024-12-15", days: 90, status: "pending", reason: "Maternity leave" },
];

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
export const notifications = [
  { id: 1, type: "alert", title: "High fatigue risk detected", message: "James O'Brien shows 85% fatigue risk. Recommend immediate shift adjustment.", time: "2m ago", read: false },
  { id: 2, type: "info", title: "Shift coverage gap in ICU", message: "ICU department has 25% staffing gap for tomorrow evening shift.", time: "15m ago", read: false },
  { id: 3, type: "success", title: "Leave request approved", message: "Priya Patel's annual leave has been approved by HR Manager.", time: "1h ago", read: false },
  { id: 4, type: "warning", title: "Compliance deadline approaching", message: "Q3 compliance reports are due in 5 days. 3 departments pending.", time: "3h ago", read: true },
  { id: 5, type: "info", title: "New employee onboarded", message: "Li Wei has completed onboarding and is now active in the system.", time: "1d ago", read: true },
  { id: 6, type: "alert", title: "Overtime threshold exceeded", message: "Engineering team has exceeded monthly overtime allowance by 18%.", time: "2d ago", read: true },
];

// ─── AUDIT LOGS ───────────────────────────────────────────────────────────────
export const auditLogs = [
  { id: 1, user: "Priya Patel", action: "Approved leave request", target: "Sarah Chen", time: "2024-08-07 14:32", type: "approval" },
  { id: 2, user: "System AI", action: "Generated fatigue risk report", target: "James O'Brien", time: "2024-08-07 13:15", type: "ai" },
  { id: 3, user: "Marcus Rivera", action: "Updated shift schedule", target: "Week 33 — Operations", time: "2024-08-07 11:45", type: "update" },
  { id: 4, user: "Admin", action: "Modified RBAC permissions", target: "Supervisor role group", time: "2024-08-07 10:20", type: "security" },
  { id: 5, user: "Aisha Kamara", action: "Exported compliance report", target: "Q2 2024 — Legal", time: "2024-08-07 09:30", type: "export" },
  { id: 6, user: "System", action: "Automated shift optimization", target: "Operations dept — Week 34", time: "2024-08-07 08:00", type: "ai" },
  { id: 7, user: "James O'Brien", action: "Submitted overtime request", target: "Self — Aug 8", time: "2024-08-06 17:15", type: "request" },
  { id: 8, user: "David Kim", action: "Acknowledged fatigue alert", target: "Self", time: "2024-08-06 16:40", type: "acknowledgment" },
];

// ─── HEATMAP ──────────────────────────────────────────────────────────────────
export const heatmapData = [
  { team: "ICU Team A", Mon: 92, Tue: 88, Wed: 95, Thu: 78, Fri: 85, Sat: 70, Sun: 60 },
  { team: "ICU Team B", Mon: 65, Tue: 70, Wed: 68, Thu: 72, Fri: 66, Sat: 80, Sun: 88 },
  { team: "Logistics", Mon: 75, Tue: 72, Wed: 78, Thu: 69, Fri: 88, Sat: 45, Sun: 30 },
  { team: "Operations", Mon: 85, Tue: 90, Wed: 88, Thu: 92, Fri: 78, Sat: 50, Sun: 40 },
  { team: "Engineering", Mon: 55, Tue: 60, Wed: 72, Thu: 68, Fri: 65, Sat: 20, Sun: 15 },
  { team: "HR & Legal", Mon: 70, Tue: 65, Wed: 68, Thu: 71, Fri: 60, Sat: 10, Sun: 5 },
];

// ─── AI INSIGHTS ─────────────────────────────────────────────────────────────
export const aiInsights = [
  {
    id: 1, employee: "James O'Brien", avatar: "JO", riskLevel: "high" as const, riskPct: 85,
    factors: ["28 shifts this month (avg 22)", "3 consecutive 10-hour shifts", "Declining performance score (−14%)"],
    recommendation: "Immediate relief recommended. 2-day rest period before next shift assignment.",
    replacements: ["Marcus Rivera — 45% fatigue", "David Kim — 60% fatigue"],
  },
  {
    id: 2, employee: "Sarah Chen", avatar: "SC", riskLevel: "medium" as const, riskPct: 72,
    factors: ["24 shifts this month", "2 consecutive night shifts", "Reduced break compliance"],
    recommendation: "Schedule rotation to day shift from next Monday. Monitor for 2 weeks.",
    replacements: ["Priya Patel — 30% fatigue", "Aisha Kamara — 25% fatigue"],
  },
  {
    id: 3, employee: "David Kim", avatar: "DK", riskLevel: "medium" as const, riskPct: 60,
    factors: ["22 shifts this month", "Project overtime last week (+4h)"],
    recommendation: "Avoid overtime for next 2 weeks. Current trajectory manageable.",
    replacements: ["Marcus Rivera — 45% fatigue"],
  },
];

// ─── CHATBOT ──────────────────────────────────────────────────────────────────
export const initialChatMessages = [
  { role: "assistant", content: "Hello! I'm WorkSphere AI. I can analyze workforce data, optimize schedules, flag risk, and surface insights across your organization. What would you like to know?" },
];

export const chatResponses: Record<string, string> = {
  "Who has the highest fatigue risk today?": "James O'Brien has the highest fatigue risk at 85%. He has worked 28 shifts this month (avg: 22) and completed 3 consecutive 10-hour shifts. I recommend immediate relief — reassign his next 2 shifts to Marcus Rivera (45% fatigue) or David Kim (60% fatigue).",
  "Show me ICU staffing gaps": "The ICU currently has a 25% staffing gap: 9 of 12 required staff covered. ICU Team A is running at 92% workload on Mondays. I recommend deploying 2 nurses from the internal relief pool and flagging this to the HR Manager.",
  "Summarize pending leave requests": "3 leave requests are pending review: Sarah Chen (5-day annual, Aug 15–19 — may impact ICU scheduling), David Kim (overtime claim, Aug 8), and Aisha Kamara (90-day maternity, Sep 15). Aisha's request is time-sensitive for succession planning.",
  "Optimize this week's shifts": "Recommended optimizations: (1) Remove James O'Brien from Wednesday morning shift — replace with Marcus Rivera. (2) Rotate Sarah Chen to day shift from Tuesday. (3) Add 1 staff to Operations Thursday evening. Net effect: average fatigue drops from 61% to 47%.",
};

// ─── CHART TOOLTIP STYLE ──────────────────────────────────────────────────────
export const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: "12px",
  fontSize: "12px",
  color: "var(--foreground)",
};
