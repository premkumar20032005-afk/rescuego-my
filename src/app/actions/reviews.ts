"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export async function submitReview(requestId: string, rating: number, comment?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "You must be logged in to leave a review." };

  const result = reviewSchema.safeParse({ rating, comment });
  if (!result.success) {
    return { error: result.error.issues[0]?.message || "Invalid review." };
  }

  const { data: request } = await supabase
    .from("requests")
    .select("customer_id, status")
    .eq("id", requestId)
    .single() as any;

  if (!request || request.customer_id !== user.id) {
    return { error: "You can only review your own requests." };
  }
  if (request.status !== "completed") {
    return { error: "You can only review a completed request." };
  }

  const { error } = await supabase.from("reviews").insert({
    request_id: requestId,
    rating: result.data.rating,
    comment: result.data.comment || null,
  } as any);

  if (error) {
    if (error.code === "23505") {
      return { error: "You've already reviewed this request." };
    }
    console.error("Error submitting review:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard/history");
  return { success: true };
}
