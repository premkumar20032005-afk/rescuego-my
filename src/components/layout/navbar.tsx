"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CarFront, Menu } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <CarFront className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold tracking-tight text-primary">RescueGO</span>
        </Link>
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="#services" className="hover:text-primary transition-colors">Services</Link>
          <Link href="#how-it-works" className="hover:text-primary transition-colors">How it works</Link>
          <Link href="#testimonials" className="hover:text-primary transition-colors">Testimonials</Link>
        </nav>
        <div className="hidden md:flex gap-4">
          <Link href="/login">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link href="/signup">
            <Button>Get Started</Button>
          </Link>
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          {/* @ts-ignore */}
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4 mt-8">
              <Link href="#services" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-primary">Services</Link>
              <Link href="#how-it-works" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-primary">How it works</Link>
              <Link href="#testimonials" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-primary">Testimonials</Link>
              <div className="flex flex-col gap-2 mt-4">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full">Log in</Button>
                </Link>
                <Link href="/signup" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
