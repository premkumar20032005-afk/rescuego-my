"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createServiceRequest(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to create a request" };
  }

  const categoryId = formData.get("categoryId") as string;
  const lat = parseFloat(formData.get("lat") as string);
  const lng = parseFloat(formData.get("lng") as string);
  const plateNumber = formData.get("plateNumber") as string;
  const makeModel = formData.get("makeModel") as string;
  const description = formData.get("description") as string;
  
  if (!categoryId || isNaN(lat) || isNaN(lng) || !plateNumber || !makeModel) {
    return { error: "Missing required fields" };
  }

  // Split makeModel into make and model (naive approach for now)
  const parts = makeModel.split(" ");
  const make = parts[0] || "Unknown";
  const model = parts.slice(1).join(" ") || "Unknown";

  // First, let's see if the vehicle exists for this user, if not create it
  let vehicleId = null;
  const { data: existingVehicles } = await supabase
    .from("vehicles")
    .select("*")
    .eq("owner_id", user.id)
    .eq("plate_number", plateNumber)
    .limit(1) as any;

  if (existingVehicles && existingVehicles.length > 0) {
    vehicleId = existingVehicles[0].id;
  } else {
    const { data: newVehicle, error: vError } = await supabase
      .from("vehicles")
      .insert({
        owner_id: user.id,
        plate_number: plateNumber,
        make: make,
        model: model,
      } as any)
      .select()
      .single() as any;
      
    if (vError) {
      console.error("Error creating vehicle:", vError);
      return { error: "Failed to save vehicle details" };
    }
    vehicleId = newVehicle.id;
  }

  // Now create the request
  const { data: request, error } = await supabase
    .from("requests")
    .insert({
      customer_id: user.id,
      category_id: categoryId,
      vehicle_id: vehicleId,
      lat: lat,
      lng: lng,
      address_text: "Pinned Location",
      description: description,
      status: "pending"
    } as any)
    .select()
    .single();

  if (error) {
    console.error("Error creating request:", error);
    return { error: error.message };
  }

  revalidatePath("/dashboard/history");
  return { success: true, data: request };
}
