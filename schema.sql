CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(150) UNIQUE NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(20) NOT NULL DEFAULT 'citizen' CHECK (role IN ('citizen','staff','admin')),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT
);

CREATE TABLE IF NOT EXISTS complaints (
  id SERIAL PRIMARY KEY,
  public_id VARCHAR(30) UNIQUE,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  category VARCHAR(50) NOT NULL,
  priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW','MEDIUM','HIGH','CRITICAL')),
  image_url TEXT,
  latitude DOUBLE PRECISION NOT NULL CHECK (latitude BETWEEN -90 AND 90),
  longitude DOUBLE PRECISION NOT NULL CHECK (longitude BETWEEN -180 AND 180),
  address TEXT,
  department_id INTEGER REFERENCES departments(id) ON DELETE SET NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING','IN_PROGRESS','RESOLVED','REJECTED')),
  duplicate_of INTEGER REFERENCES complaints(id) ON DELETE SET NULL,
  duplicate_count INTEGER NOT NULL DEFAULT 0 CHECK (duplicate_count >= 0),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS complaint_location_index ON complaints(latitude, longitude);
CREATE INDEX IF NOT EXISTS complaint_category_index ON complaints(category);
CREATE INDEX IF NOT EXISTS complaint_status_index ON complaints(status);
CREATE INDEX IF NOT EXISTS complaint_created_index ON complaints(created_at DESC);

INSERT INTO departments (name,code,description) VALUES
('Road Department','ROAD','Potholes, damaged roads and road maintenance'),
('Sanitation Department','SANITATION','Garbage and waste-related complaints'),
('Electricity Department','ELECTRICITY','Streetlights and electrical infrastructure'),
('Water Department','WATER','Water leakage and pipeline problems'),
('Drainage Department','DRAINAGE','Blocked drains and drainage problems')
ON CONFLICT (code) DO NOTHING;

-- Generate public complaint IDs after the initial insert.
CREATE OR REPLACE FUNCTION set_complaint_public_id() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.public_id IS NULL OR NEW.public_id = '' THEN
    NEW.public_id := 'CF-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(NEW.id::text, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS complaints_public_id_trigger ON complaints;
CREATE TRIGGER complaints_public_id_trigger
BEFORE INSERT ON complaints
FOR EACH ROW EXECUTE FUNCTION set_complaint_public_id();
