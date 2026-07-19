"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteVehicle } from "@/app/actions/vehicles";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function DeleteVehicleButton({ vehicleId }: { vehicleId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function handleDelete() {
    if (!confirming) {
      setConfirming(true);
      return;
    }

    setIsLoading(true);
    const result = await deleteVehicle(vehicleId);
    setIsLoading(false);

    if (result?.error) {
      toast.error(result.error);
      setConfirming(false);
      return;
    }

    toast.success("Vehicle removed.");
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
      onClick={handleDelete}
      onBlur={() => setConfirming(false)}
      disabled={isLoading}
    >
      {isLoading ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : null}
      {confirming ? "Confirm Remove?" : "Remove"}
    </Button>
  );
}
