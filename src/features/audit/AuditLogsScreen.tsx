import { Search, Download } from "lucide-react";
import { Avatar } from "@/components/shared/Avatar";
import { Badge } from "@/components/shared/Badge";
import { SectionHeader } from "@/components/shared/SectionHeader";
import type { BadgeVariant } from "@/components/shared/Badge";
import { auditLogs } from "@/data";

const typeStyle: Record<string, BadgeVariant> = {
  approval: "success",
  ai: "indigo",
  update: "info",
  security: "danger",
  export: "warning",
  request: "default",
  acknowledgment: "default",
};

export function AuditLogsScreen() {
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
                placeholder="Search logs…"
                className="pl-9 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 w-52"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-xl text-sm hover:bg-muted/50 transition-all">
              <Download size={13} /> Export CSV
            </button>
          </div>
        }
      />

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/20">
              {["Actor", "Action", "Target", "Type", "Timestamp"].map(h => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-bold text-muted-foreground uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {auditLogs.map(log => (
              <tr key={log.id} className="hover:bg-muted/15 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <Avatar initials={log.user.split(" ").map(n => n[0]).join("").slice(0, 2) || "SY"} size="sm" color="indigo" />
                    <span className="text-sm font-semibold text-foreground">{log.user}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-muted-foreground">{log.action}</td>
                <td className="px-5 py-4 text-sm text-foreground">{log.target}</td>
                <td className="px-5 py-4">
                  <Badge variant={typeStyle[log.type] ?? "default"}>{log.type}</Badge>
                </td>
                <td className="px-5 py-4 text-sm text-muted-foreground font-mono text-xs">{log.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
