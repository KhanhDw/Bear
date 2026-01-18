-- Database: bear_messaging_service

-- DROP DATABASE IF EXISTS bear_messaging_service;

CREATE DATABASE bear_messaging_service
    WITH
    OWNER = root
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    LOCALE_PROVIDER = 'libc'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Create conversations table
CREATE TABLE conversations (
    conversation_id VARCHAR(50) NOT NULL PRIMARY KEY,
    type VARCHAR(20) NOT NULL DEFAULT 'private', -- 'private', 'group'
    name VARCHAR(255), -- For group conversations
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create conversation_participants table
CREATE TABLE conversation_participants (
    participant_id SERIAL PRIMARY KEY,
    conversation_id VARCHAR(50) NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Create messages table
CREATE TABLE messages (
    message_id VARCHAR(50) NOT NULL PRIMARY KEY,
    conversation_id VARCHAR(50) NOT NULL,
    sender_id VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text', -- 'text', 'image', 'video', 'file', 'system'
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_edited BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Create message_status table (for read receipts)
CREATE TABLE message_status (
    status_id SERIAL PRIMARY KEY,
    message_id VARCHAR(50) NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL, -- 'sent', 'delivered', 'read'
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX idx_conversations_type ON conversations(type);
CREATE INDEX idx_conversation_participants_conv ON conversation_participants(conversation_id);
CREATE INDEX idx_conversation_participants_user ON conversation_participants(user_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_sent_at ON messages(sent_at);
CREATE INDEX idx_message_status_message ON message_status(message_id);
CREATE INDEX idx_message_status_user ON message_status(user_id);

-- Foreign key constraints
-- ALTER TABLE conversation_participants ADD CONSTRAINT fk_conversation_participants_conversation FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id);
-- ALTER TABLE conversation_participants ADD CONSTRAINT fk_conversation_participants_user FOREIGN KEY (user_id) REFERENCES users(user_id);
-- ALTER TABLE messages ADD CONSTRAINT fk_messages_conversation FOREIGN KEY (conversation_id) REFERENCES conversations(conversation_id);
-- ALTER TABLE messages ADD CONSTRAINT fk_messages_sender FOREIGN KEY (sender_id) REFERENCES users(user_id);
-- ALTER TABLE message_status ADD CONSTRAINT fk_message_status_message FOREIGN KEY (message_id) REFERENCES messages(message_id);
-- ALTER TABLE message_status ADD CONSTRAINT fk_message_status_user FOREIGN KEY (user_id) REFERENCES users(user_id);

-- Unique constraints
ALTER TABLE conversation_participants ADD CONSTRAINT unique_participant_active UNIQUE (conversation_id, user_id, is_active);
ALTER TABLE message_status ADD CONSTRAINT unique_message_user_status UNIQUE (message_id, user_id);