"use server";

import { createClient } from "@/lib/supabase/server";
import { updateProfile } from "@/lib/db/profiles";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const myPhoneRegex = /^\+60\d{8,10}$/;

const profileSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters."),
  phone: z.string().regex(myPhoneRegex, "Must be a valid Malaysian number (e.g. +60123456789)"),
});

export async function updateProfileAction(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized." };

  const result = profileSchema.safeParse({
    full_name: formData.get("full_name"),
    phone: formData.get("phone"),
  });

  if (!result.success) {
    return { error: result.error.issues[0]?.message || "Invalid profile details." };
  }

  try {
    await updateProfile(user.id, result.data);
  } catch (error: any) {
    return { error: error.message || "Failed to update profile." };
  }

  revalidatePath("/dashboard/profile");
  return { success: true };
}
