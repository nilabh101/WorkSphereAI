import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, format = "MMM d, yyyy"): string {
  const d = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export function getFatigueColor(score: number): string {
  if (score >= 75) return "text-rose-600 dark:text-rose-400";
  if (score >= 50) return "text-amber-600 dark:text-amber-400";
  return "text-emerald-600 dark:text-emerald-400";
}

export function getFatigueBg(score: number): string {
  if (score >= 75) return "bg-rose-500";
  if (score >= 50) return "bg-amber-400";
  return "bg-emerald-500";
}

export function getFatigueLabel(score: number): string {
  if (score >= 75) return "High Risk";
  if (score >= 50) return "Moderate";
  return "Low Risk";
}

export function getFatigueBadge(score: number): "danger" | "warning" | "success" {
  if (score >= 75) return "danger";
  if (score >= 50) return "warning";
  return "success";
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40",
    inactive: "text-slate-500 bg-slate-100 dark:bg-slate-800",
    "at-risk": "text-rose-600 bg-rose-50 dark:bg-rose-950/40",
    pending: "text-amber-600 bg-amber-50 dark:bg-amber-950/40",
    approved: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40",
    rejected: "text-rose-600 bg-rose-50 dark:bg-rose-950/40",
    critical: "text-rose-700 bg-rose-100 dark:bg-rose-950/60",
    on_leave: "text-sky-600 bg-sky-50 dark:bg-sky-950/40",
  };
  return colors[status] || colors.inactive;
}

export function generateInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function truncate(str: string, length: number): string {
  return str.length > length ? `${str.slice(0, length)}...` : str;
}

export function calculateFatigueScore(params: {
  weeklyHours: number;
  consecutiveShifts: number;
  nightShifts: number;
  overtime: number;
  restGapHours: number;
}): number {
  const { weeklyHours, consecutiveShifts, nightShifts, overtime, restGapHours } = params;
  let score = 0;
  score += Math.min((weeklyHours / 60) * 40, 40);
  score += Math.min(consecutiveShifts * 8, 20);
  score += Math.min(nightShifts * 5, 15);
  score += Math.min((overtime / 10) * 15, 15);
  score += Math.max(0, (8 - restGapHours) * 1.25);
  return Math.min(Math.round(score), 100);
}
