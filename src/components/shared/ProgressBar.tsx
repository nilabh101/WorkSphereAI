// ProgressBar — percentage fill bar with automatic color based on value
import type { FC } from "react";

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: "indigo" | "emerald" | "amber" | "rose" | "sky" | "auto";
  className?: string;
}

const colorMap = {
  indigo:  "bg-indigo-500",
  emerald: "bg-emerald-500",
  amber:   "bg-amber-500",
  rose:    "bg-rose-500",
  sky:     "bg-sky-500",
};

export const ProgressBar: FC<ProgressBarProps> = ({
  value,
  max = 100,
  color = "auto",
  className = "",
}) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  let barColor: string;
  if (color === "auto") {
    if (pct >= 80) barColor = "bg-rose-500";
    else if (pct >= 60) barColor = "bg-amber-500";
    else barColor = "bg-emerald-500";
  } else {
    barColor = colorMap[color];
  }

  return (
    <div
      className={`w-full h-1.5 bg-muted rounded-full overflow-hidden ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full ${barColor} rounded-full transition-all duration-500`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};
