Tài liệu này mô tả chi tiết tất cả các API hiện có trong kiến trúc microservices của Bear Social Media
Platform.
Lưu ý: Tất cả các yêu cầu từ Client phải đi qua API Gateway để thực hiện điều hướng (proxy) đến các
dịch vụ tương ứng.

Base URL

  * Development: http://localhost:8080
  * Production: https://api.bearsocial.com (Dự kiến)

Authentication

Hầu hết các endpoint yêu cầu xác thực thông qua JWT token gửi kèm trong Authorization header:

  1 Authorization: Bearer <jwt_token>

---

🔐 Authentication Service (/auth)

1. Register User

Đăng ký tài khoản người dùng mới.

  * Endpoint: POST /auth/register
  * Auth: None

Request Body:

  1 {
  2   "username": "bear_user",
  3   "email": "user@example.com",
  4   "password": "securepassword123"
  5 }

Response (201 Created):

  1 {
  2   "message": "User registered successfully",
  3   "user": {
  4     "user_id": "uuid-string",
  5     "username": "bear_user",
  6     "email": "user@example.com",
  7     "is_active": true,
  8     "is_verified": false,
  9     "created_at": "2024-03-20T08:00:00Z",
  10     "updated_at": "2024-03-20T08:00:00Z"
  11   }
  12 }

2. Login User

Xác thực người dùng và cấp cặp token (Access & Refresh).

  * Endpoint: POST /auth/login
  * Auth: None

Request Body:

  1 {
  2   "email": "user@example.com",
  3   "password": "securepassword123"
  4 }

Response (200 OK):

  1 {
  2   "message": "Login successful",
  3   "tokens": {
  4     "access_token": "eyJhbG...",
  5     "refresh_token": "def456..."
  6   }
  7 }

3. Logout User

Đăng xuất người dùng và hủy bỏ refresh token.

  * Endpoint: POST /auth/logout
  * Auth: Bearer Token

Response (200 OK):

  1 {
  2   "message": "Logout successful"
  3 }

4. Refresh Access Token

Làm mới access token sử dụng refresh token.

  * Endpoint: POST /auth/refresh
  * Auth: None (truyền refresh token trong body)

Request Body:

  1 {
  2   "refreshToken": "refresh-token-string"
  3 }

Response (200 OK):

  1 {
  2   "message": "Token refreshed successfully",
  3   "tokens": {
  4     "access_token": "eyJhbG...",
  5     "refresh_token": "def456..."
  6   }
  7 }

5. Verify Token

Kiểm tra tính hợp lệ của access token.

  * Endpoint: GET /auth/verify
  * Auth: Bearer Token

Response (200 OK):

  1 {
  2   "message": "Token is valid",
  3   "user": {
  4     "userId": "uuid-string",
  5     "email": "user@example.com"
  6   }
  7 }

---

👤 User Service (/users)

1. Get All Users (READ)

Lấy danh sách tất cả người dùng (có phân trang).

  * Endpoint: GET /users
  * Auth: Bearer Token
  * Query Params: limit (default: 20), offset (default: 0)

Response (200 OK):

  1 [
  2   {
  3     "user_id": "uuid-string",
  4     "username": "bear_user",
  5     "email": "user@example.com",
  6     "first_name": "John",
  7     "last_name": "Doe",
  8     "bio": "A passionate developer",
  9     "avatar_url": "https://example.com/avatar.jpg",
  10     "is_active": true,
  11     "is_verified": true,
  12     "created_at": "2024-03-20T08:00:00Z",
  13     "updated_at": "2024-03-20T08:00:00Z",
  14     "last_login_at": "2024-03-20T08:00:00Z"
  15   }
  16 ]

2. Get User by ID (READ)

Lấy thông tin người dùng theo ID.

  * Endpoint: GET /users/{id}
  * Auth: Bearer Token

Response (200 OK):

  1 {
  2   "user_id": "uuid-string",
  3   "username": "bear_user",
  4   "email": "user@example.com",
  5   "first_name": "John",
  6   "last_name": "Doe",
  7   "bio": "A passionate developer",
  8   "avatar_url": "https://example.com/avatar.jpg",
  9   "is_active": true,
  10   "is_verified": true,
  11   "created_at": "2024-03-20T08:00:00Z",
  12   "updated_at": "2024-03-20T08:00:00Z",
  13   "last_login_at": "2024-03-20T08:00:00Z"
  14 }

3. Create User (CREATE)

Tạo người dùng mới (thay thế cho auth/register).

  * Endpoint: POST /users
  * Auth: Bearer Token

Request Body:

  1 {
  2   "username": "new_user",
  3   "email": "newuser@example.com",
  4   "password": "securepassword123",
  5   "first_name": "Jane",
  6   "last_name": "Smith",
  7   "bio": "New user bio"
  8 }

Response (201 Created):

  1 {
  2   "user_id": "uuid-string",
  3   "username": "new_user",
  4   "email": "newuser@example.com",
  5   "first_name": "Jane",
  6   "last_name": "Smith",
  7   "bio": "New user bio",
  8   "is_active": true,
  9   "is_verified": false,
  10   "created_at": "2024-03-20T08:00:00Z",
  11   "updated_at": "2024-03-20T08:00:00Z"
  12 }

4. Update User (UPDATE)

Cập nhật thông tin người dùng.

  * Endpoint: PUT /users/{id}
  * Auth: Bearer Token

Request Body:

  1 {
  2   "username": "updated_user",
  3   "email": "updateduser@example.com",
  4   "first_name": "Jane",
  5   "last_name": "Updated",
  6   "bio": "Updated bio"
  7 }

Response (200 OK):

  1 {
  2   "user_id": "uuid-string",
  3   "username": "updated_user",
  4   "email": "updateduser@example.com",
  5   "first_name": "Jane",
  6   "last_name": "Updated",
  7   "bio": "Updated bio",
  8   "is_active": true,
  9   "is_verified": true,
  10   "created_at": "2024-03-20T08:00:00Z",
  11   "updated_at": "2024-03-20T08:00:00Z",
  12   "last_login_at": "2024-03-20T08:00:00Z"
  13 }

5. Delete User (DELETE)

Xóa người dùng theo ID.

  * Endpoint: DELETE /users/{id}
  * Auth: Bearer Token

Response (200 OK):

  1 {
  2   "message": "User deleted successfully"
  3 }

---

📝 Post Service (/posts)

1. Get All Posts (READ)

Lấy danh sách tất cả bài viết (có phân trang).

  * Endpoint: GET /posts
  * Auth: Bearer Token
  * Query Params: limit (default: 20), offset (default: 0)

Response (200 OK):

  1 [
  2   {
  3     "post_id": "uuid-string",
  4     "post_author_id": "user-uuid",
  5     "post_author_name": "bear_user",
  6     "post_content": "Hôm nay trời đẹp quá!",
  7     "post_title": "Daily Blog",
  8     "post_tags": ["nature", "vibe"],
  9     "post_status": "published",
  10     "post_created_at": "2024-03-20T08:00:00Z",
  11     "upvotes": 5,
  12     "downvotes": 0,
  13     "comments_count": 3,
  14     "published_at": "2024-03-20T08:00:00Z"
  15   }
  16 ]

2. Get Post by ID (READ)

Lấy thông tin bài viết theo ID.

  * Endpoint: GET /posts/{id}
  * Auth: Bearer Token

Response (200 OK):

  1 {
  2   "post_id": "uuid-string",
  3   "post_author_id": "user-uuid",
  4   "post_author_name": "bear_user",
  5   "post_content": "Hôm nay trời đẹp quá!",
  6   "post_title": "Daily Blog",
  7   "post_tags": ["nature", "vibe"],
  8   "post_status": "published",
  9   "post_created_at": "2024-03-20T08:00:00Z",
  10   "upvotes": 5,
  11   "downvotes": 0,
  12   "comments_count": 3,
  13   "published_at": "2024-03-20T08:00:00Z"
  14 }

3. Create Post (CREATE)

Tạo bài viết mới.

  * Endpoint: POST /posts
  * Auth: Bearer Token

Request Body:

  1 {
  2   "post_content": "Hôm nay trời đẹp quá!",
  3   "post_title": "Daily Blog",
  4   "post_tags": ["nature", "vibe"]
  5 }

Response (201 Created):

  1 {
  2   "post_id": "uuid-string",
  3   "post_author_id": "user-uuid",
  4   "post_author_name": "bear_user",
  5   "post_content": "Hôm nay trời đẹp quá!",
  6   "post_title": "Daily Blog",
  7   "post_tags": ["nature", "vibe"],
  8   "post_status": "published",
  9   "post_created_at": "2024-03-20T08:00:00Z",
  10   "upvotes": 0,
  11   "downvotes": 0,
  12   "comments_count": 0,
  13   "published_at": "2024-03-20T08:00:00Z"
  14 }

4. Update Post (UPDATE)

Cập nhật bài viết.

  * Endpoint: PUT /posts/{id}
  * Auth: Bearer Token

Request Body:

  1 {
  2   "post_content": "Hôm nay trời đẹp quá! Cập nhật thêm thông tin.",
  3   "post_title": "Daily Blog - Updated",
  4   "post_tags": ["nature", "vibe", "update"]
  5 }

Response (200 OK):

  1 {
  2   "post_id": "uuid-string",
  3   "post_author_id": "user-uuid",
  4   "post_author_name": "bear_user",
  5   "post_content": "Hôm nay trời đẹp quá! Cập nhật thêm thông tin.",
  6   "post_title": "Daily Blog - Updated",
  7   "post_tags": ["nature", "vibe", "update"],
  8   "post_status": "published",
  9   "post_created_at": "2024-03-20T08:00:00Z",
  10   "upvotes": 5,
  11   "downvotes": 0,
  12   "comments_count": 3,
  13   "published_at": "2024-03-20T08:00:00Z"
  14 }

5. Delete Post (DELETE)

Xóa bài viết theo ID.

  * Endpoint: DELETE /posts/{id}
  * Auth: Bearer Token

Response (200 OK):

  1 {
  2   "message": "Post deleted successfully"
  3 }

---

💬 Comment Service (/comments)

1. Get All Comments (READ)

Lấy danh sách tất cả bình luận (có phân trang).

  * Endpoint: GET /comments
  * Auth: Bearer Token
  * Query Params: limit (default: 20), offset (default: 0)

Response (200 OK):

  1 [
  2   {
  3     "comment_id": "uuid-string",
  4     "post_id": "post-uuid",
  5     "user_id": "user-uuid",
  6     "parent_comment_id": null,
  7     "content": "Bài viết hay quá bạn ơi!",
  8     "is_edited": false,
  9     "created_at": "2024-03-20T08:00:00Z",
  10     "updated_at": "2024-03-20T08:00:00Z",
  11     "deleted_at": null
  12   }
  13 ]

2. Get Comment by ID (READ)

Lấy thông tin bình luận theo ID.

  * Endpoint: GET /comments/{id}
  * Auth: Bearer Token

Response (200 OK):

  1 {
  2   "comment_id": "uuid-string",
  3   "post_id": "post-uuid",
  4   "user_id": "user-uuid",
  5   "parent_comment_id": null,
  6   "content": "Bài viết hay quá bạn ơi!",
  7   "is_edited": false,
  8   "created_at": "2024-03-20T08:00:00Z",
  9   "updated_at": "2024-03-20T08:00:00Z",
  10   "deleted_at": null
  11 }

3. Get Comments by Post (READ)

Lấy danh sách bình luận theo bài viết.

  * Endpoint: GET /comments/by-post
  * Auth: Bearer Token
  * Query Params: post_id

Response (200 OK):

  1 [
  2   {
  3     "comment_id": "uuid-string",
  4     "post_id": "post-uuid",
  5     "user_id": "user-uuid",
  6     "parent_comment_id": null,
  7     "content": "Bài viết hay quá bạn ơi!",
  8     "is_edited": false,
  9     "created_at": "2024-03-20T08:00:00Z",
  10     "updated_at": "2024-03-20T08:00:00Z",
  11     "deleted_at": null
  12   }
  13 ]

4. Get Comments by User (READ)

Lấy danh sách bình luận theo người dùng.

  * Endpoint: GET /comments/by-user
  * Auth: Bearer Token
  * Query Params: user_id

Response (200 OK):

  1 [
  2   {
  3     "comment_id": "uuid-string",
  4     "post_id": "post-uuid",
  5     "user_id": "user-uuid",
  6     "parent_comment_id": null,
  7     "content": "Bài viết hay quá bạn ơi!",
  8     "is_edited": false,
  9     "created_at": "2024-03-20T08:00:00Z",
  10     "updated_at": "2024-03-20T08:00:00Z",
  11     "deleted_at": null
  12   }
  13 ]

5. Create Comment (CREATE)

Tạo bình luận mới.

  * Endpoint: POST /comments
  * Auth: Bearer Token

Request Body:

  1 {
  2   "post_id": "post-uuid",
  3   "content": "Bài viết hay quá bạn ơi!",
  4   "parent_comment_id": null
  5 }

Response (201 Created):

  1 {
  2   "comment_id": "uuid-string",
  3   "post_id": "post-uuid",
  4   "user_id": "user-uuid",
  5   "parent_comment_id": null,
  6   "content": "Bài viết hay quá bạn ơi!",
  7   "is_edited": false,
  8   "created_at": "2024-03-20T08:00:00Z",
  9   "updated_at": "2024-03-20T08:00:00Z",
  10   "deleted_at": null
  11 }

6. Update Comment (UPDATE)

Cập nhật bình luận.

  * Endpoint: PUT /comments/{id}
  * Auth: Bearer Token

Request Body:

  1 {
  2   "content": "Bài viết hay quá bạn ơi! Cập nhật thêm."
  3 }

Response (200 OK):

  1 {
  2   "comment_id": "uuid-string",
  3   "post_id": "post-uuid",
  4   "user_id": "user-uuid",
  5   "parent_comment_id": null,
  6   "content": "Bài viết hay quá bạn ơi! Cập nhật thêm.",
  7   "is_edited": true,
  8   "created_at": "2024-03-20T08:00:00Z",
  9   "updated_at": "2024-03-20T08:00:00Z",
  10   "deleted_at": null
  11 }

7. Delete Comment (DELETE)

Xóa bình luận theo ID.

  * Endpoint: DELETE /comments/{id}
  * Auth: Bearer Token

Response (200 OK):

  1 {
  2   "message": "Comment deleted successfully"
  3 }

---

🗳️ Vote Service (/votes)

1. Get All Votes (READ)

Lấy danh sách tất cả phiếu bầu (có phân trang).

  * Endpoint: GET /votes
  * Auth: Bearer Token
  * Query Params: limit (default: 20), offset (default: 0)

Response (200 OK):

  1 [
  2   {
  3     "vote_id": "uuid-string",
  4     "user_id": "user-uuid",
  5     "entity_id": "post-uuid",
  6     "entity_type": "post",
  7     "vote_type": "upvote",
  8     "created_at": "2024-03-20T08:00:00Z",
  9     "updated_at": "2024-03-20T08:00:00Z"
  10   }
  11 ]

2. Get Vote by ID (READ)

Lấy thông tin phiếu bầu theo ID.

  * Endpoint: GET /votes/{id}
  * Auth: Bearer Token

Response (200 OK):

  1 {
  2   "vote_id": "uuid-string",
  3   "user_id": "user-uuid",
  4   "entity_id": "post-uuid",
  5   "entity_type": "post",
  6   "vote_type": "upvote",
  7   "created_at": "2024-03-20T08:00:00Z",
  8   "updated_at": "2024-03-20T08:00:00Z"
  9 }

3. Get Vote by User and Entity (READ)

Lấy phiếu bầu theo người dùng và thực thể.

  * Endpoint: GET /votes/by-user-entity
  * Auth: Bearer Token
  * Query Params: user_id, entity_id, entity_type

Response (200 OK):

  1 {
  2   "vote_id": "uuid-string",
  3   "user_id": "user-uuid",
  4   "entity_id": "post-uuid",
  5   "entity_type": "post",
  6   "vote_type": "upvote",
  7   "created_at": "2024-03-20T08:00:00Z",
  8   "updated_at": "2024-03-20T08:00:00Z"
  9 }

4. Get Votes by User (READ)

Lấy danh sách phiếu bầu theo người dùng.

  * Endpoint: GET /votes/by-user
  * Auth: Bearer Token
  * Query Params: user_id

Response (200 OK):

  1 [
  2   {
  3     "vote_id": "uuid-string",
  4     "user_id": "user-uuid",
  5     "entity_id": "post-uuid",
  6     "entity_type": "post",
  7     "vote_type": "upvote",
  8     "created_at": "2024-03-20T08:00:00Z",
  9     "updated_at": "2024-03-20T08:00:00Z"
  10   }
  11 ]

5. Get Votes by Entity (READ)

Lấy danh sách phiếu bầu theo thực thể.

  * Endpoint: GET /votes/by-entity
  * Auth: Bearer Token
  * Query Params: entity_id, entity_type

Response (200 OK):

  1 [
  2   {
  3     "vote_id": "uuid-string",
  4     "user_id": "user-uuid",
  5     "entity_id": "post-uuid",
  6     "entity_type": "post",
  7     "vote_type": "upvote",
  8     "created_at": "2024-03-20T08:00:00Z",
  9     "updated_at": "2024-03-20T08:00:00Z"
  10   }
  11 ]

6. Get Vote Counts by Entity (READ)

Lấy tổng số phiếu bầu theo thực thể.

  * Endpoint: GET /votes/counts
  * Auth: Bearer Token
  * Query Params: entity_ids (comma-separated), entity_type

Response (200 OK):

  1 {
  2   "entity_id_1": {
  3     "upvotes": 10,
  4     "downvotes": 2
  5   },
  6   "entity_id_2": {
  7     "upvotes": 5,
  8     "downvotes": 1
  9   }
  10 }

7. Create or Update Vote (CREATE/UPDATE)

Tạo hoặc cập nhật phiếu bầu cho thực thể (Post hoặc Comment).

  * Endpoint: POST /votes
  * Auth: Bearer Token

Request Body:

  1 {
  2   "entity_id": "string-uuid",
  3   "entity_type": "post",
  4   "vote_type": "upvote"
  5 }

Response (200 OK):

  1 {
  2   "vote_id": "uuid-string",
  3   "user_id": "user-uuid",
  4   "entity_id": "string-uuid",
  5   "entity_type": "post",
  6   "vote_type": "upvote",
  7   "created_at": "2024-03-20T08:00:00Z",
  8   "updated_at": "2024-03-20T08:00:00Z"
  9 }

8. Update Vote (UPDATE)

Cập nhật loại phiếu bầu.

  * Endpoint: PUT /votes/{id}
  * Auth: Bearer Token

Request Body:

  1 {
  2   "vote_type": "downvote"
  3 }

Response (200 OK):

  1 {
  2   "vote_id": "uuid-string",
  3   "user_id": "user-uuid",
  4   "entity_id": "string-uuid",
  5   "entity_type": "post",
  6   "vote_type": "downvote",
  7   "created_at": "2024-03-20T08:00:00Z",
  8   "updated_at": "2024-03-20T08:00:00Z"
  9 }

9. Delete Vote (DELETE)

Xóa phiếu bầu theo ID.

  * Endpoint: DELETE /votes/{id}
  * Auth: Bearer Token

Response (200 OK):

  1 {
  2   "message": "Vote deleted successfully"
  3 }

10. Delete Vote by User and Entity (DELETE)

Xóa phiếu bầu theo người dùng và thực thể.

  * Endpoint: DELETE /votes/by-user-entity
  * Auth: Bearer Token
  * Query Params: user_id, entity_id, entity_type

Response (200 OK):

  1 {
  2   "message": "Vote deleted successfully"
  3 }

---

📰 Feed Service (/feed)

1. Get User Feed (READ)

Lấy danh sách bài viết trên bảng tin của người dùng.

  * Endpoint: GET /feed
  * Auth: Bearer Token
  * Query Params: user_id, limit (default: 20), offset (default: 0)

Response (200 OK):

  1 {
  2   "posts": [
  3     {
  4       "post_id": "uuid-string",
  5       "post_author_id": "user-uuid",
  6       "post_author_name": "bear_user",
  7       "post_content": "Hôm nay trời đẹp quá!",
  8       "post_title": "Daily Blog",
  9       "post_tags": ["nature", "vibe"],
  10       "post_status": "published",
  11       "post_created_at": "2024-03-20T08:00:00Z",
  12       "upvotes": 5,
  13       "downvotes": 0,
  14       "comments_count": 3,
  15       "published_at": "2024-03-20T08:00:00Z"
  16     }
  17   ],
  18   "total": 10
  19 }

2. Add Post to User Feed (CREATE)

Thêm bài viết vào bảng tin của người dùng.

  * Endpoint: POST /feed/add
  * Auth: Bearer Token

Request Body:

  1 {
  2   "user_id": "user-uuid",
  3   "post_id": "post-uuid"
  4 }

Response (201 Created):

  1 {
  2   "message": "Post added to feed successfully"
  3 }

3. Remove Post from User Feed (DELETE)

Xóa bài viết khỏi bảng tin của người dùng.

  * Endpoint: POST /feed/remove
  * Auth: Bearer Token

Request Body:

  1 {
  2   "user_id": "user-uuid",
  3   "post_id": "post-uuid"
  4 }

Response (200 OK):

  1 {
  2   "message": "Post removed from feed successfully"
  3 }

---

🔍 Search Service (/search)

1. Search Across Entities (READ)

Tìm kiếm bài viết, người dùng và bình luận.

  * Endpoint: GET /search
  * Auth: Bearer Token
  * Query Params: q (required), type (default: 'all'), limit (default: 20), offset (default: 0)

Response (200 OK):

  1 {
  2   "results": [
  3     {
  4       "type": "post",
  5       "data": {
  6         "post_id": "uuid-string",
  7         "post_author_id": "user-uuid",
  8         "post_author_name": "bear_user",
  9         "post_content": "Hôm nay trời đẹp quá!",
  10         "post_title": "Daily Blog",
  11         "post_tags": ["nature", "vibe"],
  12         "post_status": "published",
  13         "post_created_at": "2024-03-20T08:00:00Z",
  14         "upvotes": 5,
  15         "downvotes": 0,
  16         "comments_count": 3,
  17         "published_at": "2024-03-20T08:00:00Z"
  18       }
  19     }
  20   ],
  21   "total": 1
  22 }

---

🏥 Health & Monitoring

Hệ thống cung cấp các endpoint kiểm tra trạng thái hoạt động:

  * Gateway Health: GET /health
  * Gateway Readiness: GET /ready
  * Chi tiết từng Service:
    * GET /auth/health
    * GET /users/health
    * GET /posts/health
    * GET /comments/health
    * GET /votes/health
    * GET /feed/health
    * GET /search/health

Response Example:

  1 {
  2   "status": "ok",
  3   "timestamp": "2024-03-20T08:00:00Z",
  4   "services": {
  5     "auth": "http://localhost:3005",
  6     "post": "http://localhost:3003",
  7     "user": "http://localhost:3001",
  8     "comment": "http://localhost:3002",
  9     "search": "http://localhost:3004"
  10   },
  11   "checks": {
  12     "database": true,
  13     "redis": true,
  14     "kafka": true
  15   }
  16 }

---

⚠️ Error Responses

Tất cả các lỗi sẽ trả về theo format chuẩn:

  1 {
  2   "error": "Mô tả chi tiết lỗi ở đây",
  3   "code": "ERROR_CODE_REFERENCE"
  4 }


┌───────────┬──────────────────────────────────┐
│ HTTP Code │ Ý nghĩa                          │
├───────────┼──────────────────────────────────┤
│ 200/201   │ Thành công                       │
│ 400       │ Dữ liệu gửi lên không hợp lệ     │
│ 401       │ Chưa xác thực hoặc Token hết hạn │
│ 404       │ Không tìm thấy tài nguyên        │
│ 500       │ Lỗi hệ thống Backend             │
└───────────┴──────────────────────────────────┘
