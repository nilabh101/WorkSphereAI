import { useState } from "react";
import { Plus, CheckCircle, XCircle, Clock, ClipboardList, X } from "lucide-react";
import { Avatar } from "@/components/shared/Avatar";
import { Badge } from "@/components/shared/Badge";
import { KpiCard } from "@/components/shared/KpiCard";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { leaveRequests } from "@/data";

export function LeaveOTScreen() {
  const [filter, setFilter] = useState("all");
  const [reqs, setReqs] = useState(leaveRequests);

  const filtered = filter === "all" ? reqs : reqs.filter(r => r.status === filter);

  const approve = (id: number) => setReqs(r => r.map(x => x.id === id ? { ...x, status: "approved" } : x));
  const reject = (id: number) => setReqs(r => r.map(x => x.id === id ? { ...x, status: "rejected" } : x));

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Leave & Overtime"
        subtitle="Manage and approve workforce time-off and overtime requests"
        action={
          <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm hover:bg-primary/90 transition-all">
            <Plus size={14} /> New Request
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard icon={ClipboardList} label="Total Requests" value={reqs.length} color="indigo" />
        <KpiCard icon={Clock} label="Pending Review" value={reqs.filter(r => r.status === "pending").length} color="amber" />
        <KpiCard icon={CheckCircle} label="Approved" value={reqs.filter(r => r.status === "approved").length} color="emerald" />
        <KpiCard icon={XCircle} label="Rejected" value={reqs.filter(r => r.status === "rejected").length} color="rose" />
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        {/* Filter tabs */}
        <div className="flex items-center gap-2 p-4 border-b border-border">
          {["all", "pending", "approved", "rejected"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${filter === f ? "bg-primary text-primary-foreground shadow-sm" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
            >
              {f} {f === "all" ? `(${reqs.length})` : `(${reqs.filter(r => r.status === f).length})`}
            </button>
          ))}
        </div>

        <div className="divide-y divide-border">
          {filtered.map(req => (
            <div key={req.id} className="p-5 hover:bg-muted/20 transition-colors">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-4">
                  <Avatar initials={req.employee.split(" ").map(n => n[0]).join("")} />
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
                  </div>
                </div>
                {req.status === "pending" && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => approve(req.id)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-all"
                    >
                      <CheckCircle size={13} /> Approve
                    </button>
                    <button
                      onClick={() => reject(req.id)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-500 text-white text-sm font-semibold rounded-xl hover:bg-rose-600 transition-all"
                    >
                      <X size={13} /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-16 text-center">
              <CheckCircle size={32} className="text-emerald-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-foreground">All clear</p>
              <p className="text-xs text-muted-foreground mt-1">No {filter} requests at this time</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
