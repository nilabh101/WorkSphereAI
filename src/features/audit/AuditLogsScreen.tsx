import { useState, useMemo } from "react";
import { Search, Download, FileText } from "lucide-react";
import { Avatar } from "@/components/shared/Avatar";
import { Badge } from "@/components/shared/Badge";
import { SectionHeader } from "@/components/shared/SectionHeader";
import type { BadgeVariant } from "@/components/shared/Badge";
import { useStore } from "@/store";

const typeStyle: Record<string, BadgeVariant> = {
  approval: "success",
  ai:       "indigo",
  update:   "info",
  security: "danger",
  export:   "warning",
  request:  "default",
  acknowledgment: "default",
  login:    "default",
};

const TYPE_FILTERS = ["all", "approval", "ai", "update", "security", "export", "request", "login"];

function exportCSV(rows: ReturnType<typeof useStore>["auditLogs"]) {
  const header = "ID,User,Action,Target,Type,Timestamp\n";
  const body = rows.map(r =>
    `"${r.id}","${r.user}","${r.action}","${r.target}","${r.type}","${r.time}"`
  ).join("\n");
  const blob = new Blob([header + body], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = "audit_logs.csv"; a.click();
  URL.revokeObjectURL(url);
}

export function AuditLogsScreen() {
  const { auditLogs } = useStore();

  const [search, setSearch]       = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filtered = useMemo(() => {
    let rows = auditLogs;
    if (typeFilter !== "all") rows = rows.filter(r => r.type === typeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      rows = rows.filter(r =>
        r.user.toLowerCase().includes(q) ||
        r.action.toLowerCase().includes(q) ||
        r.target.toLowerCase().includes(q)
      );
    }
    return rows;
  }, [auditLogs, search, typeFilter]);

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Audit Logs"
        subtitle="Immutable activity trail with timestamps and actor attribution"
        action={
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search logs…"
                className="pl-9 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 w-52"
              />
            </div>
            <button
              onClick={() => exportCSV(filtered)}
              className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl text-sm font-semibold hover:bg-muted/50 transition-all"
            >
              <Download size={13} /> Export CSV
            </button>
          </div>
        }
      />

      {/* Type filters */}
      <div className="flex gap-2 flex-wrap">
        {TYPE_FILTERS.map(f => (
          <button key={f} onClick={() => setTypeFilter(f)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${typeFilter === f ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted"}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        {auditLogs.length === 0 ? (
          <div className="py-20 text-center">
            <FileText size={32} className="text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm font-semibold text-foreground">No audit logs yet</p>
            <p className="text-xs text-muted-foreground mt-1">
              Logs are automatically generated as you add employees, approve leave, and perform other actions.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-muted-foreground">No logs match your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-border bg-muted/20">
                  {["Actor", "Action", "Target", "Type", "Timestamp"].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map(log => (
                  <tr key={log.id} className="hover:bg-muted/15 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <Avatar initials={log.user.split(" ").map(n => n[0]).join("").slice(0, 2) || "SY"} size="sm" color="indigo" />
                        <span className="text-sm font-semibold text-foreground">{log.user}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-muted-foreground">{log.action}</td>
                    <td className="px-5 py-4 text-sm text-foreground max-w-[220px] truncate">{log.target}</td>
                    <td className="px-5 py-4">
                      <Badge variant={typeStyle[log.type] ?? "default"}>{log.type}</Badge>
                    </td>
                    <td className="px-5 py-4 text-xs text-muted-foreground font-mono">{log.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {filtered.length > 0 && (
        <p className="text-xs text-muted-foreground text-right">
          Showing {filtered.length} of {auditLogs.length} log{auditLogs.length !== 1 ? "s" : ""}
        </p>
      )}
    </div>
  );
}
