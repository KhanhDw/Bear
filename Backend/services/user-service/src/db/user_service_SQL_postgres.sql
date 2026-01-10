-- Database: bear_user_service

-- DROP DATABASE IF EXISTS bear_user_service;

CREATE DATABASE bear_user_service
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

-- Create users table
CREATE TABLE users (
    user_id VARCHAR(50) NOT NULL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    user_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- Sample data 1 triệu dòng
INSERT INTO users (user_id, username, email, password_hash, user_created_at, user_updated_at)
SELECT
    'user-' || LPAD(i::text, 7, '0') AS user_id, -- Kết quả: user-0000004, user-0000005...
    'user_' || i AS username,
    'user_' || i || '@example.com' AS email,
    '$2b$10$8K1p/aWxLQfbMXhvupGeEOJU7OhFVKQ2.QEKjHlNTxIVb3Xj09nhG' AS password_hash,
    NOW() - (random() * interval '365 days') AS user_created_at,
    NOW() AS user_updated_at
FROM generate_series(1, 1000003) AS i;