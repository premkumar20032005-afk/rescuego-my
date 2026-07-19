import { getServiceBySlug, services } from "@/lib/services";
import { notFound } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const Icon = service.icon;

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/#services" className="text-sm text-slate-500 hover:text-slate-900 mb-8 inline-block">
          &larr; Back to all services
        </Link>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-amber-100 p-4 rounded-2xl">
                <Icon className="w-10 h-10 text-amber-600" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900">{service.name}</h1>
            </div>
            
            <p className="text-xl text-slate-600 leading-relaxed">
              {service.longDescription}
            </p>

            <div className="mt-8">
              <h3 className="text-2xl font-semibold mb-4 text-slate-900">What&apos;s Included</h3>
              <ul className="space-y-3">
                {service.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span className="text-slate-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <Card className="sticky top-24 border-amber-200 shadow-md">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Estimated Price</h3>
                <div className="text-3xl font-bold text-amber-600 mb-6">
                  RM {service.priceMin} <span className="text-lg text-slate-500 font-medium">to</span> RM {service.priceMax}
                </div>
                
                <p className="text-sm text-slate-500 mb-6">
                  Final price depends on distance, time of day, and specific vehicle requirements.
                </p>
                
                <div className="pt-6">
                  <Link
                    href={`/request?service=${service.slug}`}
                    className={buttonVariants({ className: "w-full bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold py-6 text-lg" })}
                  >
                    Request {service.name} Now
                  </Link>
                  <p className="text-center text-sm text-slate-500 mt-4">
                    No hidden fees. Pay after service is completed.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
