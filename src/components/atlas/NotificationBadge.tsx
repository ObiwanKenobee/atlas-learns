import { useState, useEffect } from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "outcome" | "model" | "gap" | "policy";
  title: string;
  detail: string;
  timestamp: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "outcome",
    title: "New outcome data received",
    detail: "Nairobi wetland flood runoff Q4 measurement: 15.2% reduction",
    timestamp: "2 min ago",
    read: false,
  },
  {
    id: "n2",
    type: "model",
    title: "Model retrain triggered",
    detail: "v4.3 → v4.4 queued — 3 new outcome signals ingested",
    timestamp: "18 min ago",
    read: false,
  },
  {
    id: "n3",
    type: "gap",
    title: "Learning gap escalated",
    detail: "Urban migration counterfactual data still missing after 90d",
    timestamp: "1h ago",
    read: false,
  },
  {
    id: "n4",
    type: "policy",
    title: "Policy pattern validated",
    detail: "Regenerative agriculture + market access now confidence: high",
    timestamp: "3h ago",
    read: true,
  },
];

const typeStyles: Record<string, { dot: string; bg: string; label: string }> = {
  outcome: { dot: "bg-atlas-positive", bg: "bg-atlas-positive/10", label: "Outcome" },
  model: { dot: "bg-atlas-info", bg: "bg-atlas-info/10", label: "Model" },
  gap: { dot: "bg-atlas-negative", bg: "bg-atlas-negative/10", label: "Gap" },
  policy: { dot: "bg-atlas-warning", bg: "bg-atlas-warning/10", label: "Policy" },
};

export function NotificationBadge() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [pulse, setPulse] = useState(true);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Simulate new notification arriving
  useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications((prev) => [
        {
          id: "n-live",
          type: "outcome",
          title: "Live signal received",
          detail: "Oaxaca solar microgrid output exceeded forecast by 8%",
          timestamp: "just now",
          read: false,
        },
        ...prev,
      ]);
      setPulse(true);
    }, 30000);
    return () => clearTimeout(timer);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setPulse(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => { setOpen(!open); if (!open) setPulse(false); }}
        className="relative inline-flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-secondary hover:bg-secondary/80 border border-border transition-all"
        title="Notifications"
      >
        <Bell className="w-3.5 h-3.5 text-muted-foreground" />
        {unreadCount > 0 && (
          <span className={cn(
            "absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full text-[9px] font-mono font-bold flex items-center justify-center bg-atlas-negative text-white",
            pulse && "animate-pulse-subtle"
          )}>
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 sm:w-80 rounded-lg border border-border bg-card shadow-xl z-[60] overflow-hidden animate-fade-in-up">
          <div className="flex items-center justify-between px-3 py-2 border-b border-border">
            <span className="text-xs font-semibold text-foreground">Notifications</span>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-[10px] text-primary hover:underline">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "px-3 py-2.5 border-b border-border/50 transition-colors",
                  !n.read && "bg-primary/5"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", typeStyles[n.type].dot)} />
                  <span className={cn("text-[9px] font-mono px-1.5 py-0.5 rounded", typeStyles[n.type].bg, "text-foreground")}>
                    {typeStyles[n.type].label}
                  </span>
                  <span className="text-[9px] text-muted-foreground ml-auto">{n.timestamp}</span>
                </div>
                <p className="text-[11px] font-medium text-foreground leading-tight">{n.title}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug">{n.detail}</p>
              </div>
            ))}
          </div>
          <div className="px-3 py-2 border-t border-border text-center">
            <span className="text-[10px] text-muted-foreground">End of notifications</span>
          </div>
        </div>
      )}
    </div>
  );
}
