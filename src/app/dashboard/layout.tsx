import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CarFront, MapPin, Search, User, ClipboardList } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signout } from "@/app/actions/auth";
import { getProfile } from "@/lib/db/profiles";
import { NotificationBell } from "@/components/layout/notification-bell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check if profile has phone number, otherwise redirect to onboarding
  const profile = await getProfile(user.id);

  if (!profile?.phone) {
    redirect("/onboarding");
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-slate-50">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r flex flex-col hidden md:flex">
        <div className="p-6 border-b flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <CarFront className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold tracking-tight text-primary">RescueGO</span>
          </Link>
          <NotificationBell userId={user.id} />
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 text-slate-700 font-medium transition-colors">
            <MapPin className="h-5 w-5" /> Request Help
          </Link>
          <Link href="/dashboard/history" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 text-slate-700 font-medium transition-colors">
            <ClipboardList className="h-5 w-5" /> Request History
          </Link>
          <Link href="/dashboard/vehicles" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 text-slate-700 font-medium transition-colors">
            <CarFront className="h-5 w-5" /> My Vehicles
          </Link>
          <Link href="/dashboard/profile" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 text-slate-700 font-medium transition-colors">
            <User className="h-5 w-5" /> Profile Settings
          </Link>
        </nav>
        
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {profile?.full_name?.charAt(0) || "U"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{profile?.full_name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <form action={signout}>
            <Button variant="outline" className="w-full justify-start" type="submit">
              Sign out
            </Button>
          </form>
        </div>
      </aside>
      
      {/* Mobile Topbar */}
      <div className="md:hidden bg-white border-b p-4 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <CarFront className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold tracking-tight text-primary">RescueGO</span>
        </Link>
        <div className="flex items-center gap-1">
          <NotificationBell userId={user.id} />
          <form action={signout}>
            <Button variant="ghost" size="sm" type="submit">Sign out</Button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
