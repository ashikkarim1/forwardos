-- Data Rooms (1:1 with deals)
CREATE TABLE IF NOT EXISTS data_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{
    "allow_downloads": true,
    "allow_exports": false,
    "watermark": false,
    "screenshot_detection": false
  }'::jsonb
);

-- Documents in data rooms
CREATE TABLE IF NOT EXISTS data_room_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_room_id UUID NOT NULL REFERENCES data_rooms(id),
  file_name VARCHAR(255) NOT NULL,
  file_type VARCHAR(50),
  file_size INT,
  blob_url VARCHAR(500),  -- Vercel Blob URL
  folder_path VARCHAR(500) DEFAULT 'root',
  uploaded_by UUID NOT NULL,
  uploaded_at TIMESTAMP DEFAULT NOW(),
  is_pinned BOOLEAN DEFAULT false,
  view_count INT DEFAULT 0
);

-- Access permissions
CREATE TABLE IF NOT EXISTS data_room_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_room_id UUID NOT NULL REFERENCES data_rooms(id),
  user_id UUID NOT NULL,
  access_level VARCHAR(50) NOT NULL,  -- 'view_only', 'download', 'export', 'admin'
  granted_by UUID NOT NULL,
  requested_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP,
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  reason VARCHAR(500)
);

-- Access requests
CREATE TABLE IF NOT EXISTS data_room_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_room_id UUID NOT NULL REFERENCES data_rooms(id),
  requester_id UUID NOT NULL,
  requested_access_level VARCHAR(50) NOT NULL,
  reason TEXT,
  status VARCHAR(50) DEFAULT 'pending',  -- 'pending', 'approved', 'denied'
  requested_at TIMESTAMP DEFAULT NOW(),
  reviewed_by UUID,
  reviewed_at TIMESTAMP,
  review_notes TEXT,
  expires_at TIMESTAMP
);

-- Activity log (immutable)
CREATE TABLE IF NOT EXISTS data_room_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_room_id UUID NOT NULL REFERENCES data_rooms(id),
  document_id UUID REFERENCES data_room_documents(id),
  user_id UUID NOT NULL,
  action VARCHAR(50) NOT NULL,  -- 'view', 'download', 'request', 'approve', 'revoke'
  duration_seconds INT,
  ip_address VARCHAR(45),
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_data_rooms_deal_id ON data_rooms(deal_id);
CREATE INDEX idx_data_room_documents_data_room ON data_room_documents(data_room_id);
CREATE INDEX idx_data_room_access_data_room ON data_room_access(data_room_id);
CREATE INDEX idx_data_room_activity_data_room ON data_room_activity(data_room_id);
CREATE INDEX idx_data_room_activity_timestamp ON data_room_activity(timestamp);
