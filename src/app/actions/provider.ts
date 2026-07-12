"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function acceptRequest(requestId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("requests")
    // @ts-ignore
    .update({ 
      provider_id: user.id, 
      status: "accepted",
      accepted_at: new Date().toISOString()
    })
    .eq("id", requestId);

  if (error) {
    console.error("Error accepting request:", error);
    return { error: error.message };
  }

  await supabase.from("request_status_events").insert({
    request_id: requestId,
    status: "accepted"
  } as any);

  revalidatePath("/provider");
  revalidatePath("/provider/active");
  return { success: true };
}

export async function updateRequestStatus(requestId: string, status: 'en_route' | 'arrived' | 'in_progress' | 'completed' | 'cancelled') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const updates: any = { status };
  if (status === "completed") {
    updates.completed_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("requests")
    // @ts-ignore
    .update(updates)
    .eq("id", requestId)
    .eq("provider_id", user.id); // Ensure they own it

  if (error) {
    console.error("Error updating status:", error);
    return { error: error.message };
  }

  // Also log the status event
  await supabase.from("request_status_events").insert({
    request_id: requestId,
    status: status
  } as any);

  revalidatePath("/provider/active");
  revalidatePath("/provider/history");
  return { success: true };
}

export async function upgradeToProvider() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  // @ts-ignore
  const { error } = await supabase
    .from("profiles")
    // @ts-ignore
    .update({ role: "provider" })
    .eq("id", user.id);

  if (error) {
    console.error("Error upgrading to provider:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard/profile");
  return { success: true };
}

export async function submitProviderApplication(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const serviceType = formData.get("serviceType") as string;
  const city = formData.get("city") as string;
  
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("provider_applications")
    .insert({
      name,
      phone,
      service_type: serviceType,
      city,
      user_id: user?.id || null
    } as any);

  if (error) {
    console.error("Error submitting application:", error);
    return { error: error.message };
  }

  return { success: true };
}
