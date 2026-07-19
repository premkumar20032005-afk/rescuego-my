"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createBill } from "@/lib/billplz";
import { env, isPaymentsConfigured } from "@/lib/env";

export async function createPaymentForRequest(requestId: string) {
  if (!isPaymentsConfigured) {
    return { error: "Payments are not configured yet. Please contact support." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "You must be logged in to pay." };

  const { data: request } = await supabase
    .from("requests")
    .select("id, customer_id, status, final_amount, service_categories(name, base_price_min, base_price_max)")
    .eq("id", requestId)
    .single() as any;

  if (!request || request.customer_id !== user.id) {
    return { error: "Request not found." };
  }
  if (request.status !== "completed") {
    return { error: "This request isn't completed yet." };
  }

  const admin = createAdminClient();

  const { data: existingPayment } = await admin
    .from("payments")
    .select("*")
    .eq("request_id", requestId)
    .maybeSingle() as any;

  if (existingPayment?.status === "paid") {
    return { error: "This request has already been paid." };
  }

  const amount =
    request.final_amount ??
    (request.service_categories?.base_price_min && request.service_categories?.base_price_max
      ? (request.service_categories.base_price_min + request.service_categories.base_price_max) / 2
      : 100);

  const siteUrl = env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  try {
    const bill = await createBill({
      email: user.email || "customer@example.com",
      name: user.user_metadata?.full_name || "RescueGO Customer",
      amount,
      description: `RescueGO MY - ${request.service_categories?.name ?? "Service"} (Request ${requestId.slice(0, 8)})`,
      callbackUrl: `${siteUrl}/api/webhooks/billplz`,
      redirectUrl: `${siteUrl}/dashboard/history?payment=pending`,
    });

    if (existingPayment) {
      await admin
        .from("payments")
        // @ts-ignore
        .update({ amount, billplz_bill_id: bill.id, billplz_collection_id: bill.collection_id, status: "pending" })
        .eq("id", existingPayment.id);
    } else {
      await admin.from("payments").insert({
        request_id: requestId,
        amount,
        billplz_bill_id: bill.id,
        billplz_collection_id: bill.collection_id,
        status: "pending",
      } as any);
    }

    return { success: true, url: bill.url };
  } catch (err: any) {
    console.error("Error creating Billplz bill:", err);
    return { error: "Failed to start payment. Please try again." };
  }
}
