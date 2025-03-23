-- Create admin_auth table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_auth (
    id SERIAL PRIMARY KEY,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin password (admin123)
INSERT INTO admin_auth (password_hash)
VALUES ('admin123')
ON CONFLICT DO NOTHING; 