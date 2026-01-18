-- Migration Script: Add Outbox Tables to All Services
-- Run this script on each service's database

-- User Service
\c bear_user_service;
\ir ../../../libs/outbox/src/outbox.schema.sql;

-- Post Service
\c bear_post_service;
\ir ../../../libs/outbox/src/outbox.schema.sql;

-- Comment Service
\c bear_comment_service;
\ir ../../../libs/outbox/src/outbox.schema.sql;

-- Vote Service
\c bear_vote_service;
\ir ../../../libs/outbox/src/outbox.schema.sql;

-- Feed Service
\c bear_feed_service;
\ir ../../../libs/outbox/src/outbox.schema.sql;

-- Notification Service
\c bear_notification_service;
\ir ../../../libs/outbox/src/outbox.schema.sql;

-- Messaging Service
\c bear_messaging_service;
\ir ../../../libs/outbox/src/outbox.schema.sql;

-- Media Service
\c bear_media_service;
\ir ../../../libs/outbox/src/outbox.schema.sql;

-- Group Service
\c bear_group_service;
\ir ../../../libs/outbox/src/outbox.schema.sql;

-- Search Service
\c bear_search_service;
\ir ../../../libs/outbox/src/outbox.schema.sql;

-- Analytics Service
\c bear_analytics_service;
\ir ../../../libs/outbox/src/outbox.schema.sql;

-- Moderation Service
\c bear_moderation_service;
\ir ../../../libs/outbox/src/outbox.schema.sql;

-- Auth Service
\c bear_auth_service;
\ir ../../../libs/outbox/src/outbox.schema.sql;