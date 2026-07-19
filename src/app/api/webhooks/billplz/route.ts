import { NextRequest, NextResponse } from "next/server";
import { verifyXSignature } from "@/lib/billplz";
import { createAdminClient } from "@/lib/supabase/admin";
import { createNotification } from "@/lib/db/notifications";
import { isPaymentsConfigured } from "@/lib/env";

export async function POST(request: NextRequest) {
  if (!isPaymentsConfigured) {
    return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
  }

  const formData = await request.formData();
  const params: Record<string, string> = {};
  formData.forEach((value, key) => {
    params[key] = String(value);
  });

  const signature = params["x_signature"];
  if (!signature || !verifyXSignature(params, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const billId = params["id"];
  const paid = params["paid"] === "true";

  const admin = createAdminClient();

  const { data: payment } = await admin
    .from("payments")
    .select("id, request_id")
    .eq("billplz_bill_id", billId)
    .maybeSingle();

  if (!payment) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  await admin
    .from("payments")
    .update({
      status: paid ? "paid" : "failed",
      paid_at: paid ? new Date().toISOString() : null,
    })
    .eq("id", payment.id);

  const { data: req } = await admin
    .from("requests")
    .select("customer_id")
    .eq("id", payment.request_id)
    .maybeSingle();

  if (req?.customer_id) {
    await createNotification(
      req.customer_id,
      paid ? "Payment received" : "Payment failed",
      paid ? "Thanks for your payment. Your request is now fully settled." : "Your payment did not go through. Please try again.",
      "/dashboard/history"
    );
  }

  return NextResponse.json({ received: true });
}
