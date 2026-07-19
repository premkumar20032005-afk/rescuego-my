"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const vehicleSchema = z.object({
  plate_number: z.string().min(1, "Plate number is required").max(20),
  make: z.string().min(1, "Make is required").max(50),
  model: z.string().min(1, "Model is required").max(50),
  year: z.coerce.number().int().min(1950).max(new Date().getFullYear() + 1).optional().or(z.literal("").transform(() => undefined)),
});

export async function createVehicle(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "You must be logged in." };

  const result = vehicleSchema.safeParse({
    plate_number: formData.get("plate_number"),
    make: formData.get("make"),
    model: formData.get("model"),
    year: formData.get("year"),
  });

  if (!result.success) {
    return { error: result.error.issues[0]?.message || "Invalid vehicle details." };
  }

  const { error } = await supabase
    .from("vehicles")
    .insert({
      owner_id: user.id,
      plate_number: result.data.plate_number,
      make: result.data.make,
      model: result.data.model,
      year: result.data.year ?? null,
    } as any);

  if (error) {
    console.error("Error creating vehicle:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard/vehicles");
  return { success: true };
}

export async function updateVehicle(vehicleId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "You must be logged in." };

  const result = vehicleSchema.safeParse({
    plate_number: formData.get("plate_number"),
    make: formData.get("make"),
    model: formData.get("model"),
    year: formData.get("year"),
  });

  if (!result.success) {
    return { error: result.error.issues[0]?.message || "Invalid vehicle details." };
  }

  const { error } = await supabase
    .from("vehicles")
    // @ts-ignore
    .update({
      plate_number: result.data.plate_number,
      make: result.data.make,
      model: result.data.model,
      year: result.data.year ?? null,
    })
    .eq("id", vehicleId)
    .eq("owner_id", user.id);

  if (error) {
    console.error("Error updating vehicle:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard/vehicles");
  return { success: true };
}

export async function deleteVehicle(vehicleId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: "You must be logged in." };

  const { error } = await supabase
    .from("vehicles")
    .delete()
    .eq("id", vehicleId)
    .eq("owner_id", user.id);

  if (error) {
    console.error("Error deleting vehicle:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard/vehicles");
  return { success: true };
}
