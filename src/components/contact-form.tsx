"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitContactMessage } from "@/app/actions/contact";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

export function ContactForm() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(values: z.infer<typeof contactSchema>) {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("message", values.message);

    const result = await submitContactMessage(formData);

    if (result?.error) {
      toast.error(result.error);
      return;
    }

    toast.success("Message sent successfully! We will get back to you soon.");
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" placeholder="John Doe" {...register("name")} disabled={isSubmitting} />
        {errors.name && (
          <p className="text-sm font-medium text-destructive">{errors.name.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="john@example.com" {...register("email")} disabled={isSubmitting} />
        {errors.email && (
          <p className="text-sm font-medium text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea 
          id="message" 
          placeholder="How can we help you?" 
          className="min-h-[120px]" 
          {...register("message")} 
          disabled={isSubmitting} 
        />
        {errors.message && (
          <p className="text-sm font-medium text-destructive">{errors.message.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
