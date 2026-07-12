"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { signup } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { CarFront } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useSearchParams } from "next/navigation";

const phoneRegex = /^\+60\d{8,10}$/;

const formSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(phoneRegex, "Must be a valid Malaysian number (e.g. +60123456789)"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function SignupForm() {
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "+60",
      password: "",
    },
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (val.startsWith("01")) {
      val = "+6" + val;
    }
    if (!val.startsWith("+60") && val.length > 0) {
      if (val.startsWith("+6")) {
        // let them type
      } else if (val.startsWith("+")) {
        val = "+60";
      } else {
        val = "+60" + val.replace(/\D/g, "");
      }
    }
    setValue("phone", val);
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    setErrorMsg(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("fullName", values.fullName);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("password", values.password);
      formData.append("redirectUrl", redirectUrl);

      const result = await signup(formData);
      if (result?.error) {
        setErrorMsg(result.error);
        toast.error(result.error);
      }
    });
  }

  return (
    <Card className="mx-auto w-full max-w-md shadow-md border border-border/40">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-primary/10 p-3 rounded-full">
            <CarFront className="w-8 h-8 text-primary" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
        <CardDescription>
          Enter your details below to create your RescueGO account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" placeholder="John Doe" {...register("fullName")} disabled={isPending} />
            {errors.fullName && (
              <p className="text-sm font-medium text-destructive">{errors.fullName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" placeholder="name@example.com" {...register("email")} disabled={isPending} />
            {errors.email && (
              <p className="text-sm font-medium text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone" 
              placeholder="+60123456789" 
              {...register("phone")} 
              onChange={handlePhoneChange}
              disabled={isPending} 
            />
            {errors.phone && (
              <p className="text-sm font-medium text-destructive">{errors.phone.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" {...register("password")} disabled={isPending} />
            {errors.password && (
              <p className="text-sm font-medium text-destructive">{errors.password.message}</p>
            )}
          </div>
          
          {errorMsg && (
            <div className="text-sm font-medium text-destructive">{errorMsg}</div>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Creating account..." : "Sign Up"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
