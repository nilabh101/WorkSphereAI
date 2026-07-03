import { useState } from "react";
import type { ElementType } from "react";
import { AlertTriangle, Info, CheckCircle, AlertCircle } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { notifications as initialNotifications } from "@/data";

export function NotificationsScreen() {
  const [notifs, setNotifs] = useState(initialNotifications);

  const iconMap: Record<string, ElementType> = {
    alert: AlertTriangle,
    info: Info,
    success: CheckCircle,
    warning: AlertCircle,
  };

  const colorMap: Record<string, string> = {
    alert: "text-rose-500 bg-rose-50 dark:bg-rose-950/40",
    info: "text-sky-500 bg-sky-50 dark:bg-sky-950/40",
    success: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40",
    warning: "text-amber-500 bg-amber-50 dark:bg-amber-950/40",
  };

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Notifications"
        subtitle={`${notifs.filter(n => !n.read).length} unread notifications`}
        action={
          <button
            onClick={() => setNotifs(n => n.map(x => ({ ...x, read: true })))}
            className="text-sm text-primary hover:underline font-semibold"
          >
            Mark all as read
          </button>
        }
      />

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden divide-y divide-border">
        {notifs.map(notif => {
          const Icon = iconMap[notif.type];
          return (
            <div
              key={notif.id}
              className={`p-5 flex items-start gap-4 hover:bg-muted/20 transition-colors cursor-pointer ${!notif.read ? "bg-primary/3 dark:bg-primary/5" : ""}`}
              onClick={() => setNotifs(n => n.map(x => x.id === notif.id ? { ...x, read: true } : x))}
            >
              <div className={`p-2.5 rounded-xl flex-shrink-0 ${colorMap[notif.type]}`}>
                <Icon size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className={`text-sm font-semibold ${!notif.read ? "text-foreground" : "text-muted-foreground"}`}>
                    {notif.title}
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-muted-foreground">{notif.time}</span>
                    {!notif.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{notif.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
