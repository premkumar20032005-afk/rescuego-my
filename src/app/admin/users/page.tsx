import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Users } from "lucide-react";

const ROLE_FILTERS = ["all", "customer", "provider", "admin"];

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { role } = await searchParams;
  const roleFilter = typeof role === "string" && ROLE_FILTERS.includes(role) ? role : "all";

  const supabase = await createClient();
  let query = supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(100);

  if (roleFilter !== "all") {
    query = query.eq("role", roleFilter);
  }

  const { data: users } = await query as any;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground">All registered accounts (most recent 100).</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {ROLE_FILTERS.map((r) => (
          <a
            key={r}
            href={r === "all" ? "/admin/users" : `/admin/users?role=${r}`}
            className={`px-3 py-1 rounded-full text-xs font-medium border capitalize ${
              roleFilter === r ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:bg-muted"
            }`}
          >
            {r}
          </a>
        ))}
      </div>

      <div className="grid gap-3">
        {users && users.length > 0 ? (
          users.map((u: any) => (
            <Card key={u.id}>
              <CardContent className="p-4 flex items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{u.full_name}</span>
                    <Badge variant="outline" className="capitalize">{u.role}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {u.phone || "No phone"} · Joined {formatDistanceToNow(new Date(u.created_at))} ago
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center">
              <Users className="w-12 h-12 mb-4 text-slate-300" />
              <p>No users found.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
