import { Button, buttonVariants } from "@/components/ui/button";

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-6">Careers at RescueGO</h1>
        <p className="text-xl text-slate-600 leading-relaxed mb-12">
          Join us in building the future of roadside assistance in Malaysia.
        </p>

        <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-200">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
            🌱
          </div>
          <h2 className="text-2xl font-semibold mb-4">No open positions right now</h2>
          <p className="text-slate-600 mb-8 max-w-md mx-auto">
            We are currently fully staffed, but we are always looking for passionate individuals to join our team in the future.
          </p>
          <a href="mailto:careers@rescuego.my" className={buttonVariants({ variant: "default" })}>
            Send us your resume
          </a>
        </div>
      </div>
    </div>
  );
}
