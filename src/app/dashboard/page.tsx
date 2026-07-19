import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/db/profiles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Activity, CarFront, MapPin, User } from "lucide-react";
import { EditProfileDialog } from "@/components/dashboard/edit-profile-dialog";

export default async function DashboardOverviewPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const profile = await getProfile(user.id);

  // Fetch recent requests
  const { data: recentRequests } = await supabase
    .from("requests")
    .select(`
      *,
      service_categories (name)
    `)
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false })
    .limit(3) as any;
    
  const activeRequestCount = Array.isArray(recentRequests) 
    ? recentRequests.filter((r: any) => !['completed', 'cancelled'].includes(r.status)).length 
    : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome back, {profile?.full_name?.split(' ')[0] || 'User'}!</h1>
          <p className="text-muted-foreground mt-1">Here is an overview of your account and recent activity.</p>
        </div>
        <Link href="/dashboard/request">
          <Button size="lg" className="w-full md:w-auto shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
            <MapPin className="mr-2 h-5 w-5" />
            Request Assistance
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Summary */}
        <Card className="md:col-span-1 shadow-sm border-slate-200/60 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50"></div>
          <CardHeader className="relative z-10 pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5 text-primary" /> Profile Info
            </CardTitle>
            <CardDescription>Your personal details</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10 space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Full Name</p>
              <p className="font-semibold text-slate-900">{profile?.full_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Phone Number</p>
              <p className="font-semibold text-slate-900">{profile?.phone || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Email Address</p>
              <p className="font-semibold text-slate-900 truncate">{user.email}</p>
            </div>
            <div className="pt-2">
              <EditProfileDialog fullName={profile?.full_name ?? ""} phone={profile?.phone ?? null} />
            </div>
          </CardContent>
        </Card>

        {/* Activity & Quick Links */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="shadow-sm border-slate-200/60 transition-all hover:border-primary/30 group">
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 group-hover:scale-110 transition-all">
                    <Activity className="h-6 w-6" />
                  </div>
                  <span className="text-2xl font-bold text-slate-900">{activeRequestCount}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Active Requests</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">Requests currently in progress.</p>
                  <Link href="/dashboard/history" className="text-sm font-medium text-primary flex items-center group-hover:underline">
                    View history <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200/60 transition-all hover:border-primary/30 group">
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-100 group-hover:scale-110 transition-all">
                    <CarFront className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">My Vehicles</h3>
                  <p className="text-sm text-muted-foreground mt-1 mb-4">Manage your registered vehicles.</p>
                  <Link href="/dashboard/vehicles" className="text-sm font-medium text-primary flex items-center group-hover:underline">
                    Manage vehicles <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-sm border-slate-200/60">
            <CardHeader className="pb-3 border-b">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Recent Requests</CardTitle>
                <Link href="/dashboard/history">
                  <Button variant="ghost" size="sm" className="text-xs h-8">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {Array.isArray(recentRequests) && recentRequests.length > 0 ? (
                <div className="divide-y">
                  {recentRequests.map((request: any) => (
                    <div key={request.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${
                          request.status === 'completed' ? 'bg-emerald-500' :
                          request.status === 'cancelled' ? 'bg-red-500' : 'bg-blue-500 animate-pulse'
                        }`}></div>
                        <div>
                          <p className="font-medium text-sm text-slate-900">{request.service_categories?.name}</p>
                          <p className="text-xs text-muted-foreground">{new Date(request.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 text-slate-700 capitalize">
                          {request.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  <p className="text-sm">No recent requests found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
