import { createClient } from "@/lib/supabase/server";
import { getActiveServiceCategories } from "@/lib/db/service_categories";
import { RequestWizard } from "@/components/dashboard/request-wizard";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;

  // Fetch active service categories
  const categories = await getActiveServiceCategories();
  
  // Fetch user's saved vehicles
  const { data: vehicles } = await supabase
    .from("vehicles")
    .select("*")
    .eq("owner_id", user.id);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Request Assistance</h1>
        <p className="text-muted-foreground">Follow the steps below to get help quickly.</p>
      </div>
      
      <RequestWizard 
        categories={categories} 
        vehicles={vehicles || []} 
        userId={user.id} 
      />
    </div>
  );
}
