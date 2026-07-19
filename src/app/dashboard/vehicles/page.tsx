import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleDialog } from "@/components/dashboard/vehicle-dialog";
import { DeleteVehicleButton } from "@/components/dashboard/delete-vehicle-button";

export default async function VehiclesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: vehicles } = await supabase
    .from("vehicles")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false }) as any;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Vehicles</h1>
          <p className="text-muted-foreground">Manage vehicles associated with your account.</p>
        </div>
        <VehicleDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {vehicles && vehicles.length > 0 ? (
          vehicles.map((vehicle: any) => (
            <Card key={vehicle.id}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Car className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{vehicle.plate_number}</h3>
                    <p className="text-sm text-muted-foreground">{vehicle.make} {vehicle.model}</p>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <VehicleDialog
                    vehicle={vehicle}
                    trigger={<Button variant="outline" size="sm">Edit</Button>}
                  />
                  <DeleteVehicleButton vehicleId={vehicle.id} />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full">
            <CardContent className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center">
              <Car className="w-12 h-12 mb-4 text-slate-300" />
              <p>You haven&apos;t added any vehicles yet.</p>
              <VehicleDialog trigger={<Button className="mt-4" variant="outline">Add Your First Vehicle</Button>} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
