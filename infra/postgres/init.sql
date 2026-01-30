-- Initialization script for Dallas Food Platform
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE SCHEMA IF NOT EXISTS menu;
CREATE SCHEMA IF NOT EXISTS orders;
CREATE SCHEMA IF NOT EXISTS payments;
CREATE SCHEMA IF NOT EXISTS delivery;

-- sample table
CREATE TABLE IF NOT EXISTS menu.items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL
);

-- grant privileges to dallas user (if exists)
DO $$ BEGIN
  BEGIN
    EXECUTE 'GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA menu TO ' || current_setting('app.user', true);
  EXCEPTION WHEN others THEN
    -- ignore
  END;
END $$;
