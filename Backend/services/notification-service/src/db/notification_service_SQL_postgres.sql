-- Database: bear_notification_service

-- DROP DATABASE IF EXISTS bear_notification_service;

CREATE DATABASE bear_notification_service
    WITH
    OWNER = root
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Create notifications table
CREATE TABLE notifications (
    notification_id VARCHAR(50) NOT NULL PRIMARY KEY,
    recipient_user_id VARCHAR(50) NOT NULL,
    sender_user_id VARCHAR(50),
    type VARCHAR(50) NOT NULL, -- 'like', 'comment', 'follow', 'mention', 'message', etc.
    title VARCHAR(255) NOT NULL,
    content TEXT,
    entity_id VARCHAR(50), -- ID of the related entity (post, comment, etc.)
    entity_type VARCHAR(20), -- 'post', 'comment', 'user', etc.
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_notifications_recipient ON notifications(recipient_user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);
CREATE INDEX idx_notifications_recipient_read ON notifications(recipient_user_id, is_read);

-- Foreign key constraints (assuming user-service has a users table)
-- ALTER TABLE notifications ADD CONSTRAINT fk_recipient_user FOREIGN KEY (recipient_user_id) REFERENCES users(user_id);
-- ALTER TABLE notifications ADD CONSTRAINT fk_sender_user FOREIGN KEY (sender_user_id) REFERENCES users(user_id);