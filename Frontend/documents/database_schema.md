# Database Schema for Social Media Application

This document outlines the basic database schema for the 6 modules of the social media application: feed, post, user, search, vote, and comment.

## 1. User Table

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | UUID/VARCHAR(36) | PRIMARY KEY | Unique identifier for the user |
| username | VARCHAR(50) | UNIQUE, NOT NULL | Unique username for the user |
| email | VARCHAR(100) | UNIQUE, NOT NULL | User's email address |
| firstName | VARCHAR(50) | | User's first name |
| lastName | VARCHAR(50) | | User's last name |
| bio | TEXT | | User's bio/description |
| profilePictureUrl | VARCHAR(255) | | URL to user's profile picture |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Timestamp when the user was created |
| updatedAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Timestamp when the user was last updated |

## 2. Post Table

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | UUID/VARCHAR(36) | PRIMARY KEY | Unique identifier for the post |
| content | TEXT | NOT NULL | The text content of the post |
| authorId | UUID/VARCHAR(36) | FOREIGN KEY (references User.id), NOT NULL | ID of the user who created the post |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Timestamp when the post was created |
| updatedAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Timestamp when the post was last updated |
| imageUrls | JSON/TEXT | | Optional JSON array of image URLs associated with the post |

## 3. Comment Table

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | UUID/VARCHAR(36) | PRIMARY KEY | Unique identifier for the comment |
| postId | UUID/VARCHAR(36) | FOREIGN KEY (references Post.id), NOT NULL | ID of the post the comment belongs to |
| authorId | UUID/VARCHAR(36) | FOREIGN KEY (references User.id), NOT NULL | ID of the user who created the comment |
| content | TEXT | NOT NULL | The text content of the comment |
| parentId | UUID/VARCHAR(36) | FOREIGN KEY (references Comment.id), NULL | ID of the parent comment for nested replies |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Timestamp when the comment was created |
| updatedAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Timestamp when the comment was last updated |

## 4. Vote Table

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | UUID/VARCHAR(36) | PRIMARY KEY | Unique identifier for the vote |
| postId | UUID/VARCHAR(36) | FOREIGN KEY (references Post.id), NULL | ID of the post being voted on (NULL if voting on comment) |
| commentId | UUID/VARCHAR(36) | FOREIGN KEY (references Comment.id), NULL | ID of the comment being voted on (NULL if voting on post) |
| userId | UUID/VARCHAR(36) | FOREIGN KEY (references User.id), NOT NULL | ID of the user who cast the vote |
| voteType | ENUM('upvote', 'downvote') | NOT NULL | Type of vote (upvote or downvote) |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Timestamp when the vote was cast |
| updatedAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Timestamp when the vote was last updated |

## 5. Feed Table (Optional - for complex feed algorithms)

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | UUID/VARCHAR(36) | PRIMARY KEY | Unique identifier for the feed item |
| postId | UUID/VARCHAR(36) | FOREIGN KEY (references Post.id), NOT NULL | ID of the post in the feed |
| userId | UUID/VARCHAR(36) | FOREIGN KEY (references User.id), NOT NULL | ID of the user the feed item is for |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Timestamp when the feed item was created |

## 6. Search Table (Optional - for search history/queries)

| Column Name | Data Type | Constraints | Description |
|-------------|-----------|-------------|-------------|
| id | UUID/VARCHAR(36) | PRIMARY KEY | Unique identifier for the search record |
| query | TEXT | NOT NULL | The search query text |
| userId | UUID/VARCHAR(36) | FOREIGN KEY (references User.id), NOT NULL | ID of the user who performed the search |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT NOW() | Timestamp when the search was performed |

## Relationships

- User has many Posts (one-to-many)
- User has many Comments (one-to-many)
- User has many Votes (one-to-many)
- Post has many Comments (one-to-many)
- Post has many Votes (one-to-many)
- Comment has many Votes (one-to-many)
- Comment has many child Comments (self-referencing one-to-many)
- User has many Feed items (one-to-many)

## Notes

- All tables include `createdAt` and `updatedAt` timestamps for audit trails
- UUIDs are recommended for primary keys to ensure global uniqueness
- The `Vote` table uses NULL values for either `postId` or `commentId` to allow voting on both posts and comments
- The `Comment` table supports nested replies through the `parentId` self-referencing foreign key
- The `Feed` table is optional depending on the complexity of the feed algorithm needed
- The `Search` table is optional for tracking search queries and history