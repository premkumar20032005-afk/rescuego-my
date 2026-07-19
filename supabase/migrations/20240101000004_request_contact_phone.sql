-- Roadside jobs are often reported from a borrowed or different phone than
-- the one on file, so let customers give providers a number to call for
-- this specific request instead of always relying on their profile phone.
ALTER TABLE requests ADD COLUMN contact_phone TEXT;
