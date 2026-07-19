import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Wrench, ClipboardList, Banknote, UserCheck } from "lucide-react";

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [
    { count: totalUsers },
    { count: totalProviders },
    { count: totalRequests },
    { count: pendingApplications },
    { data: payments },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "provider"),
    supabase.from("requests").select("*", { count: "exact", head: true }),
    supabase.from("provider_applications").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("payments").select("amount").eq("status", "paid") as any,
  ]);

  const revenue = (payments || []).reduce((sum: number, p: any) => sum + Number(p.amount), 0);

  const stats = [
    { label: "Total Users", value: totalUsers ?? 0, icon: Users, color: "text-blue-600 bg-blue-100" },
    { label: "Providers", value: totalProviders ?? 0, icon: Wrench, color: "text-emerald-600 bg-emerald-100" },
    { label: "Total Requests", value: totalRequests ?? 0, icon: ClipboardList, color: "text-purple-600 bg-purple-100" },
    { label: "Pending Applications", value: pendingApplications ?? 0, icon: UserCheck, color: "text-amber-600 bg-amber-100" },
    { label: "Revenue Collected", value: `RM ${revenue.toFixed(2)}`, icon: Banknote, color: "text-rose-600 bg-rose-100" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">A snapshot of RescueGO MY&apos;s platform activity.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <div className={`p-2 rounded-full ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
