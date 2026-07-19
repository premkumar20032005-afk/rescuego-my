import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LayoutDashboard, ClipboardList, Users, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { getProfile } from "@/lib/db/profiles";
import { signout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const profile = await getProfile(user.id);

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-slate-50">
      <aside className="w-full md:w-64 bg-slate-900 text-slate-100 border-r flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-800">
          <Link href="/admin" className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-amber-500" />
            <span className="text-lg font-bold tracking-tight text-white">Admin Panel</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 font-medium transition-colors">
            <LayoutDashboard className="h-5 w-5 text-amber-500" /> Overview
          </Link>
          <Link href="/admin/applications" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 font-medium transition-colors">
            <ClipboardList className="h-5 w-5 text-emerald-500" /> Provider Applications
          </Link>
          <Link href="/admin/requests" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 font-medium transition-colors">
            <ClipboardList className="h-5 w-5 text-slate-400" /> Requests
          </Link>
          <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 font-medium transition-colors">
            <Users className="h-5 w-5 text-slate-400" /> Users
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-amber-500">
              {profile?.full_name?.charAt(0) || "A"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate text-white">{profile?.full_name}</p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
          </div>
          <Link href="/dashboard" className="block text-center text-xs text-slate-400 hover:text-white transition-colors mb-2">
            Switch to Customer View
          </Link>
          <form action={signout}>
            <Button variant="outline" size="sm" className="w-full bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white" type="submit">
              Sign out
            </Button>
          </form>
        </div>
      </aside>

      {/* Mobile Topbar */}
      <div className="md:hidden bg-slate-900 text-white border-b border-slate-800 p-4 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-amber-500" />
          <span className="text-lg font-bold tracking-tight">Admin Panel</span>
        </Link>
        <form action={signout}>
          <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800" type="submit">
            Sign out
          </Button>
        </form>
      </div>

      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8 max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
