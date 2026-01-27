-- 002-add-order-stages-and-timeline.sql

-- تحديث جدول الطلبات
ALTER TABLE orders 
ADD COLUMN estimated_prep_time INTEGER,
ADD COLUMN estimated_delivery_time INTEGER,
ADD COLUMN current_stage VARCHAR(50) DEFAULT 'pending',
ADD COLUMN stage_started_at TIMESTAMP;

-- إنشاء جدول مراحل الطلب
CREATE TABLE IF NOT EXISTS order_stages (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  stage_name VARCHAR(50),
  status VARCHAR(20) DEFAULT 'pending', -- pending, in_progress, completed, failed
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  duration_minutes INTEGER,
  assigned_to INTEGER,
  notes TEXT
);

-- إنشاء جدول التحديثات
CREATE TABLE IF NOT EXISTS order_timeline (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id),
  event_type VARCHAR(50), -- status_changed, note_added, assigned, etc.
  event_data JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  created_by INTEGER
);
