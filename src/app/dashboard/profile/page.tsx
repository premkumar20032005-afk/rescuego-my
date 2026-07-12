import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getProfile } from "@/lib/db/profiles";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const profile = await getProfile(user.id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account information and preferences.</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details here.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm font-medium text-slate-500">Full Name</p>
            <p className="font-semibold">{profile?.full_name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Phone Number</p>
            <p className="font-semibold">{profile?.phone}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Email Address</p>
            <p className="font-semibold">{user.email}</p>
          </div>
          
          <Button variant="outline" className="mt-4">Edit Profile</Button>
        </CardContent>
      </Card>
    </div>
  );
}
