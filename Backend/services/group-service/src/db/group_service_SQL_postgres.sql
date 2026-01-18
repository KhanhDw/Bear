-- Database: bear_group_service

-- DROP DATABASE IF EXISTS bear_group_service;

CREATE DATABASE bear_group_service
    WITH
    OWNER = root
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Create groups table
CREATE TABLE groups (
    group_id VARCHAR(50) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    creator_id VARCHAR(50) NOT NULL,
    privacy_level VARCHAR(20) NOT NULL DEFAULT 'public', -- 'public', 'private', 'hidden'
    member_count INT DEFAULT 0,
    avatar_url VARCHAR(1000),
    cover_image_url VARCHAR(1000),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create group_members table
CREATE TABLE group_members (
    membership_id VARCHAR(50) NOT NULL PRIMARY KEY,
    group_id VARCHAR(50) NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'member', -- 'admin', 'moderator', 'member', 'banned'
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create group_posts table
CREATE TABLE group_posts (
    post_id VARCHAR(50) NOT NULL PRIMARY KEY,
    group_id VARCHAR(50) NOT NULL,
    author_id VARCHAR(50) NOT NULL,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_pinned BOOLEAN DEFAULT FALSE
);

-- Indexes for better performance
CREATE INDEX idx_groups_creator ON groups(creator_id);
CREATE INDEX idx_groups_privacy ON groups(privacy_level);
CREATE INDEX idx_groups_active ON groups(is_active);
CREATE INDEX idx_group_members_group ON group_members(group_id);
CREATE INDEX idx_group_members_user ON group_members(user_id);
CREATE INDEX idx_group_members_role ON group_members(role);
CREATE INDEX idx_group_members_active ON group_members(is_active);
CREATE INDEX idx_group_posts_group ON group_posts(group_id);
CREATE INDEX idx_group_posts_author ON group_posts(author_id);
CREATE INDEX idx_group_posts_created_at ON group_posts(created_at);

-- Foreign key constraints
-- ALTER TABLE groups ADD CONSTRAINT fk_groups_creator FOREIGN KEY (creator_id) REFERENCES users(user_id);
-- ALTER TABLE group_members ADD CONSTRAINT fk_group_members_group FOREIGN KEY (group_id) REFERENCES groups(group_id);
-- ALTER TABLE group_members ADD CONSTRAINT fk_group_members_user FOREIGN KEY (user_id) REFERENCES users(user_id);
-- ALTER TABLE group_posts ADD CONSTRAINT fk_group_posts_group FOREIGN KEY (group_id) REFERENCES groups(group_id);
-- ALTER TABLE group_posts ADD CONSTRAINT fk_group_posts_author FOREIGN KEY (author_id) REFERENCES users(user_id);

-- Unique constraints
ALTER TABLE group_members ADD CONSTRAINT unique_group_user_membership UNIQUE (group_id, user_id, is_active);