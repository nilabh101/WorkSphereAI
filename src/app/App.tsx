import { useState, useEffect } from "react";
import {
  LayoutDashboard, Users, Calendar, Brain, ClipboardList, Bell,
  Map, FileText, Settings, Shield, LogOut, Sun, Moon, Search,
  MessageSquare, ChevronRight, ChevronLeft, Zap, BarChart2,
} from "lucide-react";

import type { Role, Page } from "@/types";
import { LoginScreen } from "@/features/auth/LoginScreen";
import { DashboardScreen } from "@/features/dashboard/DashboardScreen";
import { AnalyticsScreen } from "@/features/analytics/AnalyticsScreen";
import { ShiftPlannerScreen } from "@/features/shifts/ShiftPlannerScreen";
import { EmployeeProfileScreen } from "@/features/employees/EmployeeProfileScreen";
import { AIInsightsScreen } from "@/features/ai-insights/AIInsightsScreen";
import { LeaveOTScreen } from "@/features/leave-ot/LeaveOTScreen";
import { HeatmapScreen } from "@/features/heatmap/HeatmapScreen";
import { NotificationsScreen } from "@/features/notifications/NotificationsScreen";
import { AuditLogsScreen } from "@/features/audit/AuditLogsScreen";
import { SettingsScreen } from "@/features/settings/SettingsScreen";
import { RBACScreen } from "@/features/rbac/RBACScreen";
import { ChatbotPanel } from "@/components/chatbot/ChatbotPanel";

// ─── NAV ITEMS ────────────────────────────────────────────────────────────────
const navItems = [
  { id: "dashboard",     label: "Dashboard",          icon: LayoutDashboard },
  { id: "analytics",     label: "Analytics",          icon: BarChart2 },
  { id: "shifts",        label: "Shift Planner",      icon: Calendar },
  { id: "employees",     label: "Employees",          icon: Users },
  { id: "ai-insights",   label: "AI Insights",        icon: Brain,         badge: "3" },
  { id: "leave-ot",      label: "Leave & Overtime",   icon: ClipboardList, badge: "3" },
  { id: "heatmap",       label: "Workforce Heatmap",  icon: Map },
  { id: "notifications", label: "Notifications",      icon: Bell,          badge: "3" },
  { id: "audit",         label: "Audit Logs",         icon: FileText },
  { id: "settings",      label: "Settings",           icon: Settings },
  { id: "rbac",          label: "RBAC & Permissions", icon: Shield },
] as const;

const roleLabels: Record<Role, string> = {
  superadmin: "Super Admin",
  hrmanager:  "HR Manager",
  opsmanager: "Ops Manager",
  supervisor: "Supervisor",
  employee:   "Employee",
};

const roleInitials: Record<Role, string> = {
  superadmin: "SA",
  hrmanager:  "HM",
  opsmanager: "OM",
  supervisor: "SV",
  employee:   "EM",
};

// ─── PAGE RENDERER ────────────────────────────────────────────────────────────
function renderPage(page: Page, role: Role) {
  switch (page) {
    case "dashboard":     return <DashboardScreen role={role} />;
    case "analytics":     return <AnalyticsScreen />;
    case "shifts":        return <ShiftPlannerScreen />;
    case "employees":     return <EmployeeProfileScreen />;
    case "ai-insights":   return <AIInsightsScreen />;
    case "leave-ot":      return <LeaveOTScreen />;
    case "heatmap":       return <HeatmapScreen />;
    case "notifications": return <NotificationsScreen />;
    case "audit":         return <AuditLogsScreen />;
    case "settings":      return <SettingsScreen />;
    case "rbac":          return <RBACScreen />;
    default:              return <DashboardScreen role={role} />;
  }
}

// ─── APP SHELL ────────────────────────────────────────────────────────────────
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
    return (
      <LoginScreen onLogin={r => { setRole(r); setIsLoggedIn(true); }} />
    );
  }

  const activeLabel = navItems.find(n => n.id === page)?.label ?? "Dashboard";

  return (
    <div className="min-h-screen bg-background flex font-[Inter,sans-serif]">

      {/* ── Sidebar ── */}
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

        {/* Nav links */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const active = page === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setPage(item.id as Page)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  collapsed ? "px-2.5 py-2.5 justify-center" : "px-3 py-2.5"
                } ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm shadow-primary/20"
                    : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                <item.icon size={17} className="flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {"badge" in item && item.badge && (
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300"
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="p-3 border-t border-sidebar-border space-y-0.5">
          {!collapsed && (
            <button
              onClick={() => setIsLoggedIn(false)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all"
            >
              <LogOut size={16} /> Sign out
            </button>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={`w-full flex items-center rounded-xl text-sm font-semibold text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all ${
              collapsed ? "px-2.5 py-2.5 justify-center" : "gap-3 px-3 py-2.5"
            }`}
          >
            {collapsed ? <ChevronRight size={16} /> : <><ChevronLeft size={16} /><span>Collapse</span></>}
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0">

        {/* Top header */}
        <header className="h-16 border-b border-border bg-background/90 backdrop-blur-md sticky top-0 z-20 flex items-center gap-4 px-6 flex-shrink-0">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-sm font-bold text-foreground">{activeLabel}</span>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="relative hidden sm:block">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search WorkSphere…"
                className="w-52 pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:w-64 transition-all duration-200 text-foreground"
              />
            </div>

            <button
              onClick={() => setPage("notifications")}
              className="relative p-2.5 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors"
            >
              <Bell size={16} className="text-muted-foreground" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center leading-none">3</span>
            </button>

            <button
              onClick={() => setIsDark(!isDark)}
              className="p-2.5 rounded-xl border border-border bg-card hover:bg-muted/50 transition-colors"
            >
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

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8 max-w-[1400px] mx-auto">
            {renderPage(page, role)}
          </div>
        </main>
      </div>

      {/* ── AI Chat FAB ── */}
      {!chatOpen && (
        <button
          onClick={() => setChatOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-2xl shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:shadow-indigo-500/40 hover:scale-105 transition-all duration-200 flex items-center justify-center z-40"
        >
          <MessageSquare size={22} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-background" />
        </button>
      )}

      {chatOpen && <ChatbotPanel onClose={() => setChatOpen(false)} />}
    </div>
  );
}
