"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateRequestStatus } from "@/app/actions/provider";
import { toast } from "sonner";
import { Loader2, Navigation, MapPin, CheckCircle, XCircle, Wrench } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type RequestStatus = 'pending' | 'accepted' | 'dispatched' | 'en_route' | 'arrived' | 'in_progress' | 'completed' | 'cancelled';

export function UpdateStatusButtons({ requestId, currentStatus }: { requestId: string, currentStatus: RequestStatus }) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [finalAmount, setFinalAmount] = useState("");

  const handleUpdate = async (status: RequestStatus, amount?: number) => {
    setIsLoading(status);
    const result = await updateRequestStatus(requestId, status as any, amount);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`Status updated to ${status.replace("_", " ")}`);
    }
    setIsLoading(null);
  };

  const handleComplete = async () => {
    const amount = parseFloat(finalAmount);
    await handleUpdate('completed', Number.isFinite(amount) && amount > 0 ? amount : undefined);
    setCompleteDialogOpen(false);
  };

  return (
    <div className="flex flex-wrap gap-2 w-full">
      {currentStatus === 'accepted' && (
        <Button
          className="flex-1 min-w-[120px] bg-blue-600 hover:bg-blue-700"
          onClick={() => handleUpdate('en_route')}
          disabled={isLoading !== null}
        >
          {isLoading === 'en_route' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Navigation className="w-4 h-4 mr-2" />}
          Mark En Route
        </Button>
      )}

      {currentStatus === 'en_route' && (
        <Button
          className="flex-1 min-w-[120px] bg-indigo-600 hover:bg-indigo-700"
          onClick={() => handleUpdate('arrived')}
          disabled={isLoading !== null}
        >
          {isLoading === 'arrived' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <MapPin className="w-4 h-4 mr-2" />}
          Mark Arrived
        </Button>
      )}

      {currentStatus === 'arrived' && (
        <Button
          className="flex-1 min-w-[120px] bg-purple-600 hover:bg-purple-700"
          onClick={() => handleUpdate('in_progress')}
          disabled={isLoading !== null}
        >
          {isLoading === 'in_progress' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Wrench className="w-4 h-4 mr-2" />}
          Start Work
        </Button>
      )}

      {(currentStatus === 'in_progress' || currentStatus === 'arrived') && (
        <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
          <Button
            className="flex-1 min-w-[120px] bg-emerald-600 hover:bg-emerald-700"
            onClick={() => setCompleteDialogOpen(true)}
            disabled={isLoading !== null}
          >
            {isLoading === 'completed' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
            Complete Job
          </Button>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Complete this job</DialogTitle>
              <DialogDescription>
                Enter the final price charged for this job. The customer will be asked to pay this amount.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-2">
              <Label htmlFor="final_amount">Final Amount (RM)</Label>
              <Input
                id="final_amount"
                type="number"
                min="0"
                step="0.01"
                placeholder="e.g. 180.00"
                value={finalAmount}
                onChange={(e) => setFinalAmount(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button onClick={handleComplete} disabled={isLoading !== null}>
                {isLoading === 'completed' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Confirm Completion
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <Button
        variant="outline"
        className="flex-1 min-w-[120px] text-destructive hover:bg-destructive hover:text-white"
        onClick={() => handleUpdate('cancelled')}
        disabled={isLoading !== null}
      >
        {isLoading === 'cancelled' ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
        Cancel Job
      </Button>
    </div>
  );
}
