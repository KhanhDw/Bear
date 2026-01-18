Based on my exploration of the backend code, here is the complete API list for your backend:

  Backend API List

  API Gateway (Port 8080)

  Health Checks
   - GET /health - Health check endpoint
   - GET /ready - Readiness check endpoint
   - GET / - Main gateway info endpoint

  Auth Service (Proxied to port 3005)
   - POST /auth/register - Register a new user
   - POST /auth/login - Login user
   - POST /auth/logout - Logout user
   - POST /auth/refresh - Refresh authentication token
   - GET /auth/verify - Verify authentication token
   - GET /auth/health - Auth service health check

  User Service (Proxied to port 3001)
   - POST /users/ - Create a new user
   - GET /users/ - Get all users
   - GET /users/:id - Get user by ID
   - PUT /users/:id - Update user by ID
   - DELETE /users/:id - Delete user by ID
   - GET /users/health - User service health check

  Post Service (Proxied to port 3003)
   - POST /posts/ - Create a new post
   - GET /posts/ - Get all posts
   - GET /posts/:id - Get post by ID
   - PUT /posts/:id - Update post by ID
   - DELETE /posts/:id - Delete post by ID
   - GET /posts/health - Post service health check

  Comment Service (Proxied to port 3002)
   - POST /comments/ - Create a new comment
   - GET /comments/ - Get all comments
   - GET /comments/by-post - Get comments by post
   - GET /comments/by-user - Get comments by user
   - GET /comments/:id - Get comment by ID
   - PUT /comments/:id - Update comment by ID
   - DELETE /comments/:id - Delete comment by ID
   - GET /comments/health - Comment service health check

  Search Service (Proxied to port 3004)
   - GET /search/ - Search functionality
   - GET /search/health - Search service health check

  Feed Service (Proxied to port 3005)
   - GET /feed/ - Get user feed
   - POST /feed/add - Add to feed
   - POST /feed/remove - Remove from feed
   - GET /feed/health - Feed service health check

  Vote Service (Proxied to port 3005)
   - POST /votes/ - Create or update vote
   - GET /votes/ - Get all votes
   - GET /votes/by-user-entity - Get vote by user and entity
   - GET /votes/by-user - Get votes by user
   - GET /votes/by-entity - Get votes by entity
   - GET /votes/counts - Get vote counts by entity
   - GET /votes/:id - Get vote by ID
   - PUT /votes/:id - Update vote by ID
   - DELETE /votes/:id - Delete vote by ID
   - DELETE /votes/by-user-entity - Delete vote by user and entity
   - GET /votes/health - Vote service health check

  Authentication
  Most endpoints (except health checks, auth endpoints, and public routes) require authentication via JWT
  tokens in the Authorization header.

  Service Ports
   - Gateway: 8080
   - User Service: 3001
   - Comment Service: 3002
   - Post Service: 3003
   - Search Service: 3004
   - Auth/Vote/Feed Services: 3005

  The backend follows a microservices architecture with an API gateway that proxies requests to individual
  services. Each service handles its own domain-specific business logic and communicates with others via HTTP
  or potentially Kafka for event-driven communication (based on the health checks mentioning Kafka).
