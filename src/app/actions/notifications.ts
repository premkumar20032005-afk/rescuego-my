"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function markNotificationRead(notificationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("notifications")
    // @ts-ignore
    .update({ read: true })
    .eq("id", notificationId)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error marking notification read:", error);
    return { error: error.message };
  }

  return { success: true };
}

export async function markAllNotificationsRead() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("notifications")
    // @ts-ignore
    .update({ read: true })
    .eq("user_id", user.id)
    .eq("read", false);

  if (error) {
    console.error("Error marking notifications read:", error);
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  return { success: true };
}
