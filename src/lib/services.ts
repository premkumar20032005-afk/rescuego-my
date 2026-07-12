import { Shield, Wrench, Battery, Fuel, Lock, Droplets } from "lucide-react";

export interface ServiceDetail {
  slug: string;
  name: string;
  description: string;
  priceMin: number;
  priceMax: number;
  icon: any; // Lucide icon
  longDescription: string;
  benefits: string[];
}

export const services: ServiceDetail[] = [
  {
    slug: "towing",
    name: "Towing Service",
    description: "Safe and reliable vehicle towing to your preferred workshop.",
    priceMin: 150,
    priceMax: 300,
    icon: Shield,
    longDescription: "Our professional towing partners use flatbed trucks to ensure your vehicle is transported safely without any damage. Whether you've been in an accident or experienced a severe breakdown, we can get your car to your preferred workshop or home securely.",
    benefits: ["24/7 Availability", "Flatbed tow trucks available", "Fully insured transport", "Fast dispatch time"]
  },
  {
    slug: "battery",
    name: "Battery Jumpstart",
    description: "Quick battery jumpstart or on-the-spot replacement.",
    priceMin: 50,
    priceMax: 350,
    icon: Battery,
    longDescription: "Dead battery? Our providers carry professional jumpstart equipment to get you going in minutes. If your battery is completely dead, they can also provide and install a brand new battery on the spot.",
    benefits: ["Arrives in under 45 minutes", "Battery testing included", "Brand new battery replacement options", "No membership fees"]
  },
  {
    slug: "tyre",
    name: "Tyre Replacement",
    description: "Spare tyre installation or patching for punctures.",
    priceMin: 60,
    priceMax: 150,
    icon: Wrench,
    longDescription: "Got a flat? We can help patch your tyre if it's a minor puncture, or swap it out with your spare tyre so you can safely drive to a tyre shop. Save yourself the sweat and let our pros handle the jack and wrench.",
    benefits: ["Puncture repair", "Spare tyre swapping", "Proper lug nut torquing", "Air pressure check"]
  },
  {
    slug: "fuel",
    name: "Fuel Delivery",
    description: "Emergency fuel delivery to get you to the next station.",
    priceMin: 40,
    priceMax: 80,
    icon: Fuel,
    longDescription: "Running out of petrol is stressful. We will dispatch a provider to deliver enough RON95 or Diesel directly to your location so you can make it to the nearest petrol station safely.",
    benefits: ["Petrol & Diesel available", "Fast delivery", "Safe pouring equipment", "Enough to reach the nearest station"]
  },
  {
    slug: "lockout",
    name: "Lockout Service",
    description: "Professional unlocking if you left keys inside.",
    priceMin: 80,
    priceMax: 150,
    icon: Lock,
    longDescription: "Locked your keys in your car? Don't break a window! Our trained professionals use specialized, non-destructive tools to safely unlock your vehicle door and retrieve your keys without damaging your car.",
    benefits: ["Damage-free entry", "Specialized unlocking tools", "Works on most car models", "Fast resolution"]
  },
  {
    slug: "wash",
    name: "Mobile Car Wash",
    description: "Premium car wash and detailing at your location.",
    priceMin: 50,
    priceMax: 200,
    icon: Droplets,
    longDescription: "Don't have time to go to the car wash? Let the car wash come to you. Our mobile detailers bring their own water and power to wash, wax, and vacuum your car wherever it is parked.",
    benefits: ["Waterless or traditional wash", "Interior vacuuming", "Premium waxing", "Convenient at-home service"]
  }
];

export function getServiceBySlug(slug: string): ServiceDetail | undefined {
  return services.find(s => s.slug === slug);
}
