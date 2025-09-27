-- Create a table for neurodiversity profiles
CREATE TABLE neuroprofiles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT
);

-- Insert default profiles
INSERT INTO neuroprofiles (name, description) VALUES
  ('dyslexia', 'Adjustments for dyslexia, including simplified text and specific fonts.'),
  ('adhd', 'Adjustments for ADHD, including breaking down content into smaller chunks and highlighting key information.');

-- Create a table for user-specific profiles and settings
CREATE TABLE user_profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  neuroprofile_id INTEGER REFERENCES neuroprofiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update the updated_at timestamp
CREATE TRIGGER on_user_profiles_updated
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE PROCEDURE handle_updated_at();

-- Create a table for user progress tracking
CREATE TABLE progress (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id VARCHAR(255),
  status VARCHAR(50),
  score INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
