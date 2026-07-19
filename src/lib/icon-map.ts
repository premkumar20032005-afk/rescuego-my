import {
  Truck,
  Battery,
  CircleDashed,
  Fuel,
  Key,
  Wrench,
  Droplets,
  Settings,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export const ICON_MAP: Record<string, LucideIcon> = {
  Truck,
  Battery,
  CircleDashed,
  Fuel,
  Key,
  Wrench,
  Droplets,
  Settings,
  ShieldCheck,
};

export function getServiceIcon(icon: string | null | undefined): LucideIcon {
  return (icon && ICON_MAP[icon]) || Wrench;
}
