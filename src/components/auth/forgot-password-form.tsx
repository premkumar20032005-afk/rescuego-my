"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { resetPasswordForEmail } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { KeyRound } from "lucide-react";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("email", values.email);

      const result = await resetPasswordForEmail(formData);
      
      // Always show success message to prevent user enumeration
      setIsSuccess(true);
      if (result?.error) {
        console.error(result.error);
      }
    });
  }

  if (isSuccess) {
    return (
      <Card className="mx-auto w-full max-w-md shadow-md border border-border/40">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-emerald-100 p-3 rounded-full">
              <KeyRound className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Check your email</CardTitle>
          <CardDescription>
            If an account exists for that email, we have sent a password reset link.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link href="/login">
            <Button variant="outline" className="mt-4">Return to sign in</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto w-full max-w-md shadow-md border border-border/40">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <KeyRound className="w-8 h-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Forgot Password</CardTitle>
        <CardDescription>
          Enter your email address and we will send you a password reset link.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="name@example.com" {...register("email")} disabled={isPending} />
            {errors.email && (
              <p className="text-sm font-medium text-destructive">{errors.email.message}</p>
            )}
          </div>
          
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Remember your password?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
