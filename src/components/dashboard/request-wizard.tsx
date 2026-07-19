"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ServiceCategory } from "@/lib/db/service_categories";
import { Database } from "@/lib/supabase/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Wrench, MapPin, Car, CheckCircle2, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createServiceRequest } from "@/app/actions/requests";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getServiceIcon } from "@/lib/icon-map";
type Vehicle = Database["public"]["Tables"]["vehicles"]["Row"];

// Dynamic import of Map to prevent SSR issues with Leaflet. Declared at module
// scope (not inside the component) so it isn't recreated - and remounted,
// losing its state - on every render.
const MapComponent = dynamic(() => import("./map"), { ssr: false });

export function RequestWizard({
  categories,
  vehicles,
  userId,
  initialCategorySlug,
  defaultContactPhone,
}: {
  categories: ServiceCategory[];
  vehicles: Vehicle[];
  userId: string;
  initialCategorySlug?: string;
  defaultContactPhone?: string;
}) {
  const preselected = initialCategorySlug
    ? categories.find((c) => c.slug === initialCategorySlug) ?? null
    : null;

  const [step, setStep] = useState(preselected ? 2 : 1);
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(preselected);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState("");
  const [addressTouched, setAddressTouched] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [contactPhone, setContactPhone] = useState(defaultContactPhone || "");
  const [vehicleDetails, setVehicleDetails] = useState({ plate_number: "", make_model: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Basic flow logic
  const nextStep = () => setStep(s => Math.min(4, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  // Look up a human-readable address for the dropped pin so providers get
  // something more useful than raw coordinates; the customer can still edit
  // or add a landmark, and manual edits are never overwritten by later pins.
  useEffect(() => {
    if (!position || addressTouched) return;

    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- legitimate async fetch + loading indicator, not derived state
    setIsGeocoding(true);

    fetch(`/api/geocode?lat=${position[0]}&lng=${position[1]}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data?.address) setAddress(data.address);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setIsGeocoding(false);
      });

    return () => {
      cancelled = true;
    };
  }, [position, addressTouched]);

  const submitRequest = async () => {
    if (!selectedCategory || !position) return;

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("categoryId", selectedCategory.id);
    formData.append("lat", position[0].toString());
    formData.append("lng", position[1].toString());
    formData.append("address", address);
    formData.append("contactPhone", contactPhone);
    formData.append("plateNumber", vehicleDetails.plate_number);
    formData.append("makeModel", vehicleDetails.make_model);
    formData.append("description", vehicleDetails.description);

    const result = await createServiceRequest(formData);
    
    setIsSubmitting(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Request submitted successfully!");
      router.push("/dashboard/history");
    }
  };

  const slideVariants: any = {
    initial: { x: 50, opacity: 0 },
    enter: { x: 0, opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { x: -50, opacity: 0, transition: { duration: 0.2, ease: "easeIn" } }
  };

  return (
    <div className="w-full">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted z-0 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />
          </div>
          
          {[
            { num: 1, label: "Service", icon: Wrench },
            { num: 2, label: "Location", icon: MapPin },
            { num: 3, label: "Details", icon: Car },
            { num: 4, label: "Review", icon: CheckCircle2 }
          ].map((s) => (
            <div key={s.num} className="relative z-10 flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-colors duration-300 ${
                step >= s.num 
                  ? "bg-primary border-primary text-primary-foreground" 
                  : "bg-background border-muted-foreground text-muted-foreground"
              }`}>
                <s.icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-medium ${step >= s.num ? "text-primary" : "text-muted-foreground"}`}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative min-h-[400px] overflow-hidden">
        <AnimatePresence mode="wait">
          
          {step === 1 && (
            <motion.div
              key="step1"
              variants={slideVariants}
              initial="initial"
              animate="enter"
              exit="exit"
              className="w-full"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Select a Service</CardTitle>
                  <CardDescription>What kind of help do you need?</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {categories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                      <div className="bg-slate-100 p-3 rounded-full mb-3">
                        <Wrench className="w-6 h-6 text-slate-400" />
                      </div>
                      <h3 className="font-medium text-slate-900 mb-1">No Services Available</h3>
                      <p className="text-sm text-slate-500 max-w-sm">
                        There are currently no active services configured. Please contact support or check back later.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="relative">
                        <Input
                          placeholder="Search for a service..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10"
                        />
                        <Wrench className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {categories
                          .filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                          .map((category) => {
                            const CategoryIcon = getServiceIcon(category.icon);
                            return (
                              <div
                                key={category.id}
                                onClick={() => {
                                  setSelectedCategory(category);
                                  nextStep();
                                }}
                                className={`cursor-pointer border rounded-xl p-4 text-center transition-all duration-200 flex flex-col h-full ${
                                  selectedCategory?.id === category.id
                                    ? "border-primary bg-primary/5 ring-2 ring-primary ring-offset-2"
                                    : "border-border hover:border-primary/50 hover:bg-slate-50"
                                }`}
                              >
                                <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shrink-0">
                                  <CategoryIcon className="w-6 h-6 text-primary" />
                                </div>
                                <h4 className="font-medium text-sm flex-grow flex items-center justify-center">{category.name}</h4>
                                {(category.base_price_min !== null || category.base_price_max !== null) && (
                                  <p className="text-xs text-muted-foreground mt-2 pt-2 border-t font-medium">
                                    RM {category.base_price_min} - RM {category.base_price_max}
                                  </p>
                                )}
                              </div>
                            );
                          })}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              variants={slideVariants}
              initial="initial"
              animate="enter"
              exit="exit"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Where are you?</CardTitle>
                  <CardDescription>Pin your exact location on the map.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-80 w-full bg-slate-100 rounded-lg overflow-hidden border border-slate-300 relative z-0">
                    <MapComponent position={position} setPosition={setPosition} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Pickup Address / Landmark</Label>
                    <Textarea
                      id="address"
                      placeholder="e.g. Layby before Rawang R&R, northbound PLUS highway"
                      rows={2}
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        setAddressTouched(true);
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      {isGeocoding
                        ? "Detecting address from your pin..."
                        : "We fill this in from your pin — edit it or add a landmark so the provider can find you faster."}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button onClick={nextStep} disabled={!position || !address.trim()}>
                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              variants={slideVariants}
              initial="initial"
              animate="enter"
              exit="exit"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Vehicle & Contact Details</CardTitle>
                  <CardDescription>Tell us about the vehicle, the problem, and how to reach you.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="plate_number">License Plate Number</Label>
                      <Input
                        id="plate_number"
                        placeholder="e.g. VHA 1234"
                        value={vehicleDetails.plate_number}
                        onChange={(e) => setVehicleDetails({...vehicleDetails, plate_number: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="make_model">Vehicle Make & Model</Label>
                      <Input
                        id="make_model"
                        placeholder="e.g. Perodua Myvi"
                        value={vehicleDetails.make_model}
                        onChange={(e) => setVehicleDetails({...vehicleDetails, make_model: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contact_phone">Contact Number for This Request</Label>
                      <Input
                        id="contact_phone"
                        type="tel"
                        placeholder="e.g. 012-345 6789"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        The provider will call this number — change it if you&apos;re not using your usual phone.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Describe the issue</Label>
                      <Textarea
                        id="description"
                        placeholder="e.g. My car won't start, I think it's the battery..."
                        rows={4}
                        value={vehicleDetails.description}
                        onChange={(e) => setVehicleDetails({...vehicleDetails, description: e.target.value})}
                      />
                      <p className="text-xs text-muted-foreground">
                        The more detail you give, the better prepared your provider will be.
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button
                    onClick={nextStep}
                    disabled={
                      !vehicleDetails.plate_number ||
                      !vehicleDetails.make_model ||
                      !contactPhone.trim() ||
                      !vehicleDetails.description.trim()
                    }
                  >
                    Review <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              variants={slideVariants}
              initial="initial"
              animate="enter"
              exit="exit"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Review & Confirm</CardTitle>
                  <CardDescription>Please review your request before confirming.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-50 p-4 rounded-lg space-y-4">
                     <div className="flex justify-between border-b pb-2">
                       <span className="text-muted-foreground">Service</span>
                       <span className="font-medium">{selectedCategory?.name}</span>
                     </div>
                     <div className="flex justify-between border-b pb-2">
                       <span className="text-muted-foreground">Estimated Price</span>
                       <span className="font-medium text-amber-600">
                         RM {selectedCategory?.base_price_min} - RM {selectedCategory?.base_price_max}
                       </span>
                     </div>
                     <div className="flex justify-between border-b pb-2 gap-4">
                       <span className="text-muted-foreground shrink-0">Location</span>
                       <span className="font-medium text-right">{address}</span>
                     </div>
                     <div className="flex justify-between border-b pb-2">
                       <span className="text-muted-foreground">Vehicle</span>
                       <span className="font-medium">
                         {vehicleDetails.make_model} &middot; {vehicleDetails.plate_number}
                       </span>
                     </div>
                     <div className="flex justify-between border-b pb-2">
                       <span className="text-muted-foreground">Contact Number</span>
                       <span className="font-medium">{contactPhone}</span>
                     </div>
                     <div className="flex justify-between gap-4">
                       <span className="text-muted-foreground shrink-0">Issue</span>
                       <span className="font-medium text-right">{vehicleDetails.description}</span>
                     </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={prevStep} disabled={isSubmitting}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={submitRequest}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    {isSubmitting ? "Submitting..." : "Confirm Request"}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
