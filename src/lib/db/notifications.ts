import { createClient } from "@/lib/supabase/server";
import { isServiceRoleConfigured } from "@/lib/env";
import { Database } from "@/lib/supabase/types";

type Notification = Database["public"]["Tables"]["notifications"]["Row"];

export async function getNotifications(userId: string): Promise<Notification[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
  return data;
}

/**
 * Writes a notification on behalf of a (possibly different) user. Requires
 * the service-role client since RLS has no public INSERT policy for
 * notifications (they're written cross-user, e.g. a provider accepting a
 * job notifies the customer). No-ops quietly if the service role key isn't
 * configured yet, so this never blocks the primary action it's called from.
 */
export async function createNotification(userId: string, title: string, body?: string, link?: string) {
  if (!isServiceRoleConfigured) return;

  try {
    const { createAdminClient } = await import("@/lib/supabase/admin");
    const admin = createAdminClient();
    const { error } = await admin.from("notifications").insert({
      user_id: userId,
      title,
      body: body ?? null,
      link: link ?? null,
    } as any);
    if (error) console.error("Error creating notification:", error);
  } catch (err) {
    console.error("Error creating notification:", err);
  }
}
