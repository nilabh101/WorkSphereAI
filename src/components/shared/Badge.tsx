import React from "react";

export type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "indigo" | "violet";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

export function Badge({ children, variant = "default" }: BadgeProps) {
  const v: Record<BadgeVariant, string> = {
    default: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
    success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    warning: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    danger: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
    info: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-400",
    indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300",
    violet: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${v[variant]}`}>
      {children}
    </span>
  );
}
