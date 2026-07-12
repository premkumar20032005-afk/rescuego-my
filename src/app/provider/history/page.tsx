import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Car, Clock, CalendarDays } from "lucide-react";

export default async function ProviderHistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch completed or cancelled requests assigned to this provider
  const { data: requests } = await supabase
    .from("requests")
    .select(`
      *,
      profiles:customer_id (full_name),
      service_categories (name),
      vehicles (make, model, plate_number)
    `)
    .eq("provider_id", user?.id || "")
    .in("status", ["completed", "cancelled"])
    .order("completed_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false }) as any;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Job History</h1>
          <p className="text-muted-foreground">Review your past completed and cancelled jobs.</p>
        </div>
      </div>

      <div className="grid gap-4">
        {requests && requests.length > 0 ? (
          requests.map((request: any) => (
            <Card key={request.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="p-6 flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-slate-900">{request.service_categories?.name}</h3>
                      <Badge variant={request.status === "completed" ? "default" : "destructive"} className={request.status === "completed" ? "bg-emerald-600 hover:bg-emerald-700" : ""}>
                        {request.status.replace("_", " ")}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span className="truncate max-w-[200px]">{request.address_text || "Pinned Location"}</span>
                      </div>
                      {request.vehicles && (
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4 text-slate-400" />
                          <span>{request.vehicles.make} {request.vehicles.model} ({request.vehicles.plate_number})</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        <span>{request.profiles?.full_name}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 p-6 md:w-64 border-l flex flex-col justify-center">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Timing</p>
                    <div className="space-y-2 text-sm text-slate-700">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1"><CalendarDays className="w-4 h-4" /> Date</span>
                        <span className="font-medium">{new Date(request.created_at).toLocaleDateString()}</span>
                      </div>
                      {request.completed_at && (
                        <div className="flex items-center justify-between">
                          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Finished</span>
                          <span className="font-medium">{new Date(request.completed_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-dashed">
            <CardContent className="p-16 text-center text-muted-foreground flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <ClipboardList className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-1">No Job History</h3>
              <p>You haven&apos;t completed any jobs yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Ensure icons are imported
import { ClipboardList, User } from "lucide-react";
