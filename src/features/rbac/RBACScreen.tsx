import { useState } from "react";
import { Plus, Edit, Trash2, CheckCircle, X, Shield } from "lucide-react";
import { Badge } from "@/components/shared/Badge";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { useStore, type RBACRole } from "@/store";

const ALL_PERMS = [
  "View all employees", "Edit employee records", "Approve leave", "Approve overtime",
  "View analytics", "Export reports", "Edit shifts", "Create shifts",
  "RBAC management", "System settings", "View own profile", "Submit leave",
];

const DOT_COLORS: Record<string, string> = {
  violet:  "bg-violet-500",
  indigo:  "bg-indigo-500",
  sky:     "bg-sky-500",
  emerald: "bg-emerald-500",
  amber:   "bg-amber-500",
  rose:    "bg-rose-500",
};

const COLOR_OPTIONS = ["violet", "indigo", "sky", "emerald", "amber", "rose"];

// ─── Role Modal ───────────────────────────────────────────────────────────────
function RoleModal({
  initial, onSave, onClose,
}: {
  initial: Omit<RBACRole, "id">;
  onSave: (r: Omit<RBACRole, "id">) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Omit<RBACRole, "id">>(initial);

  function togglePerm(perm: string) {
    setForm(f => ({
      ...f,
      permissions: f.permissions.includes(perm)
        ? f.permissions.filter(p => p !== perm)
        : [...f.permissions, perm],
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-base font-bold text-foreground">
            {initial.name ? "Edit Role" : "Create New Role"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted/50 transition-colors">
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Role Name *</label>
            <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Finance Auditor"
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-2">Color</label>
            <div className="flex gap-2">
              {COLOR_OPTIONS.map(c => (
                <button key={c} type="button" onClick={() => setForm(f => ({ ...f, color: c }))}
                  className={`w-8 h-8 rounded-full ${DOT_COLORS[c]} transition-all ${form.color === c ? "ring-2 ring-offset-2 ring-primary" : "opacity-60 hover:opacity-100"}`}
                  title={c}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-2">Permissions</label>
            <div className="space-y-2">
              {ALL_PERMS.map(perm => {
                const has = form.permissions.includes(perm);
                return (
                  <label key={perm} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted/50 transition-colors cursor-pointer">
                    <div
                      onClick={() => togglePerm(perm)}
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer ${has ? "bg-primary border-primary" : "border-border"}`}
                    >
                      {has && <CheckCircle size={12} className="text-primary-foreground" />}
                    </div>
                    <span className="text-sm text-foreground">{perm}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-border">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm font-semibold rounded-xl border border-border hover:bg-muted/50 transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="px-5 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all">
              {initial.name ? "Save Changes" : "Create Role"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export function RBACScreen() {
  const { roles, addRole, editRole, deleteRole } = useStore();

  const [showAdd,     setShowAdd]     = useState(false);
  const [editTarget,  setEditTarget]  = useState<RBACRole | null>(null);
  const [deleteTarget,setDeleteTarget]= useState<RBACRole | null>(null);

  return (
    <div className="space-y-8">
      <SectionHeader
        title="RBAC & Permissions"
        subtitle="Role-based access control — define and assign granular permissions"
        action={
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all">
            <Plus size={14} /> New Role
          </button>
        }
      />

      {/* Role cards */}
      {roles.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-16 text-center">
          <Shield size={32} className="text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-sm font-semibold text-foreground">No roles defined</p>
          <p className="text-xs text-muted-foreground mt-1">Click "New Role" to create your first role.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {roles.map(role => (
            <div key={role.id} className="bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className={`w-3 h-3 rounded-full ${DOT_COLORS[role.color] ?? "bg-gray-400"}`} />
                    <h3 className="font-bold text-foreground">{role.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{role.userCount.toLocaleString()} users assigned</p>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => setEditTarget(role)} className="p-2 rounded-xl border border-border hover:bg-muted/50 transition-colors" title="Edit">
                    <Edit size={13} className="text-muted-foreground" />
                  </button>
                  <button onClick={() => setDeleteTarget(role)} className="p-2 rounded-xl border border-border hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors" title="Delete">
                    <Trash2 size={13} className="text-rose-500" />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {role.permissions.slice(0, 5).map(p => (
                  <Badge key={p} variant={role.color === "violet" ? "indigo" : "default"}>{p}</Badge>
                ))}
                {role.permissions.length > 5 && (
                  <Badge variant="default">+{role.permissions.length - 5} more</Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Permission matrix */}
      {roles.length > 0 && (
        <div className="bg-card rounded-2xl p-6 border border-border shadow-sm overflow-x-auto">
          <h3 className="font-semibold text-foreground mb-6">Permission Matrix</h3>
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider w-48">Permission</th>
                {roles.map(r => (
                  <th key={r.id} className="pb-3 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider px-2">
                    {r.name.split(" ")[0]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ALL_PERMS.map(perm => (
                <tr key={perm} className="hover:bg-muted/15">
                  <td className="py-3 text-sm text-foreground font-medium">{perm}</td>
                  {roles.map(role => {
                    const has = role.permissions.includes(perm);
                    return (
                      <td key={role.id} className="py-3 text-center px-2">
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
      )}

      {/* Add modal */}
      {showAdd && (
        <RoleModal
          initial={{ name: "", color: "indigo", userCount: 0, permissions: [] }}
          onSave={r => { addRole(r); setShowAdd(false); }}
          onClose={() => setShowAdd(false)}
        />
      )}

      {/* Edit modal */}
      {editTarget && (
        <RoleModal
          initial={editTarget}
          onSave={r => { editRole(editTarget.id, r); setEditTarget(null); }}
          onClose={() => setEditTarget(null)}
        />
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h2 className="text-base font-bold text-foreground mb-2">Delete Role?</h2>
            <p className="text-sm text-muted-foreground mb-6">
              This will permanently delete the <strong className="text-foreground">{deleteTarget.name}</strong> role. Users assigned to this role will lose their permissions.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-sm font-semibold rounded-xl border border-border hover:bg-muted/50 transition-colors">
                Cancel
              </button>
              <button onClick={() => { deleteRole(deleteTarget.id); setDeleteTarget(null); }}
                className="px-4 py-2 bg-rose-600 text-white text-sm font-semibold rounded-xl hover:bg-rose-700 transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
