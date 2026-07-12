import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8">
          <p className="text-amber-700 text-sm">
            <strong>Disclaimer:</strong> This is a template for demonstration purposes only and does not constitute legal advice.
          </p>
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">Terms of Service</h1>
        <p className="text-slate-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="sticky top-24 space-y-2">
              <h3 className="font-semibold text-slate-900 mb-4 uppercase tracking-wider text-sm">Table of Contents</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li><a href="#acceptance" className="hover:text-amber-600">1. Acceptance of Terms</a></li>
                <li><a href="#services" className="hover:text-amber-600">2. Services Provided</a></li>
                <li><a href="#user-responsibilities" className="hover:text-amber-600">3. User Responsibilities</a></li>
                <li><a href="#payments" className="hover:text-amber-600">4. Payments & Refunds</a></li>
                <li><a href="#liability" className="hover:text-amber-600">5. Limitation of Liability</a></li>
                <li><a href="#governing-law" className="hover:text-amber-600">6. Governing Law (Malaysia)</a></li>
              </ul>
            </div>
          </div>
          
          <div className="md:col-span-3 prose prose-slate max-w-none">
            <h2 id="acceptance" className="text-2xl font-bold mt-0">1. Acceptance of Terms</h2>
            <p>
              By accessing and using RescueGO MY ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>

            <h2 id="services" className="text-2xl font-bold">2. Services Provided</h2>
            <p>
              RescueGO operates as a digital marketplace connecting users in need of roadside assistance (towing, battery jumpstart, tyre replacement, etc.) with independent service providers ("Providers"). We do not directly provide transportation or towing services.
            </p>

            <h2 id="user-responsibilities" className="text-2xl font-bold">3. User Responsibilities</h2>
            <p>
              You agree to provide accurate information when requesting assistance, including your exact location, vehicle details, and contact number. You must be present at the vehicle location when the Provider arrives.
            </p>

            <h2 id="payments" className="text-2xl font-bold">4. Payments & Refunds</h2>
            <p>
              All payments for services are facilitated through the Platform. Prices quoted are estimates and may vary based on actual distance or specific services required on-site. Cancellations made after a Provider has been dispatched may be subject to a cancellation fee.
            </p>

            <h2 id="liability" className="text-2xl font-bold">5. Limitation of Liability</h2>
            <p>
              To the maximum extent permitted by Malaysian law, RescueGO shall not be liable for any indirect, incidental, or consequential damages resulting from the use of the Platform or services provided by independent Providers.
            </p>

            <h2 id="governing-law" className="text-2xl font-bold">6. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of Malaysia. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of Malaysia.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
