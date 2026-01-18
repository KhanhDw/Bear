-- Database: bear_moderation_service

-- DROP DATABASE IF EXISTS bear_moderation_service;

CREATE DATABASE bear_moderation_service
    WITH
    OWNER = root
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Create moderation_reports table
CREATE TABLE moderation_reports (
    report_id VARCHAR(50) NOT NULL PRIMARY KEY,
    reporter_user_id VARCHAR(50) NOT NULL,
    reported_user_id VARCHAR(50),
    content_id VARCHAR(50), -- ID of the reported content (post, comment, etc.)
    content_type VARCHAR(20), -- 'post', 'comment', 'profile', 'message', 'group'
    content_text TEXT, -- Text content for moderation
    reason VARCHAR(100) NOT NULL, -- 'spam', 'harassment', 'inappropriate', 'copyright', 'other'
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'reviewed', 'approved', 'rejected', 'escalated'
    severity_level INTEGER DEFAULT 1, -- 1-5 scale
    assigned_moderator_id VARCHAR(50),
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- Create moderation_actions table
CREATE TABLE moderation_actions (
    action_id VARCHAR(50) NOT NULL PRIMARY KEY,
    moderator_id VARCHAR(50) NOT NULL,
    target_user_id VARCHAR(50),
    target_content_id VARCHAR(50),
    action_type VARCHAR(50) NOT NULL, -- 'warn', 'suspend', 'ban', 'delete_content', 'remove_from_group', 'mute'
    reason TEXT,
    duration_minutes INTEGER, -- For temporary actions
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create content_filters table
CREATE TABLE content_filters (
    filter_id VARCHAR(50) NOT NULL PRIMARY KEY,
    keyword VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL, -- 'profanity', 'spam', 'hate_speech', 'violence', 'sexual', 'drugs'
    severity_level INTEGER NOT NULL, -- 1-5 scale
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create user_bans table
CREATE TABLE user_bans (
    ban_id VARCHAR(50) NOT NULL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    moderator_id VARCHAR(50) NOT NULL,
    reason TEXT,
    ban_type VARCHAR(20) NOT NULL DEFAULT 'temporary', -- 'temporary', 'permanent'
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lifted_at TIMESTAMP,
    lifted_by_moderator_id VARCHAR(50)
);

-- Indexes for better performance
CREATE INDEX idx_moderation_reports_reporter ON moderation_reports(reporter_user_id);
CREATE INDEX idx_moderation_reports_respondent ON moderation_reports(reported_user_id);
CREATE INDEX idx_moderation_reports_content ON moderation_reports(content_id);
CREATE INDEX idx_moderation_reports_status ON moderation_reports(status);
CREATE INDEX idx_moderation_reports_severity ON moderation_reports(severity_level);
CREATE INDEX idx_moderation_reports_assigned ON moderation_reports(assigned_moderator_id);
CREATE INDEX idx_moderation_actions_moderator ON moderation_actions(moderator_id);
CREATE INDEX idx_moderation_actions_target_user ON moderation_actions(target_user_id);
CREATE INDEX idx_moderation_actions_target_content ON moderation_actions(target_content_id);
CREATE INDEX idx_moderation_actions_type ON moderation_actions(action_type);
CREATE INDEX idx_content_filters_keyword ON content_filters(keyword);
CREATE INDEX idx_content_filters_category ON content_filters(category);
CREATE INDEX idx_content_filters_active ON content_filters(is_active);
CREATE INDEX idx_user_bans_user ON user_bans(user_id);
CREATE INDEX idx_user_bans_expires ON user_bans(expires_at);

-- Foreign key constraints
-- ALTER TABLE moderation_reports ADD CONSTRAINT fk_moderation_reports_reporter FOREIGN KEY (reporter_user_id) REFERENCES users(user_id);
-- ALTER TABLE moderation_reports ADD CONSTRAINT fk_moderation_reports_respondent FOREIGN KEY (reported_user_id) REFERENCES users(user_id);
-- ALTER TABLE moderation_actions ADD CONSTRAINT fk_moderation_actions_moderator FOREIGN KEY (moderator_id) REFERENCES users(user_id);
-- ALTER TABLE moderation_actions ADD CONSTRAINT fk_moderation_actions_target_user FOREIGN KEY (target_user_id) REFERENCES users(user_id);
-- ALTER TABLE user_bans ADD CONSTRAINT fk_user_bans_user FOREIGN KEY (user_id) REFERENCES users(user_id);
-- ALTER TABLE user_bans ADD CONSTRAINT fk_user_bans_moderator FOREIGN KEY (moderator_id) REFERENCES users(user_id);