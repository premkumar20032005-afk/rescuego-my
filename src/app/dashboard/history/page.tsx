import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { MapPin, Car, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function RequestHistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: requests } = await supabase
    .from("requests")
    .select(`
      *,
      service_categories (name),
      vehicles (make, model, plate_number)
    `)
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false }) as any;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Request History</h1>
          <p className="text-muted-foreground">View all your past and active assistance requests.</p>
        </div>
        <Link href="/dashboard">
          <Button>New Request</Button>
        </Link>
      </div>

      <div className="grid gap-4">
        {requests && requests.length > 0 ? (
          requests.map((request: any) => (
            <Card key={request.id}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{request.service_categories?.name}</h3>
                      <Badge variant={request.status === "completed" ? "outline" : request.status === "cancelled" ? "destructive" : "default"}>
                        {request.status.replace("_", " ")}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>Requested {formatDistanceToNow(new Date(request.created_at))} ago</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{request.address_text || `${request.lat.toFixed(4)}, ${request.lng.toFixed(4)}`}</span>
                      </div>
                      {request.vehicles && (
                        <div className="flex items-center gap-2">
                          <Car className="w-4 h-4" />
                          <span>{request.vehicles.plate_number} ({request.vehicles.make} {request.vehicles.model})</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end justify-between">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Provider</p>
                      <p className="font-medium">{request.provider_id ? "Assigned" : "Waiting for provider..."}</p>
                    </div>
                    {request.status === 'pending' && (
                      <Button variant="outline" size="sm" className="mt-4 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                        Cancel Request
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center">
              <Car className="w-12 h-12 mb-4 text-slate-300" />
              <p>You haven&apos;t made any requests yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
