"use server";

import { updateProfile } from "@/lib/db/profiles";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const myPhoneRegex = /^\+60\d{8,10}$/;

const onboardingSchema = z.object({
  phone: z.string().regex(myPhoneRegex, "Must be a valid Malaysian number (e.g. +60123456789)"),
  userId: z.string().uuid(),
});

export async function completeOnboarding(formData: FormData) {
  const phone = formData.get("phone") as string;
  const userId = formData.get("userId") as string;

  const result = onboardingSchema.safeParse({ phone, userId });
  if (!result.success) {
    return { error: "Invalid phone number format." };
  }

  // Check auth
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || user.id !== userId) {
    return { error: "Unauthorized." };
  }

  try {
    await updateProfile(userId, { phone: result.data.phone });
  } catch (error: any) {
    return { error: error.message || "Failed to update profile." };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
