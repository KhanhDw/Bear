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



-- tạo 1000 user ngẫu nhiên

INSERT INTO users (user_id, username, email, password_hash, user_created_at, user_updated_at)
SELECT
    -- Tạo user_id dạng UUID (chuỗi 50 ký tự)
    gen_random_uuid()::varchar(50),

    -- Tạo username ngẫu nhiên: 'user_' + 1 số ngẫu nhiên + 1 chuỗi ký tự
    'user_' || i || '_' || substring(md5(random()::text), 1, 5),

    -- Tạo email ngẫu nhiên
    'bear_user_' || i || '@' || (ARRAY['gmail.com', 'outlook.com', 'yahoo.com'])[floor(random() * 3 + 1)]::text,

    -- Tạo password_hash giả lập (chuỗi md5)
    md5(random()::text || 'secret_salt'),

    -- Ngày tạo ngẫu nhiên trong vòng 1 năm qua
    NOW() - (random() * (INTERVAL '365 days')),

    -- Ngày cập nhật là ngày hiện tại
    NOW()
FROM generate_series(1, 1000) AS s(i);
