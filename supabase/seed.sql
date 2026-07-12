-- Seed Service Categories
INSERT INTO public.service_categories (slug, name, icon, base_price_min, base_price_max, active)
VALUES 
  ('towing', 'Towing', 'Truck', 100, 300, true),
  ('battery', 'Battery Jumpstart & Replacement', 'Battery', 50, 400, true),
  ('tyre', 'Tyre Replacement', 'CircleDashed', 50, 150, true),
  ('fuel', 'Fuel Delivery', 'Fuel', 40, 80, true),
  ('lockout', 'Lockout Service', 'Key', 80, 150, true),
  ('repair', 'Breakdown Repair', 'Wrench', 100, 500, true),
  ('car_wash', 'Mobile Car Wash', 'Droplets', 60, 200, true),
  ('servicing', 'Routine Servicing', 'Settings', 150, 800, true),
  ('insurance', 'Insurance Assist', 'ShieldCheck', 0, 0, true)
ON CONFLICT (slug) DO NOTHING;
