import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ClipboardList } from "lucide-react";

const STATUS_FILTERS = ["all", "pending", "accepted", "en_route", "arrived", "in_progress", "completed", "cancelled"];

export default async function AdminRequestsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { status } = await searchParams;
  const statusFilter = typeof status === "string" && STATUS_FILTERS.includes(status) ? status : "all";

  const supabase = await createClient();
  let query = supabase
    .from("requests")
    .select("*, service_categories(name)")
    .order("created_at", { ascending: false })
    .limit(50);

  if (statusFilter !== "all") {
    query = query.eq("status", statusFilter);
  }

  const { data: requests } = await query as any;

  const customerIds = [...new Set((requests || []).map((r: any) => r.customer_id))];
  const { data: customers } = customerIds.length
    ? await supabase.from("profiles").select("id, full_name").in("id", customerIds as string[]) as any
    : { data: [] };
  const customerNameById = new Map<string, string>((customers || []).map((c: any) => [c.id, c.full_name]));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Requests</h1>
        <p className="text-muted-foreground">All service requests across the platform (most recent 50).</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((s) => (
          <a
            key={s}
            href={s === "all" ? "/admin/requests" : `/admin/requests?status=${s}`}
            className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${
              statusFilter === s ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {s.replace("_", " ")}
          </a>
        ))}
      </div>

      <div className="grid gap-3">
        {requests && requests.length > 0 ? (
          requests.map((r: any) => (
            <Card key={r.id}>
              <CardContent className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{r.service_categories?.name}</span>
                    <Badge variant={r.status === "completed" ? "outline" : r.status === "cancelled" ? "destructive" : "default"} className="capitalize">
                      {r.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {customerNameById.get(r.customer_id) ?? "Unknown customer"} · {formatDistanceToNow(new Date(r.created_at))} ago
                  </p>
                </div>
                {r.final_amount && <span className="font-medium text-sm">RM {r.final_amount}</span>}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center">
              <ClipboardList className="w-12 h-12 mb-4 text-slate-300" />
              <p>No requests found.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
