-- Custom Types
CREATE TYPE user_role AS ENUM ('customer', 'provider', 'admin');
CREATE TYPE request_status AS ENUM ('pending', 'accepted', 'dispatched', 'en_route', 'arrived', 'in_progress', 'completed', 'cancelled');

-- Profiles Table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'customer'::user_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Vehicles Table
CREATE TABLE vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  plate_number TEXT NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Service Categories Table
CREATE TABLE service_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  icon TEXT,
  base_price_min NUMERIC,
  base_price_max NUMERIC,
  active BOOLEAN DEFAULT true NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Requests Table
CREATE TABLE requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE SET NULL,
  category_id UUID REFERENCES service_categories(id) ON DELETE RESTRICT NOT NULL,
  provider_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  status request_status DEFAULT 'pending'::request_status NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  address_text TEXT NOT NULL,
  description TEXT,
  photos JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  accepted_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Request Status Events (Audit Trail)
CREATE TABLE request_status_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES requests(id) ON DELETE CASCADE NOT NULL,
  status request_status NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Reviews Table
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES requests(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW; 
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER update_vehicles_modtime BEFORE UPDATE ON vehicles FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- Row Level Security (RLS)

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE request_status_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Providers can view customer profiles of assigned requests" ON profiles FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM requests WHERE requests.customer_id = profiles.id AND requests.provider_id = auth.uid()
  )
);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Vehicles Policies
CREATE POLICY "Users can view their own vehicles" ON vehicles FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can insert their own vehicles" ON vehicles FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update their own vehicles" ON vehicles FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete their own vehicles" ON vehicles FOR DELETE USING (auth.uid() = owner_id);

-- Service Categories Policies
CREATE POLICY "Anyone can view active service categories" ON service_categories FOR SELECT USING (active = true);

-- Requests Policies
CREATE POLICY "Customers can view their own requests" ON requests FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "Providers can view requests assigned to them" ON requests FOR SELECT USING (auth.uid() = provider_id);
CREATE POLICY "Providers can view pending requests" ON requests FOR SELECT USING (status = 'pending');
CREATE POLICY "Customers can insert their own requests" ON requests FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "Customers can update their own requests (e.g. cancel)" ON requests FOR UPDATE USING (auth.uid() = customer_id);
CREATE POLICY "Providers can update assigned requests" ON requests FOR UPDATE USING (auth.uid() = provider_id);

-- Request Status Events Policies
CREATE POLICY "Customers can view events for their requests" ON request_status_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM requests WHERE requests.id = request_status_events.request_id AND requests.customer_id = auth.uid())
);
CREATE POLICY "Providers can view events for their assigned requests" ON request_status_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM requests WHERE requests.id = request_status_events.request_id AND requests.provider_id = auth.uid())
);
-- Allow service role (admin/edge functions) to insert events easily, or allow trigger to do it (triggers bypass RLS)

-- Reviews Policies
CREATE POLICY "Customers can view reviews" ON reviews FOR SELECT USING (
  EXISTS (SELECT 1 FROM requests WHERE requests.id = reviews.request_id AND requests.customer_id = auth.uid())
);
CREATE POLICY "Providers can view their own reviews" ON reviews FOR SELECT USING (
  EXISTS (SELECT 1 FROM requests WHERE requests.id = reviews.request_id AND requests.provider_id = auth.uid())
);
CREATE POLICY "Customers can leave reviews for their requests" ON reviews FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM requests WHERE requests.id = reviews.request_id AND requests.customer_id = auth.uid())
);

-- Auto-insert profile on signup (Supabase Auth Trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'User'),
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Trigger to create request_status_events on request insert/update
CREATE OR REPLACE FUNCTION public.log_request_status_event()
RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO public.request_status_events (request_id, status)
    VALUES (NEW.id, NEW.status);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_request_status_change
  AFTER INSERT OR UPDATE ON public.requests
  FOR EACH ROW EXECUTE PROCEDURE public.log_request_status_event();
