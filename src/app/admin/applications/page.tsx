import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ApplicationActions } from "@/components/admin/application-actions";
import { ClipboardList } from "lucide-react";

export default async function AdminApplicationsPage() {
  const supabase = await createClient();
  const { data: applications } = await supabase
    .from("provider_applications")
    .select("*")
    .order("created_at", { ascending: false }) as any;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Provider Applications</h1>
        <p className="text-muted-foreground">Review and approve people who want to become RescueGO providers.</p>
      </div>

      <div className="grid gap-4">
        {applications && applications.length > 0 ? (
          applications.map((app: any) => (
            <Card key={app.id}>
              <CardContent className="p-6 flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{app.name}</h3>
                    <Badge
                      variant={app.status === "approved" ? "default" : app.status === "rejected" ? "destructive" : "outline"}
                      className="capitalize"
                    >
                      {app.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Phone: {app.phone}</p>
                    <p>Service Type: {app.service_type}</p>
                    <p>City: {app.city}</p>
                    <p>Applied {formatDistanceToNow(new Date(app.created_at))} ago</p>
                  </div>
                </div>
                {app.status === "pending" && (
                  <div className="flex items-start">
                    <ApplicationActions applicationId={app.id} />
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center">
              <ClipboardList className="w-12 h-12 mb-4 text-slate-300" />
              <p>No provider applications yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
