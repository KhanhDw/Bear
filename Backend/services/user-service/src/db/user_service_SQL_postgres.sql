-- Database: bear_user_service

-- DROP DATABASE IF EXISTS bear_user_service;

CREATE DATABASE bear_user_service
    WITH
    OWNER = root
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Create users table
CREATE TABLE users (
    user_id UUID PRIMARY KEY,
    auth_user_id UUID UNIQUE NOT NULL, -- Reference to auth service user
    username TEXT UNIQUE NOT NULL,
    display_name TEXT,
    avatar_url TEXT DEFAULT NULL,
    bio TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create followers/following relationships table
CREATE TABLE user_follows (
    follower_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (follower_id, following_id)
);

-- Create user connections table (friends, contacts, etc.)
CREATE TABLE user_connections (
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    connected_user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    connection_type TEXT DEFAULT 'friend', -- friend, family, colleague, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, connected_user_id)
);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- Indexes for better performance
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_auth_user_id ON users(auth_user_id);
CREATE INDEX idx_user_follows_follower ON user_follows(follower_id);
CREATE INDEX idx_user_follows_following ON user_follows(following_id);
CREATE INDEX idx_user_connections_user ON user_connections(user_id);
