CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'citizen',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

CREATE TABLE complaints (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    image_url TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    address TEXT,
    department_id INTEGER REFERENCES departments(id),
    status VARCHAR(30) DEFAULT 'PENDING',
    duplicate_of INTEGER REFERENCES complaints(id),
    duplicate_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX complaint_location_index ON complaints(latitude, longitude);
CREATE INDEX complaint_category_index ON complaints(category);
CREATE INDEX complaint_status_index ON complaints(status);

INSERT INTO departments (name, code, description) VALUES
('Road Department', 'ROAD', 'Potholes, damaged roads and road maintenance'),
('Sanitation Department', 'SANITATION', 'Garbage and waste-related complaints'),
('Electricity Department', 'ELECTRICITY', 'Streetlights and electrical infrastructure'),
('Water Department', 'WATER', 'Water leakage and pipeline problems'),
('Drainage Department', 'DRAINAGE', 'Blocked drains and drainage problems');
