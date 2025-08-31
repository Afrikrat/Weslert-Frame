-- Add mockup_url column and update existing data with Ghana Cedis pricing
ALTER TABLE frame_styles ADD COLUMN IF NOT EXISTS mockup_url TEXT;

-- Update existing frame prices to Ghana Cedis (multiply by ~16 for USD to GHS conversion)
UPDATE frame_styles SET base_price = base_price * 16 WHERE base_price < 100;

-- Add tracking and delivery columns to orders table
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS estimated_delivery DATE;

-- Insert sample frame with mockup
INSERT INTO frame_styles (name, description, base_price, material, color, width_inches, image_url, mockup_url) 
VALUES 
  ('Premium Gold Frame', 'Elegant gold-finished frame perfect for special memories', 480.00, 'Metal', 'Gold', 1.5, '/placeholder.svg?height=300&width=300', '/placeholder.svg?height=400&width=400')
ON CONFLICT (name) DO NOTHING;
