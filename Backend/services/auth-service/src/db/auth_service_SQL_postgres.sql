-- Database: bear_auth_service

-- DROP DATABASE IF EXISTS bear_auth_service;

CREATE DATABASE bear_auth_service
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
    user_id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP
);

-- Create refresh_tokens table
CREATE TABLE refresh_tokens (
    token_id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) REFERENCES users(user_id),
    token VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create api_keys table
CREATE TABLE api_keys (
    api_key_id VARCHAR(50) PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    api_key VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires ON refresh_tokens(expires_at);
CREATE INDEX idx_api_keys_service ON api_keys(service_name);
CREATE INDEX idx_api_keys_token ON api_keys(api_key);

-- Sample data
INSERT INTO users (user_id, username, email, password_hash, salt, is_active, is_verified, created_at, updated_at) VALUES
('user-001', 'admin', 'admin@bear.social', '$2b$10$8K1p/aWxLQfbMXhvupGeEOJU7OhFVKQ2.QEKjHlNTxIVb3Xj09nhG', 'salt123', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('user-002', 'demo', 'demo@bear.social', '$2b$10$8K1p/aWxLQfbMXhvupGeEOJU7OhFVKQ2.QEKjHlNTxIVb3Xj09nhG', 'salt123', true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
