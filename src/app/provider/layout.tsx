import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Wrench, CheckSquare, ClipboardList, User } from "lucide-react";
import Link from "next/link";
import { getProfile } from "@/lib/db/profiles";

export default async function ProviderLayout({
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

  if (profile?.role !== 'provider' && profile?.role !== 'admin') {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-slate-50">
      {/* Provider Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-100 border-r flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-800">
          <Link href="/provider" className="flex items-center gap-2">
            <Wrench className="h-6 w-6 text-amber-500" />
            <span className="text-lg font-bold tracking-tight text-white">Provider Hub</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/provider" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 font-medium transition-colors">
            <ClipboardList className="h-5 w-5 text-amber-500" /> Available Jobs
          </Link>
          <Link href="/provider/active" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 font-medium transition-colors">
            <CheckSquare className="h-5 w-5 text-emerald-500" /> Active Jobs
          </Link>
          <Link href="/provider/history" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-800 font-medium transition-colors">
            <ClipboardList className="h-5 w-5 text-slate-400" /> Job History
          </Link>
        </nav>
        
        <div className="p-4 border-t border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-amber-500">
              {profile?.full_name?.charAt(0) || "P"}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate text-white">{profile?.full_name}</p>
              <p className="text-xs text-slate-400">Provider</p>
            </div>
          </div>
          <Link href="/dashboard" className="mt-4 block text-center text-xs text-slate-400 hover:text-white transition-colors">
            Switch to Customer View
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8 max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
