import { useState } from "react";
import { Plus, CheckCircle, XCircle, Clock, ClipboardList, Trash2, X } from "lucide-react";
import { Avatar } from "@/components/shared/Avatar";
import { Badge } from "@/components/shared/Badge";
import { KpiCard } from "@/components/shared/KpiCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { useStore } from "@/store";
import type { LeaveRequest } from "@/types";

const LEAVE_TYPES = [
  "Annual Leave","Sick Leave","Medical Leave","Emergency Leave",
  "Casual Leave","Maternity Leave","Paternity Leave","Study Leave","Unpaid Leave",
];

type LeaveForm = Omit<LeaveRequest, "id" | "appliedOn" | "status">;

const BLANK: LeaveForm = {
  employee: "", employeeId: "", dept: "", type: "Annual Leave",
  start: new Date().toISOString().slice(0, 10),
  end:   new Date().toISOString().slice(0, 10),
  days: 1, reason: "", managerId: "",
};

// ─── Leave Request Modal ──────────────────────────────────────────────────────
function LeaveModal({
  onSave, onClose,
}: {
  onSave: (r: LeaveForm) => void;
  onClose: () => void;
}) {
  const { employees } = useStore();
  const [form, setForm] = useState<LeaveForm>(BLANK);

  function pickEmployee(id: string) {
    const emp = employees.find(e => e.id === id);
    if (emp) setForm(f => ({ ...f, employeeId: emp.id, employee: emp.name, dept: emp.dept }));
  }

  function calcDays(start: string, end: string) {
    if (!start || !end) return 1;
    const diff = (new Date(end).getTime() - new Date(start).getTime()) / 86400000;
    return Math.max(1, Math.round(diff) + 1);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.employeeId || !form.reason.trim()) return;
    onSave({ ...form, days: calcDays(form.start, form.end) });
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-base font-bold text-foreground">New Leave Request</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted/50 transition-colors">
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Employee *</label>
            <select required value={form.employeeId} onChange={e => pickEmployee(e.target.value)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground">
              <option value="">Select employee…</option>
              {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name} ({emp.dept})</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Leave Type</label>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground">
              {LEAVE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">From *</label>
              <input type="date" value={form.start} required
                onChange={e => setForm(f => ({ ...f, start: e.target.value }))}
                className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">To *</label>
              <input type="date" value={form.end} required min={form.start}
                onChange={e => setForm(f => ({ ...f, end: e.target.value }))}
                className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Reason *</label>
            <textarea required value={form.reason}
              onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
              rows={3} placeholder="Describe the reason for leave…"
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 text-foreground resize-none" />
          </div>

          <div className="text-xs text-muted-foreground">
            Duration: <strong className="text-foreground">{calcDays(form.start, form.end)} day{calcDays(form.start, form.end) !== 1 ? "s" : ""}</strong>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-border">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm font-semibold rounded-xl border border-border hover:bg-muted/50 transition-colors">
              Cancel
            </button>
            <button type="submit"
              className="px-5 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:bg-primary/90 transition-all">
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export function LeaveOTScreen() {
  const { leaveRequests, addLeaveRequest, approveLeave, rejectLeave, deleteLeave } = useStore();

  const [filter,  setFilter]  = useState("all");
  const [showAdd, setShowAdd] = useState(false);

  const filtered = filter === "all" ? leaveRequests : leaveRequests.filter(r => r.status === filter);
  const pending  = leaveRequests.filter(r => r.status === "pending").length;
  const approved = leaveRequests.filter(r => r.status === "approved").length;
  const rejected = leaveRequests.filter(r => r.status === "rejected").length;

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Leave & Overtime"
        subtitle="Manage and approve workforce time-off requests"
        action={
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition-all"
          >
            <Plus size={14} /> New Request
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={ClipboardList} label="Total Requests"  value={leaveRequests.length} color="indigo" />
        <KpiCard icon={Clock}         label="Pending Review"  value={pending}              color="amber" />
        <KpiCard icon={CheckCircle}   label="Approved"        value={approved}             color="emerald" />
        <KpiCard icon={XCircle}       label="Rejected"        value={rejected}             color="rose" />
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        {/* Filter tabs */}
        <div className="flex items-center gap-2 p-4 border-b border-border overflow-x-auto">
          {(["all","pending","approved","rejected"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all whitespace-nowrap ${filter === f ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
            >
              {f} ({f === "all" ? leaveRequests.length : leaveRequests.filter(r => r.status === f).length})
            </button>
          ))}
        </div>

        <div className="divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <CheckCircle size={32} className="text-emerald-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-foreground">
                {leaveRequests.length === 0 ? "No requests yet" : `No ${filter} requests`}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {leaveRequests.length === 0 ? 'Click "New Request" to submit the first leave request.' : "All clear in this category."}
              </p>
            </div>
          ) : (
            filtered.map(req => (
              <div key={req.id} className="p-5 hover:bg-muted/20 transition-colors">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="flex items-start gap-4">
                    <Avatar initials={req.employee.split(" ").map(n => n[0]).join("").slice(0, 2)} />
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="font-semibold text-foreground">{req.employee}</span>
                        <Badge variant="indigo">{req.type}</Badge>
                        <Badge variant={req.status === "approved" ? "success" : req.status === "rejected" ? "danger" : "warning"}>
                          {req.status === "approved" ? "✓ Approved" : req.status === "rejected" ? "✗ Rejected" : "⏳ Pending"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {req.start} → {req.end} · <strong className="text-foreground">{req.days} day{req.days > 1 ? "s" : ""}</strong>
                      </p>
                      <p className="text-sm text-muted-foreground mt-0.5">{req.reason}</p>
                      <p className="text-xs text-muted-foreground/60 mt-1">Applied: {req.appliedOn} · {req.dept}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 items-center">
                    {req.status === "pending" && (
                      <>
                        <button onClick={() => approveLeave(req.id)}
                          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-all">
                          <CheckCircle size={13} /> Approve
                        </button>
                        <button onClick={() => rejectLeave(req.id)}
                          className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-500 text-white text-sm font-semibold rounded-xl hover:bg-rose-600 transition-all">
                          <X size={13} /> Reject
                        </button>
                      </>
                    )}
                    <button onClick={() => deleteLeave(req.id)}
                      className="p-2 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-950/40 transition-colors" title="Delete">
                      <Trash2 size={14} className="text-rose-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showAdd && (
        <LeaveModal
          onSave={r => { addLeaveRequest(r); setShowAdd(false); }}
          onClose={() => setShowAdd(false)}
        />
      )}
    </div>
  );
}
