import { ProviderApplicationForm } from "@/components/provider-application-form";

export default function ProviderApplyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4 text-center">Partner with RescueGO</h1>
        <p className="text-xl text-slate-600 leading-relaxed mb-12 text-center max-w-2xl mx-auto">
          Join Malaysia's fastest-growing roadside assistance network. Get more jobs, earn more money, and work on your own schedule.
        </p>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold mb-6">Application Form</h2>
          <ProviderApplicationForm />
        </div>
      </div>
    </div>
  );
}
