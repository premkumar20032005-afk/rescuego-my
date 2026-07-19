"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

export async function submitContactMessage(formData: FormData) {
  const result = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!result.success) {
    return { error: result.error.issues[0]?.message || "Invalid input." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").insert(result.data as any);

  if (error) {
    console.error("Error submitting contact message:", error);
    return { error: "Failed to send your message. Please try again." };
  }

  return { success: true };
}
