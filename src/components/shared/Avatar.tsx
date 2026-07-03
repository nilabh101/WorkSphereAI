export type AvatarColor = "indigo" | "emerald" | "rose" | "amber" | "violet";

interface AvatarProps {
  initials: string;
  size?: "sm" | "md" | "lg";
  color?: AvatarColor;
}

export function Avatar({ initials, size = "md", color = "indigo" }: AvatarProps) {
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-9 h-9 text-sm", lg: "w-12 h-12 text-base" };
  const colors: Record<AvatarColor, string> = {
    indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300",
    emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
    rose: "bg-rose-100 text-rose-700 dark:bg-rose-900/50 dark:text-rose-300",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
    violet: "bg-violet-100 text-violet-700 dark:bg-violet-900/50 dark:text-violet-300",
  };

  return (
    <div className={`${sizes[size]} ${colors[color]} rounded-xl flex items-center justify-center font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
}
