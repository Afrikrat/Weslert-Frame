-- Create frame styles table
CREATE TABLE IF NOT EXISTS frame_styles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  material TEXT,
  color TEXT,
  width_inches DECIMAL(4,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  frame_style_id UUID REFERENCES frame_styles(id),
  frame_size TEXT NOT NULL,
  image_url TEXT NOT NULL,
  caption_text TEXT,
  total_price DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  payment_method TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample frame styles
INSERT INTO frame_styles (name, description, base_price, material, color, width_inches) VALUES
('Classic Black', 'Elegant black wooden frame perfect for any decor', 25.00, 'Wood', 'Black', 1.5),
('Natural Oak', 'Beautiful natural oak finish with visible grain', 35.00, 'Oak Wood', 'Natural', 2.0),
('Modern White', 'Clean white frame for contemporary spaces', 28.00, 'Wood', 'White', 1.25),
('Vintage Gold', 'Ornate gold-finished frame with decorative details', 45.00, 'Wood', 'Gold', 2.5),
('Rustic Brown', 'Distressed brown wood for a rustic farmhouse look', 32.00, 'Reclaimed Wood', 'Brown', 1.75),
('Silver Metal', 'Sleek aluminum frame with brushed silver finish', 30.00, 'Aluminum', 'Silver', 1.0);
