"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const redirectUrl = formData.get("redirectUrl") as string || "/dashboard";

  const result = authSchema.safeParse({ email, password });
  if (!result.success) {
    return { error: "Invalid email or password format." };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  const safeRedirect = redirectUrl.startsWith('/') ? redirectUrl : '/dashboard';
  redirect(safeRedirect);
}

export async function signup(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const phone = formData.get("phone") as string;
  const redirectUrl = formData.get("redirectUrl") as string || "/dashboard";
  
  if (!fullName) {
    return { error: "Full Name is required." };
  }
  if (!phone) {
    return { error: "Phone number is required." };
  }

  const result = authSchema.safeParse({ email, password });
  if (!result.success) {
    return { error: "Invalid email or password format. Password must be at least 6 characters." };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    // @ts-ignore
    await supabase.from("profiles").update({ phone }).eq("id", data.user.id);
  }

  revalidatePath("/", "layout");
  
  // Ensure redirectUrl is safe (relative path starting with '/')
  const safeRedirect = redirectUrl.startsWith('/') ? redirectUrl : '/dashboard';
  redirect(safeRedirect);
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function resetPasswordForEmail(formData: FormData) {
  const email = formData.get("email") as string;
  if (!email) return { error: "Email is required." };

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }
  return { success: true };
}

export async function updatePassword(formData: FormData) {
  const password = formData.get("password") as string;
  if (!password || password.length < 6) return { error: "Password must be at least 6 characters." };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { error: error.message };
  }
  
  redirect("/dashboard");
}
