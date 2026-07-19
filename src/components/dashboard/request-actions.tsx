"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Star } from "lucide-react";
import { toast } from "sonner";
import { cancelRequest } from "@/app/actions/requests";
import { createPaymentForRequest } from "@/app/actions/payments";
import { ReviewDialog } from "@/components/dashboard/review-dialog";

type Review = { rating: number; comment: string | null } | null;

export function RequestActions({
  requestId,
  status,
  paymentStatus,
  review,
}: {
  requestId: string;
  status: string;
  paymentStatus: "none" | "pending" | "paid";
  review: Review;
}) {
  const [isCancelling, setIsCancelling] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  async function handleCancel() {
    setIsCancelling(true);
    const result = await cancelRequest(requestId);
    setIsCancelling(false);

    if (result?.error) {
      toast.error(result.error);
      return;
    }
    toast.success("Request cancelled.");
  }

  async function handlePay() {
    setIsPaying(true);
    const result = await createPaymentForRequest(requestId);
    setIsPaying(false);

    if (result?.error) {
      toast.error(result.error);
      return;
    }
    if (result?.url) {
      window.location.href = result.url;
    }
  }

  if (status === "pending") {
    return (
      <Button
        variant="outline"
        size="sm"
        className="mt-4 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
        onClick={handleCancel}
        disabled={isCancelling}
      >
        {isCancelling ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
        Cancel Request
      </Button>
    );
  }

  if (status === "completed") {
    return (
      <div className="mt-4 flex flex-col items-end gap-2">
        {paymentStatus === "paid" ? (
          <Badge variant="outline" className="text-emerald-600 border-emerald-300">Paid</Badge>
        ) : (
          <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-slate-900" onClick={handlePay} disabled={isPaying}>
            {isPaying ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            Pay Now
          </Button>
        )}

        {review ? (
          <div className="flex items-center gap-1 text-amber-500">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className={`w-4 h-4 ${star <= review.rating ? "fill-amber-400" : "text-slate-300"}`} />
            ))}
          </div>
        ) : (
          <ReviewDialog
            requestId={requestId}
            trigger={<Button variant="outline" size="sm">Leave a Review</Button>}
          />
        )}
      </div>
    );
  }

  return null;
}
