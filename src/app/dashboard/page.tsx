import { createClient } from "@/lib/supabase/server";
import { getActiveServiceCategories } from "@/lib/db/service_categories";
import { getProfile } from "@/lib/db/profiles";
import { RequestWizard } from "@/components/dashboard/request-wizard";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { service } = await searchParams;
  const initialCategorySlug = typeof service === "string" ? service : undefined;

  // Fetch active service categories
  const categories = await getActiveServiceCategories();

  // Fetch user's saved vehicles
  const { data: vehicles } = await supabase
    .from("vehicles")
    .select("*")
    .eq("owner_id", user.id);

  const profile = await getProfile(user.id);

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
        initialCategorySlug={initialCategorySlug}
        defaultContactPhone={profile?.phone || ""}
      />
    </div>
  );
}
