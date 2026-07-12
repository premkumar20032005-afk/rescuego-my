import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Car, Clock, Phone } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { AcceptJobButton } from "@/components/provider/accept-job-button";

export default async function ProviderDashboardPage() {
  const supabase = await createClient();

  // Fetch pending requests
  const { data: requests } = await supabase
    .from("requests")
    .select(`
      *,
      profiles:customer_id (full_name, phone),
      service_categories (name),
      vehicles (make, model, plate_number)
    `)
    .eq("status", "pending")
    .order("created_at", { ascending: false }) as any;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Available Jobs</h1>
          <p className="text-muted-foreground">Nearby customers who need immediate assistance.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {requests && requests.length > 0 ? (
          requests.map((request: any) => (
            <Card key={request.id} className="overflow-hidden border-amber-200">
              <div className="bg-amber-100/50 p-4 border-b border-amber-100 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{request.service_categories?.name}</h3>
                  <div className="flex items-center text-xs text-amber-600 mt-1 font-medium">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>Requested {formatDistanceToNow(new Date(request.created_at))} ago</span>
                  </div>
                </div>
                <Badge variant="outline" className="bg-white border-amber-200 text-amber-700">
                  New
                </Badge>
              </div>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900 line-clamp-2">
                        {request.address_text || `${request.lat.toFixed(4)}, ${request.lng.toFixed(4)}`}
                      </p>
                    </div>
                  </div>
                  
                  {request.vehicles && (
                    <div className="flex gap-3">
                      <Car className="w-5 h-5 text-slate-400 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {request.vehicles.make} {request.vehicles.model}
                        </p>
                        <p className="text-xs text-slate-500">{request.vehicles.plate_number}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Phone className="w-5 h-5 text-slate-400 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-900">Customer</p>
                      <p className="text-xs text-slate-500">{request.profiles?.full_name}</p>
                    </div>
                  </div>
                  
                  {request.description && (
                    <div className="bg-slate-50 p-3 rounded-md border text-sm text-slate-700 italic">
                      &quot;{request.description}&quot;
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <AcceptJobButton requestId={request.id} />
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="col-span-full border-dashed">
            <CardContent className="p-16 text-center text-muted-foreground flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <CheckSquare className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-1">No Jobs Available</h3>
              <p>There are no pending requests right now. Check back later.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Need to import this for the fallback UI
import { CheckSquare } from "lucide-react";
