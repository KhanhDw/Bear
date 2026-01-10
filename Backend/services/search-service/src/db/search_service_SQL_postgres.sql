-- Database: bear_search_service

-- DROP DATABASE IF EXISTS bear_search_service;

CREATE DATABASE bear_search_service
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

-- Enable extension for full-text search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create search index table (optional, for more advanced search features)
CREATE TABLE search_index (
    id SERIAL PRIMARY KEY,
    entity_id VARCHAR(50) NOT NULL,
    entity_type VARCHAR(20) NOT NULL, -- 'post', 'user', 'comment'
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better search performance
CREATE INDEX idx_search_entity ON search_index(entity_id, entity_type);
CREATE INDEX idx_search_content_gin ON search_index USING gin(to_tsvector('english', content));

-- Sample data
INSERT INTO search_index (entity_id, entity_type, content) VALUES
('00-00', 'post', 'Chào mừng đến với Bear Post Service welcome to bear post service'),
('00-01', 'post', 'Hướng dẫn sử dụng hệ thống đăng bài guide to using the posting system'),
('00-02', 'post', 'Bí quyết viết blog hiệu quả cho người mới effective blogging tips for beginners'),
('user-001', 'user', 'admin administrator bear admin'),
('user-002', 'user', 'john_doe john doe user'),
('user-003', 'user', 'jane_smith jane smith user'),
('comment-001', 'comment', 'Đây là bình luận đầu tiên this is the first comment'),
('comment-002', 'comment', 'Cảm ơn bài hướng dẫn rất chi tiết thank you for the detailed guide'),
('comment-003', 'comment', 'Blog này thực sự hữu ích cho người mới bắt đầu this blog is really helpful for beginners');