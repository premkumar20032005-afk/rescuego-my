import Link from "next/link";
import { CarFront } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted py-12 border-t">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <CarFront className="h-7 w-7 text-primary" />
              <span className="text-xl font-bold tracking-tight text-primary">RescueGO</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Malaysia&apos;s most trusted on-demand vehicle assistance platform. Fast, reliable, and always ready to help.
            </p>
            <div className="flex gap-4">
              <Link href="https://facebook.com/rescuego" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
                Facebook
              </Link>
              <Link href="https://instagram.com/rescuego" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
                Instagram
              </Link>
              <Link href="https://twitter.com/rescuego" className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
                Twitter
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-slate-900">Services</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/services/towing" className="hover:text-primary transition-colors">Towing</Link></li>
              <li><Link href="/services/battery" className="hover:text-primary transition-colors">Battery Jumpstart</Link></li>
              <li><Link href="/services/tyre" className="hover:text-primary transition-colors">Tyre Replacement</Link></li>
              <li><Link href="/services/fuel" className="hover:text-primary transition-colors">Fuel Delivery</Link></li>
              <li><Link href="/services/lockout" className="hover:text-primary transition-colors">Lockout Service</Link></li>
              <li><Link href="/services/wash" className="hover:text-primary transition-colors">Mobile Car Wash</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-slate-900">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/provider/apply" className="hover:text-primary transition-colors">Become a Provider</Link></li>
              <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-slate-900">Legal</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} RescueGO MY. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
