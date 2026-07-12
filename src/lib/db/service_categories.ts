import { createClient } from "@/lib/supabase/server";
import { Database } from "@/lib/supabase/types";

export type ServiceCategory = Database["public"]["Tables"]["service_categories"]["Row"];

export async function getActiveServiceCategories(): Promise<ServiceCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("service_categories")
    .select("*")
    .eq("active", true)
    .order("name");

  if (error) {
    console.error("Error fetching service categories:", error);
    return [];
  }
  return data;
}
