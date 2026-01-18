-- Database: bear_media_service

-- DROP DATABASE IF EXISTS bear_media_service;

CREATE DATABASE bear_media_service
    WITH
    OWNER = root
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Create media_files table
CREATE TABLE media_files (
    media_id VARCHAR(50) NOT NULL PRIMARY KEY,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_url VARCHAR(1000) NOT NULL,
    entity_id VARCHAR(50), -- ID of the related entity (post, comment, user profile, etc.)
    entity_type VARCHAR(20), -- 'post', 'comment', 'profile', 'cover', 'message', etc.
    owner_id VARCHAR(50), -- ID of the user who uploaded the file
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted BOOLEAN DEFAULT FALSE,
    metadata JSONB -- Store additional metadata like dimensions for images
);

-- Indexes for better performance
CREATE INDEX idx_media_owner ON media_files(owner_id);
CREATE INDEX idx_media_entity ON media_files(entity_id, entity_type);
CREATE INDEX idx_media_mime_type ON media_files(mime_type);
CREATE INDEX idx_media_upload_date ON media_files(upload_date);
CREATE INDEX idx_media_deleted ON media_files(is_deleted);

-- Foreign key constraints (assuming user-service has a users table)
-- ALTER TABLE media_files ADD CONSTRAINT fk_media_owner FOREIGN KEY (owner_id) REFERENCES users(user_id);