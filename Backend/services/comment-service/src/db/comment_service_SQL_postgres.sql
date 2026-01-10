-- Database: bear_comment_service

-- DROP DATABASE IF EXISTS bear_comment_service;

CREATE DATABASE bear_comment_service
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

-- Create comments table
CREATE TABLE comments (
    comment_id VARCHAR(50) NOT NULL PRIMARY KEY,
    post_id VARCHAR(50) NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    comment_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    comment_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_created_at ON comments(comment_created_at);

-- Sample data
INSERT INTO comments (comment_id, post_id, user_id, content, comment_created_at, comment_updated_at) VALUES
('comment-001', '00-00', 'user-001', 'Đây là bình luận đầu tiên!', CURRENT_TIMESTAMP - INTERVAL '4 days', CURRENT_TIMESTAMP - INTERVAL '4 days'),
('comment-002', '00-01', 'user-002', 'Cảm ơn bài hướng dẫn rất chi tiết.', CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP - INTERVAL '3 days'),
('comment-003', '00-02', 'user-003', 'Blog này thực sự hữu ích cho người mới bắt đầu.', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '2 days');