-- Database: bear_analytics_service

-- DROP DATABASE IF EXISTS bear_analytics_service;

CREATE DATABASE bear_analytics_service
    WITH
    OWNER = root
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Create user_analytics table
CREATE TABLE user_analytics (
    analytics_id VARCHAR(50) NOT NULL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    metric_type VARCHAR(50) NOT NULL, -- 'login', 'post_created', 'comment_added', 'like_given', 'follow', etc.
    value INTEGER DEFAULT 1,
    date_recorded DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create content_analytics table
CREATE TABLE content_analytics (
    analytics_id VARCHAR(50) NOT NULL PRIMARY KEY,
    content_id VARCHAR(50) NOT NULL, -- post_id, comment_id, etc.
    content_type VARCHAR(20) NOT NULL, -- 'post', 'comment', 'media'
    metric_type VARCHAR(50) NOT NULL, -- 'view', 'like', 'share', 'comment', 'save'
    value INTEGER DEFAULT 1,
    date_recorded DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create system_analytics table
CREATE TABLE system_analytics (
    analytics_id VARCHAR(50) NOT NULL PRIMARY KEY,
    metric_name VARCHAR(100) NOT NULL, -- 'daily_active_users', 'new_registrations', 'total_posts', etc.
    metric_value NUMERIC NOT NULL,
    date_recorded DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_engagement table
CREATE TABLE user_engagement (
    engagement_id VARCHAR(50) NOT NULL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    engaged_with_user_id VARCHAR(50), -- For interactions with other users
    content_id VARCHAR(50), -- For interactions with content
    content_type VARCHAR(20), -- 'post', 'comment', 'user_profile', 'group'
    action_type VARCHAR(50) NOT NULL, -- 'view', 'like', 'comment', 'share', 'follow', 'message'
    duration_seconds INTEGER, -- For content viewing time
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_user_analytics_user ON user_analytics(user_id);
CREATE INDEX idx_user_analytics_type ON user_analytics(metric_type);
CREATE INDEX idx_user_analytics_date ON user_analytics(date_recorded);
CREATE INDEX idx_content_analytics_content ON content_analytics(content_id);
CREATE INDEX idx_content_analytics_type ON content_analytics(metric_type);
CREATE INDEX idx_content_analytics_date ON content_analytics(date_recorded);
CREATE INDEX idx_system_analytics_name ON system_analytics(metric_name);
CREATE INDEX idx_system_analytics_date ON system_analytics(date_recorded);
CREATE INDEX idx_user_engagement_user ON user_engagement(user_id);
CREATE INDEX idx_user_engagement_action ON user_engagement(action_type);
CREATE INDEX idx_user_engagement_created ON user_engagement(created_at);

-- Foreign key constraints (assuming user-service has a users table)
-- ALTER TABLE user_analytics ADD CONSTRAINT fk_user_analytics_user FOREIGN KEY (user_id) REFERENCES users(user_id);
-- ALTER TABLE content_analytics ADD CONSTRAINT fk_content_analytics_content FOREIGN KEY (content_id) REFERENCES posts(post_id); -- or comments, media, etc.
-- ALTER TABLE user_engagement ADD CONSTRAINT fk_user_engagement_user FOREIGN KEY (user_id) REFERENCES users(user_id);
-- ALTER TABLE user_engagement ADD CONSTRAINT fk_user_engagement_engaged_user FOREIGN KEY (engaged_with_user_id) REFERENCES users(user_id);