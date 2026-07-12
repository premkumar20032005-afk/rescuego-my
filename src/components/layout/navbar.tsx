"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CarFront, Menu, UserCircle, LogOut, LayoutDashboard, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { signout } from "@/app/actions/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar({ user }: { user?: any }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <CarFront className="h-7 w-7 text-primary" />
          <span className="text-xl font-bold tracking-tight text-primary">RescueGO</span>
        </Link>
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="/#services" className="hover:text-primary transition-colors">Services</Link>
          <Link href="/#how-it-works" className="hover:text-primary transition-colors">How it works</Link>
          <Link href="/#testimonials" className="hover:text-primary transition-colors">Testimonials</Link>
        </nav>
        <div className="hidden md:flex gap-4 items-center">
          {!user ? (
            <>
              <Link href="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger render={
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <UserCircle className="h-6 w-6 text-slate-600" />
                  </Button>
                } />
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem render={
                    <Link href="/dashboard/profile" className="cursor-pointer">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  } />
                  <DropdownMenuItem render={
                    <Link href="/dashboard/history" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>My Requests</span>
                    </Link>
                  } />
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                    onClick={() => signout()}
                  >
                    <div className="flex items-center">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger render={
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          } />
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4 mt-8">
              <Link href="/#services" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-primary">Services</Link>
              <Link href="/#how-it-works" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-primary">How it works</Link>
              <Link href="/#testimonials" onClick={() => setIsOpen(false)} className="text-lg font-medium hover:text-primary">Testimonials</Link>
              
              <div className="flex flex-col gap-2 mt-4">
                {!user ? (
                  <>
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">Log in</Button>
                    </Link>
                    <Link href="/signup" onClick={() => setIsOpen(false)}>
                      <Button className="w-full">Get Started</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">Dashboard</Button>
                    </Link>
                    <Link href="/dashboard/profile" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">Profile</Button>
                    </Link>
                    <Button variant="destructive" onClick={() => { signout(); setIsOpen(false); }}>Sign out</Button>
                  </>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
