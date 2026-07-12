"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitProviderApplication } from "@/app/actions/provider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Controller } from "react-hook-form";

// Phone validation: +60 followed by 8-10 digits. Auto prefix +60 is handled on change.
const phoneRegex = /^\+60\d{8,10}$/;

const applicationSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().regex(phoneRegex, "Must be a valid Malaysian number (e.g. +60123456789)"),
  serviceType: z.string().min(2, "Please select a service type"),
  city: z.string().min(2, "City is required"),
});

export function ProviderApplicationForm() {
  const { register, handleSubmit, control, setValue, reset, formState: { errors, isSubmitting } } = useForm<z.infer<typeof applicationSchema>>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      phone: "+60"
    }
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    // Auto-prefix if user types 01...
    if (val.startsWith("01")) {
      val = "+6" + val;
    }
    // Ensure it always starts with +60 if they try to delete it
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

  async function onSubmit(values: z.infer<typeof applicationSchema>) {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("phone", values.phone);
    formData.append("serviceType", values.serviceType);
    formData.append("city", values.city);

    const result = await submitProviderApplication(formData);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Application submitted successfully! We will contact you soon.");
      reset({ name: "", phone: "+60", serviceType: "", city: "" });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name (as per IC)</Label>
        <Input id="name" placeholder="Ahmad Bin Abdullah" {...register("name")} disabled={isSubmitting} />
        {errors.name && (
          <p className="text-sm font-medium text-destructive">{errors.name.message}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input 
          id="phone" 
          placeholder="+60123456789" 
          {...register("phone")} 
          onChange={handlePhoneChange}
          disabled={isSubmitting} 
        />
        {errors.phone && (
          <p className="text-sm font-medium text-destructive">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="serviceType">Primary Service Type</Label>
        <Controller
          name="serviceType"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value} disabled={isSubmitting}>
              <SelectTrigger>
                <SelectValue placeholder="Select a service type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Towing">Towing Service</SelectItem>
                <SelectItem value="Battery Jumpstart">Battery Jumpstart / Replacement</SelectItem>
                <SelectItem value="Tyre Replacement">Tyre Replacement / Repair</SelectItem>
                <SelectItem value="Fuel Delivery">Fuel Delivery</SelectItem>
                <SelectItem value="Lockout">Lockout Service</SelectItem>
                <SelectItem value="Mobile Car Wash">Mobile Car Wash</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.serviceType && (
          <p className="text-sm font-medium text-destructive">{errors.serviceType.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="city">City / Area of Operation</Label>
        <Input id="city" placeholder="e.g. Kuala Lumpur, Petaling Jaya" {...register("city")} disabled={isSubmitting} />
        {errors.city && (
          <p className="text-sm font-medium text-destructive">{errors.city.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-slate-900" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Submit Application"}
      </Button>
    </form>
  );
}
