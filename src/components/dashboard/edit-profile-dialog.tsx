"use client";

import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { updateProfileAction } from "@/app/actions/profile";

const myPhoneRegex = /^\+60\d{8,10}$/;

const profileFormSchema = z.object({
  full_name: z.string().min(2, "Full name must be at least 2 characters."),
  phone: z.string().regex(myPhoneRegex, "Must be a valid Malaysian number (e.g. +60123456789)"),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function EditProfileDialog({ fullName, phone }: { fullName: string; phone: string | null }) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { full_name: fullName, phone: phone ?? "" },
  });

  async function onSubmit(values: ProfileFormValues) {
    const formData = new FormData();
    formData.append("full_name", values.full_name);
    formData.append("phone", values.phone);

    const result = await updateProfileAction(formData);

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Profile updated.");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Edit Profile
      </Button>
      <DialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your personal details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input id="full_name" {...register("full_name")} disabled={isSubmitting} />
              {errors.full_name && <p className="text-sm font-medium text-destructive">{errors.full_name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="+60123456789" {...register("phone")} disabled={isSubmitting} />
              {errors.phone && <p className="text-sm font-medium text-destructive">{errors.phone.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
