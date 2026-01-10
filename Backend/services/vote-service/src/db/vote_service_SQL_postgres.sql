-- Database: bear_vote_service

-- DROP DATABASE IF EXISTS bear_vote_service;

CREATE DATABASE bear_vote_service
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

-- Create votes table
CREATE TABLE votes (
    vote_id VARCHAR(50) NOT NULL PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    entity_id VARCHAR(50) NOT NULL, -- can be post_id or comment_id
    entity_type VARCHAR(20) NOT NULL, -- 'post' or 'comment'
    vote_type VARCHAR(20) NOT NULL, -- 'upvote' or 'downvote'
    vote_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    vote_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_votes_user_id ON votes(user_id);
CREATE INDEX idx_votes_entity ON votes(entity_id, entity_type);
CREATE INDEX idx_votes_user_entity ON votes(user_id, entity_id, entity_type);
CREATE INDEX idx_votes_type ON votes(vote_type);
CREATE INDEX idx_votes_created_at ON votes(vote_created_at);

-- Unique constraint to prevent duplicate votes by the same user on the same entity
ALTER TABLE votes ADD CONSTRAINT unique_user_entity_vote UNIQUE (user_id, entity_id, entity_type);

-- Sample data
INSERT INTO votes (vote_id, user_id, entity_id, entity_type, vote_type, vote_created_at, vote_updated_at) VALUES
('vote-001', 'user-001', '00-00', 'post', 'upvote', CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '5 days'),
('vote-002', 'user-002', '00-00', 'post', 'upvote', CURRENT_TIMESTAMP - INTERVAL '4 days', CURRENT_TIMESTAMP - INTERVAL '4 days'),
('vote-003', 'user-003', '00-01', 'post', 'upvote', CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP - INTERVAL '3 days'),
('vote-004', 'user-001', 'comment-001', 'comment', 'upvote', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '2 days'),
('vote-005', 'user-002', 'comment-002', 'comment', 'downvote', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '1 day');