// SectionHeader — page-level title + subtitle + optional action slot
import type { FC, ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export const SectionHeader: FC<SectionHeaderProps> = ({ title, subtitle, action }) => (
  <div className="flex items-start justify-between gap-4">
    <div>
      <h1 className="text-xl font-bold text-foreground">{title}</h1>
      {subtitle && (
        <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
      )}
    </div>
    {action && (
      <div className="flex items-center gap-2 flex-shrink-0">{action}</div>
    )}
  </div>
);
