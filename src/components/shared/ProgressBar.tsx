interface ProgressBarProps {
  value: number;
  color?: string;
}

export function ProgressBar({ value, color = "indigo" }: ProgressBarProps) {
  const colors: Record<string, string> = {
    indigo: "bg-indigo-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-400",
    rose: "bg-rose-500",
  };

  const autoColor = value > 75 ? "bg-rose-500" : value > 50 ? "bg-amber-400" : "bg-emerald-500";
  const chosen = color === "auto" ? autoColor : (colors[color] ?? colors.indigo);

  return (
    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ${chosen}`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}
