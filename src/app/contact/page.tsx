import { ContactForm } from "@/components/contact-form";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-6">Contact Us</h1>
        <p className="text-xl text-slate-600 leading-relaxed mb-12 max-w-2xl">
          Have a question or need assistance? Our support team is available to help. Fill out the form below or reach us directly via email or phone.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <ContactForm />
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold mb-4">Direct Contact</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase">Support Email</p>
                  <a href="mailto:support@rescuego.my" className="text-lg text-amber-600 hover:underline">support@rescuego.my</a>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase">Phone (HQ)</p>
                  <p className="text-lg text-slate-900">+60 3-1234 5678</p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500 uppercase">Emergency Hotline</p>
                  <p className="text-lg text-slate-900 font-bold">1-800-RESCUE</p>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-sm">
              <h3 className="text-xl font-bold mb-4 text-amber-500">Business Hours</h3>
              <ul className="space-y-2 text-slate-300">
                <li className="flex justify-between">
                  <span>Emergency Service</span>
                  <span className="font-semibold text-white">24/7</span>
                </li>
                <li className="flex justify-between border-t border-slate-700 pt-2 mt-2">
                  <span>Customer Support</span>
                  <span className="font-semibold text-white">9:00 AM - 6:00 PM</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
