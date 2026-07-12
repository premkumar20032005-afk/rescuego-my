import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8">
          <p className="text-amber-700 text-sm">
            <strong>Disclaimer:</strong> This is a template for demonstration purposes only and does not constitute legal advice.
          </p>
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">Privacy Policy</h1>
        <p className="text-slate-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="sticky top-24 space-y-2">
              <h3 className="font-semibold text-slate-900 mb-4 uppercase tracking-wider text-sm">Table of Contents</h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li><a href="#introduction" className="hover:text-amber-600">1. Introduction</a></li>
                <li><a href="#pdpa" className="hover:text-amber-600">2. Compliance with PDPA 2010</a></li>
                <li><a href="#data-collection" className="hover:text-amber-600">3. Data We Collect</a></li>
                <li><a href="#data-usage" className="hover:text-amber-600">4. How We Use Data</a></li>
                <li><a href="#data-sharing" className="hover:text-amber-600">5. Data Sharing</a></li>
                <li><a href="#rights" className="hover:text-amber-600">6. Your Rights</a></li>
              </ul>
            </div>
          </div>
          
          <div className="md:col-span-3 prose prose-slate max-w-none">
            <h2 id="introduction" className="text-2xl font-bold mt-0">1. Introduction</h2>
            <p>
              RescueGO MY respects your privacy and is committed to protecting your personal data. This Privacy Policy outlines how we collect, use, and safeguard your information when you use our platform.
            </p>

            <h2 id="pdpa" className="text-2xl font-bold">2. Compliance with PDPA 2010</h2>
            <p>
              We process your personal data in accordance with the Personal Data Protection Act 2010 ("PDPA") of Malaysia. By using our services, you consent to the processing of your personal data as described in this policy.
            </p>

            <h2 id="data-collection" className="text-2xl font-bold">3. Data We Collect</h2>
            <p>
              We collect information you provide directly to us, including:
            </p>
            <ul>
              <li>Identity Data: Full name, phone number.</li>
              <li>Location Data: Precise GPS location when requesting assistance.</li>
              <li>Vehicle Data: Make, model, and plate number.</li>
              <li>Account Data: Email address and password.</li>
            </ul>

            <h2 id="data-usage" className="text-2xl font-bold">4. How We Use Data</h2>
            <p>
              We use your data to:
            </p>
            <ul>
              <li>Provide and facilitate roadside assistance services.</li>
              <li>Connect you with service providers near your location.</li>
              <li>Process payments and communicate with you about your requests.</li>
              <li>Improve platform safety and prevent fraud.</li>
            </ul>

            <h2 id="data-sharing" className="text-2xl font-bold">5. Data Sharing</h2>
            <p>
              We only share your necessary information (such as phone number, location, and vehicle details) with the specific independent Service Provider who accepts your request, solely for the purpose of fulfilling that service.
            </p>

            <h2 id="rights" className="text-2xl font-bold">6. Your Rights</h2>
            <p>
              Under the PDPA, you have the right to request access to and correction of your personal data held by us. You may also withdraw your consent to our processing of your personal data at any time by contacting our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
