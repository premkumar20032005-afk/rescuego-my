"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { completeOnboarding } from "@/app/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone } from "lucide-react";
import { Label } from "@/components/ui/label";

// Malaysian phone: +60 followed by 8-10 digits
const myPhoneRegex = /^\+60\d{8,10}$/;

const formSchema = z.object({
  phone: z.string().regex(myPhoneRegex, "Must be a valid Malaysian number (e.g. +60123456789)"),
});

export function OnboardingForm({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "+60",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setErrorMsg(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("phone", values.phone);
      formData.append("userId", userId);

      const result = await completeOnboarding(formData);
      if (result?.error) {
        setErrorMsg(result.error);
        toast.error(result.error);
      }
    });
  }

  return (
    <Card className="mx-auto w-full shadow-md border border-border/40">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <Smartphone className="w-8 h-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Complete your profile</CardTitle>
        <CardDescription>
          We need your phone number to coordinate with service providers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" placeholder="+60123456789" {...register("phone")} disabled={isPending} />
            {errors.phone && (
              <p className="text-sm font-medium text-destructive">{errors.phone.message}</p>
            )}
          </div>
          
          {errorMsg && (
            <div className="text-sm font-medium text-destructive">{errorMsg}</div>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Saving..." : "Continue to Dashboard"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
