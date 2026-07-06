import type { ElementType } from "react";
import { AlertTriangle, Info, CheckCircle, AlertCircle, Sparkles, Trash2, Bell } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { useStore } from "@/store";

const iconMap: Record<string, ElementType> = {
  alert:   AlertTriangle,
  info:    Info,
  success: CheckCircle,
  warning: AlertCircle,
  ai:      Sparkles,
  error:   AlertTriangle,
};

const colorMap: Record<string, string> = {
  alert:   "text-rose-500 bg-rose-50 dark:bg-rose-950/40",
  error:   "text-rose-500 bg-rose-50 dark:bg-rose-950/40",
  info:    "text-sky-500 bg-sky-50 dark:bg-sky-950/40",
  success: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40",
  warning: "text-amber-500 bg-amber-50 dark:bg-amber-950/40",
  ai:      "text-violet-500 bg-violet-50 dark:bg-violet-950/40",
};

const priorityDot: Record<string, string> = {
  high:   "bg-rose-500",
  medium: "bg-amber-500",
  low:    "bg-emerald-500",
};

export function NotificationsScreen() {
  const { notifications, markNotifRead, markAllNotifsRead, deleteNotification } = useStore();

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Notifications"
        subtitle={unread > 0 ? `${unread} unread notification${unread !== 1 ? "s" : ""}` : "All caught up"}
        action={
          unread > 0 ? (
            <button
              onClick={markAllNotifsRead}
              className="text-sm text-primary hover:underline font-semibold"
            >
              Mark all as read
            </button>
          ) : undefined
        }
      />

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        {notifications.length === 0 ? (
          <div className="py-20 text-center">
            <Bell size={32} className="text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm font-semibold text-foreground">No notifications</p>
            <p className="text-xs text-muted-foreground mt-1">
              Notifications appear here when you approve/reject leave, add employees, or other actions occur.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map(notif => {
              const Icon = iconMap[notif.type] ?? Info;
              return (
                <div
                  key={notif.id}
                  className={`p-5 flex items-start gap-4 hover:bg-muted/20 transition-colors ${!notif.read ? "bg-primary/3 dark:bg-primary/5" : ""}`}
                >
                  <button
                    onClick={() => markNotifRead(notif.id)}
                    className={`p-2.5 rounded-xl flex-shrink-0 ${colorMap[notif.type] ?? colorMap.info} cursor-pointer`}
                    title="Mark as read"
                  >
                    <Icon size={16} />
                  </button>

                  <div className="flex-1 min-w-0" onClick={() => markNotifRead(notif.id)} role="button">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className={`text-sm font-semibold ${!notif.read ? "text-foreground" : "text-muted-foreground"}`}>
                        {notif.title}
                      </span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className={`w-1.5 h-1.5 rounded-full ${priorityDot[notif.priority] ?? priorityDot.low}`} title={`${notif.priority} priority`} />
                        <span className="text-xs text-muted-foreground">{notif.time}</span>
                        {!notif.read && <div className="w-2 h-2 bg-primary rounded-full" />}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{notif.message}</p>
                  </div>

                  <button
                    onClick={() => deleteNotification(notif.id)}
                    className="p-2 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-950/40 flex-shrink-0 transition-colors"
                    title="Dismiss"
                  >
                    <Trash2 size={13} className="text-rose-400" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
