import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CarFront, MapPin, Menu, LayoutDashboard, User, ClipboardList, LogOut } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { signout } from "@/app/actions/auth";
import { getProfile } from "@/lib/db/profiles";
import { NotificationBell } from "@/components/layout/notification-bell";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";

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

  const navLinks = [
    { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { href: "/dashboard/request", icon: MapPin, label: "Request Help" },
    { href: "/dashboard/history", icon: ClipboardList, label: "Request History" },
    { href: "/dashboard/vehicles", icon: CarFront, label: "My Vehicles" },
    { href: "/dashboard/profile", icon: User, label: "Profile Settings" },
  ];

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-slate-50">
      {/* Sidebar (Desktop) */}
      <aside className="w-full md:w-64 bg-white border-r hidden md:flex flex-col fixed md:relative h-screen z-40">
        <div className="p-6 border-b flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <CarFront className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold tracking-tight text-primary">RescueGO</span>
          </Link>
          <NotificationBell userId={user.id} />
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 text-slate-700 font-medium transition-colors">
                <Icon className="h-5 w-5" /> {link.label}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              {profile?.full_name?.charAt(0) || "U"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-slate-900 truncate">{profile?.full_name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <form action={signout}>
            <Button variant="outline" className="w-full justify-start text-slate-700" type="submit">
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </Button>
          </form>
        </div>
      </aside>
      
      {/* Mobile Topbar */}
      <div className="md:hidden bg-white border-b p-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger className="md:hidden -ml-2 p-2 text-slate-700 hover:bg-slate-100 rounded-md transition-colors inline-flex items-center justify-center">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle navigation</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-[80vw] max-w-sm p-0 flex flex-col">
              <SheetHeader className="p-6 border-b text-left">
                <SheetTitle className="flex items-center gap-2">
                  <CarFront className="h-6 w-6 text-primary" />
                  <span className="text-xl font-bold tracking-tight text-primary">RescueGO</span>
                </SheetTitle>
              </SheetHeader>
              
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link key={link.href} href={link.href} className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-slate-100 text-slate-700 font-medium transition-colors">
                      <Icon className="h-5 w-5" /> {link.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="p-4 border-t bg-slate-50">
                <div className="flex items-center gap-3 mb-4 px-2">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {profile?.full_name?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium text-slate-900 truncate">{profile?.full_name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                </div>
                <form action={signout}>
                  <Button variant="outline" className="w-full justify-start text-slate-700" type="submit">
                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                  </Button>
                </form>
              </div>
            </SheetContent>
          </Sheet>
          
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-primary">RescueGO</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-1">
          <NotificationBell userId={user.id} />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-slate-50 min-h-[calc(100vh-65px)] md:min-h-screen">
        <div className="container mx-auto p-4 md:p-8 pb-20 md:pb-8">
          {children}
        </div>
      </main>
    </div>
  );
}
