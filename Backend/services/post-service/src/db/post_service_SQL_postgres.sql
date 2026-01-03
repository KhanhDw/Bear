-- Database: bear_post_service

-- DROP DATABASE IF EXISTS bear_post_service;

CREATE DATABASE bear_post_service
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;




CREATE TABLE posts (
    post_id VARCHAR(50) NOT NULL PRIMARY KEY ,
    post_content TEXT NOT NULL,
	post_author_id INTEGER NOT NULL,
    post_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

select * from posts;


INSERT INTO posts (post_id, post_content, post_author_id, post_created_at) VALUES 
('00-00','Chào mừng đến với Bear Post Service', 1,CURRENT_TIMESTAMP - INTERVAL '5 days'),
('00-01','Hướng dẫn sử dụng hệ thống đăng bài', 1,CURRENT_TIMESTAMP - INTERVAL '4 days'),
('00-02','Bí quyết viết blog hiệu quả cho người mới',1, CURRENT_TIMESTAMP - INTERVAL '3 days');


