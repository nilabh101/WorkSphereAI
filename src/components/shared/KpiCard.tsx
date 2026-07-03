import type { ElementType } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface KpiCardProps {
  icon: ElementType;
  label: string;
  value: string | number;
  change?: number;
  positive?: boolean;
  color?: string;
}

export function KpiCard({ icon: Icon, label, value, change, positive, color = "indigo" }: KpiCardProps) {
  const iconColors: Record<string, string> = {
    indigo: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
    rose: "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400",
    violet: "bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400",
  };

  return (
    <div className="bg-card rounded-2xl p-5 border border-border shadow-sm hover:shadow-md transition-all duration-200 cursor-default group">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${iconColors[color] ?? iconColors.indigo}`}>
          <Icon size={18} />
        </div>
        {change !== undefined && (
          <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-lg ${
            positive
              ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
              : "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400"
          }`}>
            {positive ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
            {change}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-foreground mb-0.5 group-hover:text-primary transition-colors">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
