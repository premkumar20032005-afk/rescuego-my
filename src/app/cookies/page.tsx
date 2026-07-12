export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-8">
          <p className="text-amber-700 text-sm">
            <strong>Disclaimer:</strong> This is a template for demonstration purposes only and does not constitute legal advice.
          </p>
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-4">Cookie Policy</h1>
        <p className="text-slate-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="prose prose-slate max-w-none">
          <p>
            RescueGO MY uses cookies and similar tracking technologies to enhance your experience on our platform. This policy explains how and why we use these technologies.
          </p>

          <h2 className="text-2xl font-bold">1. What are Cookies?</h2>
          <p>
            Cookies are small text files placed on your device when you visit our website. They help the site function properly, remember your preferences, and allow us to analyze how the site is being used.
          </p>

          <h2 className="text-2xl font-bold">2. How We Use Cookies</h2>
          <p>We use cookies for the following purposes:</p>
          <ul>
            <li><strong>Essential Cookies:</strong> Required for the platform to operate correctly, such as keeping you logged securely into your account (e.g., Supabase authentication cookies).</li>
            <li><strong>Functional Cookies:</strong> Used to remember your preferences and settings.</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with the website so we can improve the user experience.</li>
          </ul>

          <h2 className="text-2xl font-bold">3. Managing Cookies</h2>
          <p>
            You can control or delete cookies through your browser settings. However, disabling essential cookies may prevent you from logging in or using core features of the RescueGO platform.
          </p>
        </div>
      </div>
    </div>
  );
}
