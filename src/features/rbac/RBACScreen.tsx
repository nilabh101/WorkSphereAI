import { Plus, Edit, Eye, CheckCircle, X } from "lucide-react";
import { Badge } from "@/components/shared/Badge";
import { SectionHeader } from "@/components/shared/SectionHeader";

const roles = [
  { name: "Super Admin", users: 2, color: "violet", perms: ["All system access", "RBAC management", "System settings", "API access"] },
  { name: "HR Manager", users: 8, color: "indigo", perms: ["View employees", "Approve leave", "Generate reports", "Manage contracts"] },
  { name: "Operations Manager", users: 14, color: "sky", perms: ["View schedules", "Edit shifts", "Approve overtime", "View analytics"] },
  { name: "Supervisor", users: 43, color: "emerald", perms: ["View team", "Submit requests", "View dept reports"] },
  { name: "Employee", users: 1180, color: "amber", perms: ["Own profile only", "Submit leave", "View schedule"] },
];

const allPerms = [
  "View all employees", "Edit employee records", "Approve leave", "Approve overtime",
  "View analytics", "Export reports", "Edit shifts", "Create shifts",
  "RBAC management", "System settings", "View own profile", "Submit leave",
];

const rolePerms: Record<string, string[]> = {
  "Super Admin": allPerms,
  "HR Manager": ["View all employees", "Edit employee records", "Approve leave", "View analytics", "Export reports"],
  "Operations Manager": ["View all employees", "Approve overtime", "View analytics", "Edit shifts", "Create shifts"],
  "Supervisor": ["View all employees", "View analytics"],
  "Employee": ["View own profile", "Submit leave"],
};

const dotColor: Record<string, string> = {
  violet: "bg-violet-500",
  indigo: "bg-indigo-500",
  sky: "bg-sky-500",
  emerald: "bg-emerald-500",
  amber: "bg-amber-500",
};

export function RBACScreen() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="RBAC & Permissions"
        subtitle="Role-based access control — define and assign granular permissions"
        action={
          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm hover:bg-primary/90 transition-all">
            <Plus size={14} /> New Role
          </button>
        }
      />

      {/* Role cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {roles.map(role => (
          <div key={role.name} className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <div className={`w-3 h-3 rounded-full ${dotColor[role.color] ?? "bg-gray-400"}`} />
                  <h3 className="font-bold text-foreground">{role.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{role.users.toLocaleString()} users assigned</p>
              </div>
              <div className="flex gap-1.5">
                <button className="p-2 rounded-xl border border-border hover:bg-muted/50 transition-colors">
                  <Edit size={13} className="text-muted-foreground" />
                </button>
                <button className="p-2 rounded-xl border border-border hover:bg-muted/50 transition-colors">
                  <Eye size={13} className="text-muted-foreground" />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {role.perms.map(p => (
                <Badge key={p} variant={role.name === "Super Admin" ? "indigo" : "default"}>{p}</Badge>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Permission matrix */}
      <div className="bg-card rounded-2xl p-6 border border-border shadow-sm overflow-x-auto">
        <h3 className="font-semibold text-foreground mb-6">Permission Matrix</h3>
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider w-48">Permission</th>
              {roles.map(r => (
                <th key={r.name} className="pb-3 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider px-2">
                  {r.name.split(" ")[0]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {allPerms.map(perm => (
              <tr key={perm} className="hover:bg-muted/15">
                <td className="py-3 text-sm text-foreground font-medium">{perm}</td>
                {roles.map(role => {
                  const has = rolePerms[role.name]?.includes(perm) ?? false;
                  return (
                    <td key={role.name} className="py-3 text-center px-2">
                      {has ? (
                        <div className="w-5 h-5 bg-emerald-100 dark:bg-emerald-950/40 rounded-full flex items-center justify-center mx-auto">
                          <CheckCircle size={12} className="text-emerald-500" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 bg-muted rounded-full flex items-center justify-center mx-auto">
                          <X size={10} className="text-muted-foreground/40" />
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
