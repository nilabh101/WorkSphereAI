// KpiCard — metric card with icon, value, optional change indicator
import type { FC, ElementType } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

interface KpiCardProps {
  icon: ElementType;
  label: string;
  value: string | number;
  change?: number;
  positive?: boolean;
  color?: "indigo" | "emerald" | "amber" | "rose" | "sky" | "violet";
  sub?: string;
}

const colorMap = {
  indigo:  { icon: "text-indigo-600 dark:text-indigo-400",  bg: "bg-indigo-100 dark:bg-indigo-950/50" },
  emerald: { icon: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-100 dark:bg-emerald-950/50" },
  amber:   { icon: "text-amber-600 dark:text-amber-400",    bg: "bg-amber-100 dark:bg-amber-950/50" },
  rose:    { icon: "text-rose-600 dark:text-rose-400",      bg: "bg-rose-100 dark:bg-rose-950/50" },
  sky:     { icon: "text-sky-600 dark:text-sky-400",        bg: "bg-sky-100 dark:bg-sky-950/50" },
  violet:  { icon: "text-violet-600 dark:text-violet-400",  bg: "bg-violet-100 dark:bg-violet-950/50" },
};

export const KpiCard: FC<KpiCardProps> = ({
  icon: Icon,
  label,
  value,
  change,
  positive,
  color = "indigo",
  sub,
}) => {
  const { icon: iconCls, bg } = colorMap[color];
  const isPositive = positive ?? (change !== undefined ? change >= 0 : undefined);

  return (
    <div className="bg-card rounded-2xl p-5 border border-border shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl flex-shrink-0 ${bg}`}>
          <Icon size={18} className={iconCls} />
        </div>
        {change !== undefined && (
          <span
            className={`flex items-center gap-0.5 text-xs font-semibold ${
              isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
            }`}
          >
            {isPositive ? <ArrowUp size={11} /> : <ArrowDown size={11} />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-foreground font-mono tracking-tight">{value}</div>
      <div className="text-sm text-muted-foreground mt-0.5">{label}</div>
      {sub && <div className="text-xs text-muted-foreground/70 mt-1">{sub}</div>}
    </div>
  );
};
