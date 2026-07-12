import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CarFront } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="bg-primary/10 p-6 rounded-full mb-8">
        <CarFront className="w-16 h-16 text-primary" />
      </div>
      <h2 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">404 - Page Not Found</h2>
      <p className="text-xl text-slate-600 mb-8 max-w-md">
        Oops! It looks like you've driven off the map. We couldn't find the page you're looking for.
      </p>
      <Link href="/">
        <Button size="lg" className="rounded-full px-8">
          Back to Home
        </Button>
      </Link>
    </div>
  );
}
