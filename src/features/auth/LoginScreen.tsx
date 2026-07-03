import { useState } from "react";
import {
  Zap, Mail, Lock, CheckCircle, ArrowRight, RefreshCw, Globe,
  Brain, BarChart2, Calendar, Shield,
} from "lucide-react";
import type { Role } from "@/types";

interface LoginScreenProps {
  onLogin: (role: Role) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
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
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-semibold text-foreground">Password</label>
                <button className="text-xs text-primary hover:underline font-medium">Forgot password?</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={15} />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/60 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Demo — Sign in as</label>
              <div className="space-y-1.5">
                {roles.map(r => (
                  <button
                    key={r.value}
                    onClick={() => setSelectedRole(r.value)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl border text-left transition-all ${
                      selectedRole === r.value
                        ? "border-primary/40 bg-indigo-50 dark:bg-indigo-950/40"
                        : "border-border hover:border-primary/20 hover:bg-muted/40"
                    }`}
                  >
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

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-70"
            >
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
