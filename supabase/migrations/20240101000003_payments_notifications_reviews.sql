-- Final amount on requests (set by provider on completion, billed to customer)
ALTER TABLE requests ADD COLUMN final_amount NUMERIC;

-- Reconcile service_categories with the marketing catalog in src/lib/services.ts
-- (slug + price alignment so the request wizard quotes the same price as the site)
UPDATE service_categories SET slug = 'wash' WHERE slug = 'car_wash';
UPDATE service_categories SET base_price_min = 150, base_price_max = 300 WHERE slug = 'towing';
UPDATE service_categories SET base_price_min = 50, base_price_max = 350 WHERE slug = 'battery';
UPDATE service_categories SET base_price_min = 60, base_price_max = 150 WHERE slug = 'tyre';
UPDATE service_categories SET base_price_min = 40, base_price_max = 80 WHERE slug = 'fuel';
UPDATE service_categories SET base_price_min = 80, base_price_max = 150 WHERE slug = 'lockout';
UPDATE service_categories SET base_price_min = 50, base_price_max = 200, name = 'Mobile Car Wash' WHERE slug = 'wash';

-- Payments Table
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES requests(id) ON DELETE CASCADE NOT NULL UNIQUE,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'MYR' NOT NULL,
  billplz_bill_id TEXT,
  billplz_collection_id TEXT,
  status TEXT DEFAULT 'pending' NOT NULL,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view payments for their requests" ON payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM requests WHERE requests.id = payments.request_id AND requests.customer_id = auth.uid())
);
CREATE POLICY "Providers can view payments for their assigned requests" ON payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM requests WHERE requests.id = payments.request_id AND requests.provider_id = auth.uid())
);
-- No public INSERT/UPDATE policy: writes go through the service-role client only
-- (server action creates the Billplz bill, webhook confirms payment).

-- Notifications Table
CREATE TABLE notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  link TEXT,
  read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
-- No public INSERT policy: notifications are written cross-user (e.g. a provider
-- accepting a job writes a notification for the customer), so inserts go through
-- the service-role client only.

ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Reviews: one review per request, and viewable by anyone (needed for public/aggregate rating display)
ALTER TABLE reviews ADD CONSTRAINT reviews_request_id_unique UNIQUE (request_id);

DROP POLICY IF EXISTS "Customers can view reviews" ON reviews;
DROP POLICY IF EXISTS "Providers can view their own reviews" ON reviews;
CREATE POLICY "Anyone can view reviews" ON reviews FOR SELECT USING (true);

-- Admin management policies
CREATE POLICY "Admins can update provider applications" ON provider_applications FOR UPDATE
TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

CREATE POLICY "Admins can update any profile" ON profiles FOR UPDATE
USING (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
WITH CHECK (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'));

-- Allow the parties of a request to log status events themselves (the trigger already
-- does this too, but acceptRequest/updateRequestStatus also insert manually)
CREATE POLICY "Request parties can insert status events" ON request_status_events FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM requests
    WHERE requests.id = request_status_events.request_id
    AND (requests.customer_id = auth.uid() OR requests.provider_id = auth.uid())
  )
);

-- Contact messages (public contact form submissions)
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a contact message" ON contact_messages FOR INSERT
TO public
WITH CHECK (true);

CREATE POLICY "Admins can view contact messages" ON contact_messages FOR SELECT
TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
