// Avatar — initials-based avatar with color variants
import type { FC } from "react";

interface AvatarProps {
  initials: string;
  size?: "xs" | "sm" | "md" | "lg";
  color?: "indigo" | "rose" | "amber" | "emerald" | "sky" | "violet" | "auto";
}

const sizeMap = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
};

const colorMap = {
  indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300",
  rose: "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
  emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
  sky: "bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300",
  violet: "bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300",
};

const autoColors = [
  "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300",
  "bg-sky-100 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300",
  "bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300",
  "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300",
];

export const Avatar: FC<AvatarProps> = ({ initials, size = "md", color = "auto" }) => {
  const sizeClass = sizeMap[size];
  let colorClass: string;

  if (color === "auto") {
    const idx = (initials.charCodeAt(0) + (initials.charCodeAt(1) || 0)) % autoColors.length;
    colorClass = autoColors[idx];
  } else {
    colorClass = colorMap[color];
  }

  return (
    <div
      className={`${sizeClass} ${colorClass} rounded-full flex items-center justify-center font-bold flex-shrink-0 select-none`}
      aria-label={`Avatar for ${initials}`}
    >
      {initials.slice(0, 2).toUpperCase()}
    </div>
  );
};
