-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  full_name TEXT,
  phone TEXT,
  preferred_language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create disease_detections table
CREATE TABLE public.disease_detections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(user_id),
  image_url TEXT NOT NULL,
  disease_name TEXT,
  confidence FLOAT,
  severity TEXT,
  recommendations TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create community_notices table
CREATE TABLE public.community_notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  disease_type TEXT,
  location TEXT,
  severity TEXT DEFAULT 'medium',
  created_at TIMESTAMPTZ DEFAULT now(),
  is_trending BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease_detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_notices ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Disease detections policies
CREATE POLICY "Users can view their own detections"
  ON public.disease_detections FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own detections"
  ON public.disease_detections FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own detections"
  ON public.disease_detections FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own detections"
  ON public.disease_detections FOR DELETE
  USING (auth.uid() = user_id);

-- Community notices policies (public read, admin write)
CREATE POLICY "Anyone can view community notices"
  ON public.community_notices FOR SELECT
  USING (true);

-- Create storage bucket for crop images
INSERT INTO storage.buckets (id, name, public)
VALUES ('crop-images', 'crop-images', true);

-- Storage policies
CREATE POLICY "Anyone can view crop images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'crop-images');

CREATE POLICY "Authenticated users can upload crop images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'crop-images' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'crop-images' AND auth.role() = 'authenticated');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_disease_detections_updated_at
  BEFORE UPDATE ON public.disease_detections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample community notices
INSERT INTO public.community_notices (title, description, disease_type, location, severity, is_trending)
VALUES 
  ('Leaf Rust Alert', 'Increased cases of leaf rust detected in wheat crops across Punjab region. Farmers should inspect their crops regularly.', 'Leaf Rust', 'Punjab', 'high', true),
  ('Bacterial Blight Warning', 'Bacterial blight spreading in rice paddies. Ensure proper drainage and avoid over-irrigation.', 'Bacterial Blight', 'Maharashtra', 'medium', true),
  ('Early Blight Detection', 'Early blight symptoms observed in tomato crops. Apply fungicides and remove infected leaves promptly.', 'Early Blight', 'Karnataka', 'medium', false);