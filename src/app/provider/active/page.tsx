import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Car, Phone, Navigation } from "lucide-react";
import { UpdateStatusButtons } from "@/components/provider/update-status-buttons";

export default async function ProviderActiveJobsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch active requests assigned to this provider
  const { data: activeRequests } = await supabase
    .from("requests")
    .select(`
      *,
      profiles:customer_id (full_name, phone),
      service_categories (name),
      vehicles (make, model, plate_number)
    `)
    .eq("provider_id", user?.id || "")
    .neq("status", "completed")
    .neq("status", "cancelled")
    .order("accepted_at", { ascending: false }) as any;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Active Jobs</h1>
          <p className="text-muted-foreground">Manage the jobs you are currently working on.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {activeRequests && activeRequests.length > 0 ? (
          activeRequests.map((request: any) => (
            <Card key={request.id} className="overflow-hidden border-emerald-200 shadow-md">
              <div className="bg-emerald-50 p-4 border-b border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-xl text-slate-900">{request.service_categories?.name}</h3>
                    <Badge className="bg-emerald-600 hover:bg-emerald-700 uppercase">
                      {request.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="text-sm text-emerald-700 font-medium">Assigned to you</p>
                </div>
                
                <div className="w-full sm:w-auto">
                  <UpdateStatusButtons requestId={request.id} currentStatus={request.status} />
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Customer & Location */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-900 border-b pb-2">Location & Contact</h4>
                    
                    <div className="flex gap-3">
                      <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {request.address_text || "Pinned Location"}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">{request.lat}, {request.lng}</p>
                        <a 
                          href={`https://www.google.com/maps/dir/?api=1&destination=${request.lat},${request.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs text-emerald-600 hover:text-emerald-700 font-medium mt-2"
                        >
                          <Navigation className="w-3 h-3 mr-1" /> Get Directions
                        </a>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Phone className="w-5 h-5 text-slate-400 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">{request.profiles?.full_name}</p>
                        <p className="text-sm text-slate-600">{request.profiles?.phone || "No phone provided"}</p>
                      </div>
                    </div>
                  </div>

                  {/* Vehicle & Issue */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-slate-900 border-b pb-2">Vehicle Details</h4>
                    
                    {request.vehicles && (
                      <div className="flex gap-3">
                        <Car className="w-5 h-5 text-slate-400 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {request.vehicles.make} {request.vehicles.model}
                          </p>
                          <p className="text-sm font-bold text-slate-700 mt-1 bg-slate-100 inline-block px-2 py-1 rounded">
                            {request.vehicles.plate_number}
                          </p>
                        </div>
                      </div>
                    )}

                    {request.description && (
                      <div className="mt-4">
                        <p className="text-xs font-semibold text-slate-500 mb-1 uppercase tracking-wider">Issue Description</p>
                        <div className="bg-amber-50 p-3 rounded-md border border-amber-100 text-sm text-amber-900">
                          {request.description}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-dashed">
            <CardContent className="p-16 text-center text-muted-foreground flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Car className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-1">No Active Jobs</h3>
              <p>You don&apos;t have any jobs in progress. Check the Available Jobs tab to find work.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
