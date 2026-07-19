"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { approveProviderApplication, rejectProviderApplication } from "@/app/actions/admin";

export function ApplicationActions({ applicationId }: { applicationId: string }) {
  const [isLoading, setIsLoading] = useState<"approve" | "reject" | null>(null);

  async function handle(action: "approve" | "reject") {
    setIsLoading(action);
    const result =
      action === "approve"
        ? await approveProviderApplication(applicationId)
        : await rejectProviderApplication(applicationId);
    setIsLoading(null);

    if (result?.error) {
      toast.error(result.error);
      return;
    }
    toast.success(action === "approve" ? "Application approved." : "Application rejected.");
  }

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        className="bg-emerald-600 hover:bg-emerald-700"
        onClick={() => handle("approve")}
        disabled={isLoading !== null}
      >
        {isLoading === "approve" ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Check className="w-4 h-4 mr-1" />}
        Approve
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
        onClick={() => handle("reject")}
        disabled={isLoading !== null}
      >
        {isLoading === "reject" ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <X className="w-4 h-4 mr-1" />}
        Reject
      </Button>
    </div>
  );
}
