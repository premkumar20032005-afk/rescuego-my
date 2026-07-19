"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/types";
import { markAllNotificationsRead, markNotificationRead } from "@/app/actions/notifications";
import { formatDistanceToNow } from "date-fns";

type Notification = Database["public"]["Tables"]["notifications"]["Row"];

export function NotificationBell({ userId, triggerClassName }: { userId: string; triggerClassName?: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    let active = true;

    supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => {
        if (active && data) setNotifications(data);
      });

    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev]);
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  async function handleItemClick(notification: Notification) {
    if (!notification.read) {
      setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)));
      await markNotificationRead(notification.id);
    }
    if (notification.link) router.push(notification.link);
  }

  async function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await markAllNotificationsRead();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className={`relative ${triggerClassName ?? ""}`}>
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-4 min-w-4 px-1 justify-center bg-destructive text-destructive-foreground">
                {unreadCount > 9 ? "9+" : unreadCount}
              </Badge>
            )}
            <span className="sr-only">Notifications</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-80">
        <div className="flex items-center justify-between px-1.5 py-1">
          <DropdownMenuLabel className="px-0 py-0">Notifications</DropdownMenuLabel>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs text-primary hover:underline"
            >
              Mark all read
            </button>
          )}
        </div>
        <DropdownMenuSeparator />
        {notifications.length === 0 ? (
          <p className="px-1.5 py-4 text-sm text-center text-muted-foreground">No notifications yet.</p>
        ) : (
          <div className="max-h-80 overflow-y-auto">
            {notifications.map((n) => (
              <DropdownMenuItem
                key={n.id}
                className="flex-col items-start gap-0.5 py-2"
                onClick={() => handleItemClick(n)}
              >
                <div className="flex items-center gap-2 w-full">
                  {!n.read && <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
                  <span className="font-medium text-sm">{n.title}</span>
                </div>
                {n.body && <p className="text-xs text-muted-foreground pl-3.5">{n.body}</p>}
                <p className="text-xs text-muted-foreground/70 pl-3.5">
                  {formatDistanceToNow(new Date(n.created_at))} ago
                </p>
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
