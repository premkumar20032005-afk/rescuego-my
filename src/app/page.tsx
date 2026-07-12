"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { 
  ArrowRight, ShieldCheck, Clock, CheckCircle2, MapPin, Wrench, Battery, Truck, Droplets, Settings, Key
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const fadeInUp: any = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const services = [
  { slug: "towing", title: "Towing", icon: Truck, desc: "Fast and safe towing to your preferred workshop.", color: "bg-blue-100 text-blue-600" },
  { slug: "battery", title: "Battery Jumpstart", icon: Battery, desc: "Quick jumpstarts or battery replacements on the spot.", color: "bg-amber-100 text-amber-600" },
  { slug: "tyre", title: "Tyre Replacement", icon: Wrench, desc: "Flat tyre? We'll change it or patch it up.", color: "bg-slate-100 text-slate-600" },
  { slug: "fuel", title: "Fuel Delivery", icon: Droplets, desc: "Run out of gas? We'll deliver enough to get you to a station.", color: "bg-green-100 text-green-600" },
  { slug: "lockout", title: "Lockout Service", icon: Key, desc: "Locked your keys in the car? We can help you get back in.", color: "bg-purple-100 text-purple-600" },
  { slug: "wash", title: "Routine Servicing", icon: Settings, desc: "Mobile oil change and basic maintenance.", color: "bg-rose-100 text-rose-600" },
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background pt-24 pb-32">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <motion.div 
            className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              Available 24/7 across Malaysia
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
              Where are you <span className="text-primary">stuck?</span>
            </motion.h1>
            
            <motion.p variants={fadeInUp} className="text-xl text-slate-600 leading-relaxed">
              Get instant help for towing, battery, tyre, and more. We dispatch the nearest verified professional to get you back on the road safely.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <Link href="/request">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full">
                  Request Help Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Background decorative elements */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl opacity-50"></div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Our Services</h2>
            <p className="text-lg text-slate-600">Whatever the problem, we have a specialist ready to assist you.</p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {services.map((service, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Link href={`/services/${service.slug}`} className="block h-full cursor-pointer">
                  <Card className="group h-full hover:shadow-lg transition-all duration-300 border-border/50 hover:border-primary/20">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${service.color}`}>
                        <service.icon className="w-6 h-6" />
                      </div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">{service.desc}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">How It Works</h2>
            <p className="text-lg text-slate-600">Three simple steps to get you moving again.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-border/60 z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md border mb-6 text-primary">
                <MapPin className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-2">1. Pin Location</h3>
              <p className="text-slate-600">Tell us where you are and what service you need using our simple app.</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md border mb-6 text-primary">
                <Clock className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-2">2. Get Matched</h3>
              <p className="text-slate-600">We instantly connect you with the nearest verified service provider.</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md border mb-6 text-primary">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-2">3. Problem Solved</h3>
              <p className="text-slate-600">Help arrives quickly. Pay securely through the app once completed.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Testimonials */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="flex justify-center mb-4">
              <ShieldCheck className="w-12 h-12 text-green-500" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Trusted by Thousands</h2>
            <p className="text-lg text-slate-600">All our providers are verified, insured, and highly rated.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Ahmad K.", role: "Customer", quote: "My battery died in a basement parking. RescueGO had someone there in 20 minutes!" },
              { name: "Sarah L.", role: "Customer", quote: "Very professional towing service. I could track the truck live on the map. Highly recommended." },
              { name: "David Wong", role: "Customer", quote: "Transparent pricing. I knew exactly how much the tyre replacement would cost before booking." },
            ].map((testimonial, idx) => (
              <Card key={idx} className="bg-slate-50 border-none shadow-sm">
                <CardContent className="pt-6">
                  <div className="flex text-amber-400 mb-4">
                    {[1,2,3,4,5].map(star => <span key={star}>★</span>)}
                  </div>
                  <p className="italic text-slate-700 mb-6">&quot;{testimonial.quote}&quot;</p>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-4 md:px-6 max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
          </div>
          
          {/* @ts-ignore */}
          <Accordion type="single" collapsible className="w-full bg-white rounded-2xl shadow-sm border p-4">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-left font-semibold">How long does it take for help to arrive?</AccordionTrigger>
              <AccordionContent className="text-slate-600 text-base">
                Most providers arrive within 20–45 minutes depending on your location and traffic.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-left font-semibold">How do I pay for the service?</AccordionTrigger>
              <AccordionContent className="text-slate-600 text-base">
                Pay securely in the app after service completion — card, FPX, or e-wallet.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-left font-semibold">Are the mechanics and tow trucks verified?</AccordionTrigger>
              <AccordionContent className="text-slate-600 text-base">
                Every provider passes identity verification and holds valid insurance before joining.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

    </div>
  );
}
