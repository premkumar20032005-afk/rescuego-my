-- Provider Applications Table
CREATE TABLE provider_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  service_type TEXT NOT NULL,
  city TEXT NOT NULL,
  status TEXT DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable RLS
ALTER TABLE provider_applications ENABLE ROW LEVEL SECURITY;

-- Allow anonymous and authenticated users to insert applications
CREATE POLICY "Anyone can insert provider applications"
ON provider_applications FOR INSERT
TO public
WITH CHECK (true);

-- Allow admins to select/read applications
CREATE POLICY "Admins can view provider applications"
ON provider_applications FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);
