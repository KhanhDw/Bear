-- Database: bear_feed_service

-- DROP DATABASE IF EXISTS bear_feed_service;

CREATE DATABASE bear_feed_service
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

-- Create feed table
CREATE TABLE feed (
    feed_id VARCHAR(50) NOT NULL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    post_id VARCHAR(50) NOT NULL,
    feed_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_feed_user_id ON feed(user_id);
CREATE INDEX idx_feed_post_id ON feed(post_id);
CREATE INDEX idx_feed_created_at ON feed(feed_created_at);

-- Sample data
INSERT INTO feed (feed_id, user_id, post_id, feed_created_at) VALUES
('feed-001', 'user-001', '00-00', CURRENT_TIMESTAMP - INTERVAL '5 days'),
('feed-002', 'user-001', '00-01', CURRENT_TIMESTAMP - INTERVAL '4 days'),
('feed-003', 'user-002', '00-02', CURRENT_TIMESTAMP - INTERVAL '3 days'),
('feed-004', 'user-003', '00-00', CURRENT_TIMESTAMP - INTERVAL '2 days');