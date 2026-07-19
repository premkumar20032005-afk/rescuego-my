"use server";

import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/db/profiles";
import { createNotification } from "@/lib/db/notifications";
import { revalidatePath } from "next/cache";

export async function approveProviderApplication(applicationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const profile = await getProfile(user.id);
  if (profile?.role !== "admin") return { error: "Unauthorized" };

  const { data: application, error: fetchError } = await supabase
    .from("provider_applications")
    .select("*")
    .eq("id", applicationId)
    .single() as any;

  if (fetchError || !application) {
    return { error: "Application not found." };
  }

  const { error } = await supabase
    .from("provider_applications")
    // @ts-ignore
    .update({ status: "approved" })
    .eq("id", applicationId);

  if (error) {
    console.error("Error approving application:", error);
    return { error: error.message };
  }

  if (application.user_id) {
    await supabase
      .from("profiles")
      // @ts-ignore
      .update({ role: "provider" })
      .eq("id", application.user_id);

    await createNotification(
      application.user_id,
      "Your provider application was approved!",
      "You now have access to the Provider Hub to start accepting jobs.",
      "/provider"
    );
  }

  revalidatePath("/admin/applications");
  return { success: true };
}

export async function rejectProviderApplication(applicationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const profile = await getProfile(user.id);
  if (profile?.role !== "admin") return { error: "Unauthorized" };

  const { data: application } = await supabase
    .from("provider_applications")
    .select("user_id")
    .eq("id", applicationId)
    .single() as any;

  const { error } = await supabase
    .from("provider_applications")
    // @ts-ignore
    .update({ status: "rejected" })
    .eq("id", applicationId);

  if (error) {
    console.error("Error rejecting application:", error);
    return { error: error.message };
  }

  if (application?.user_id) {
    await createNotification(
      application.user_id,
      "Your provider application was not approved",
      "You can reach out to support if you have questions.",
      "/dashboard/profile"
    );
  }

  revalidatePath("/admin/applications");
  return { success: true };
}
