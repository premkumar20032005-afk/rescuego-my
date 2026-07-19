"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { submitReview } from "@/app/actions/reviews";

export function ReviewDialog({ requestId, trigger }: { requestId: string; trigger: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    if (rating === 0) {
      toast.error("Please select a star rating.");
      return;
    }
    setIsSubmitting(true);
    const result = await submitReview(requestId, rating, comment);
    setIsSubmitting(false);

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Thanks for your feedback!");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)}>{trigger}</div>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave a Review</DialogTitle>
          <DialogDescription>How was your experience with this service?</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1"
              >
                <Star
                  className={`w-8 h-8 ${
                    star <= (hoverRating || rating) ? "fill-amber-400 text-amber-400" : "text-slate-300"
                  }`}
                />
              </button>
            ))}
          </div>
          <div className="space-y-2">
            <Label htmlFor="comment">Comment (optional)</Label>
            <Textarea
              id="comment"
              placeholder="Tell us more about your experience..."
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
