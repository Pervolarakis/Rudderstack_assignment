-- Create Events Table
CREATE TABLE IF NOT EXISTS Events (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('track', 'identify', 'alias', 'creen', 'page')),
  description TEXT,
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (name, type)
);

-- Create Properties Table
CREATE TABLE IF NOT EXISTS Properties (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('string', 'number', 'boolean')),
  description TEXT,
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  validation_rules JSON,
  UNIQUE (name, type)
);

-- Create Tracking Plans Table
CREATE TABLE IF NOT EXISTS TrackingPlans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Event_Properties Table (Bridge Table for Many-to-Many Relationship)
CREATE TABLE IF NOT EXISTS Event_Properties (
  event_id INTEGER NOT NULL,
  property_id INTEGER NOT NULL,
  required BOOLEAN NOT NULL,
  PRIMARY KEY (event_id, property_id),
  FOREIGN KEY (event_id) REFERENCES Events(id) ON DELETE CASCADE,
  FOREIGN KEY (property_id) REFERENCES Properties(id) ON DELETE CASCADE
);

-- Create TrackingPlan_Events Table (Bridge Table for Many-to-Many Relationship)
CREATE TABLE IF NOT EXISTS TrackingPlan_Events (
  tracking_plan_id INTEGER NOT NULL,
  event_id INTEGER NOT NULL,
  additional_properties_allowed BOOLEAN,
  PRIMARY KEY (tracking_plan_id, event_id),
  FOREIGN KEY (tracking_plan_id) REFERENCES TrackingPlans(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES Events(id) ON DELETE CASCADE
);