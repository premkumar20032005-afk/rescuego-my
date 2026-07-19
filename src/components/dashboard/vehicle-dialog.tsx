"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Loader2 } from "lucide-react";
import { createVehicle, updateVehicle } from "@/app/actions/vehicles";
import { Database } from "@/lib/supabase/types";

type Vehicle = Database["public"]["Tables"]["vehicles"]["Row"];

const vehicleFormSchema = z.object({
  plate_number: z.string().min(1, "Plate number is required"),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().optional(),
});

type VehicleFormValues = z.infer<typeof vehicleFormSchema>;

export function VehicleDialog({
  vehicle,
  trigger,
}: {
  vehicle?: Vehicle;
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(vehicle);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      plate_number: vehicle?.plate_number ?? "",
      make: vehicle?.make ?? "",
      model: vehicle?.model ?? "",
      year: vehicle?.year ? String(vehicle.year) : "",
    },
  });

  async function onSubmit(values: VehicleFormValues) {
    const formData = new FormData();
    formData.append("plate_number", values.plate_number);
    formData.append("make", values.make);
    formData.append("model", values.model);
    formData.append("year", values.year || "");

    const result = isEdit
      ? await updateVehicle(vehicle!.id, formData)
      : await createVehicle(formData);

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    toast.success(isEdit ? "Vehicle updated." : "Vehicle added.");
    if (!isEdit) reset();
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <div onClick={() => setOpen(true)}>{trigger}</div>
      ) : (
        <Button onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Add Vehicle
        </Button>
      )}
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit Vehicle" : "Add a Vehicle"}</DialogTitle>
            <DialogDescription>
              {isEdit ? "Update your vehicle details." : "Save a vehicle so you can request help faster next time."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="plate_number">License Plate Number</Label>
              <Input id="plate_number" placeholder="e.g. VHA 1234" {...register("plate_number")} disabled={isSubmitting} />
              {errors.plate_number && <p className="text-sm font-medium text-destructive">{errors.plate_number.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="make">Make</Label>
                <Input id="make" placeholder="e.g. Perodua" {...register("make")} disabled={isSubmitting} />
                {errors.make && <p className="text-sm font-medium text-destructive">{errors.make.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input id="model" placeholder="e.g. Myvi" {...register("model")} disabled={isSubmitting} />
                {errors.model && <p className="text-sm font-medium text-destructive">{errors.model.message}</p>}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year (optional)</Label>
              <Input id="year" placeholder="e.g. 2020" inputMode="numeric" {...register("year")} disabled={isSubmitting} />
              {errors.year && <p className="text-sm font-medium text-destructive">{errors.year.message}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {isSubmitting ? "Saving..." : isEdit ? "Save Changes" : "Add Vehicle"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
