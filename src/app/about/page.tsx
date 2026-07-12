import { Shield, Users, Clock } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-6">About RescueGO</h1>
        <p className="text-xl text-slate-600 leading-relaxed mb-12">
          We are Malaysia's fastest-growing on-demand vehicle assistance platform, connecting stranded drivers with reliable, verified service providers in minutes.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <Clock className="w-8 h-8 text-amber-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Fast Response</h3>
            <p className="text-slate-600 text-sm">We aim to dispatch help within minutes of your request.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <Shield className="w-8 h-8 text-emerald-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Verified Pros</h3>
            <p className="text-slate-600 text-sm">Every mechanic and driver is vetted for quality and safety.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <Users className="w-8 h-8 text-blue-500 mb-4" />
            <h3 className="text-lg font-semibold mb-2">Community First</h3>
            <p className="text-slate-600 text-sm">Built by Malaysians, for Malaysians on the road.</p>
          </div>
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-4">Our Mission</h2>
        <p className="text-slate-600 leading-relaxed mb-8">
          Vehicle breakdowns are stressful. Our mission is to remove the anxiety from roadside emergencies by providing a transparent, flat-rate, and reliable service platform. No more haggling on the side of the highway—just tap a button and help is on the way.
        </p>
      </div>
    </div>
  );
}
