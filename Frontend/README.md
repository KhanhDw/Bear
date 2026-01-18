# Bear Social - Frontend

A social media platform frontend built with React, TypeScript, and custom CSS (without external UI libraries).

## Features

- User authentication (login, registration, password recovery)
- Social feed with posts
- User profiles
- Post creation and commenting
- Responsive design
- Custom CSS styling system (no external UI libraries)

## Authentication System

The application includes a complete authentication system with the following features:

### Components

- **LoginPage**: Secure login form with email/password validation
- **RegisterPage**: User registration form with validation
- **ForgotPasswordPage**: Password recovery functionality
- **ProtectedRoute**: Component to protect routes for authenticated users only
- **WelcomePage**: Landing page for unauthenticated users

### Authentication Flow

1. **Login**: Users can authenticate with their email and password
2. **Registration**: New users can create accounts
3. **Session Management**: Authentication state persists across page reloads
4. **Protected Routes**: Certain pages (like post creation) require authentication
5. **Logout**: Users can securely log out

### Mock Authentication Service

The application uses a mock authentication service (`src/mocks/auth.ts`) that simulates:

- User login and registration
- Session management
- Authentication persistence
- User data management

### Context Management

Authentication state is managed through:

- `UserContext`: Global state for user information
- `useAuth` hook: Simplified authentication methods
- Automatic authentication status checking on app load

### Protected Routes

Certain routes are protected and require authentication:

- `/create-post`
- `/post/:id` (post detail)
- `/user/:id` (user profiles)
- `/vote` (vote history)
- `/comment/:id` (comments)

Unauthenticated users attempting to access these routes will be redirected to the login page.

### UI Integration

- Header component shows login/logout options based on authentication status
- User avatars and names appear when logged in
- Create post button is only enabled for authenticated users

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to `http://localhost:5173`

## Testing

Run the test suite:
```bash
npm run test
```

## Technologies Used

- React 19.2.0
- TypeScript ~5.9.3
- React Router DOM ^7.12.0
- Vite ^7.2.4
- Custom CSS styling system

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React context providers
├── hooks/              # Custom React hooks
├── mocks/              # Mock data and services
├── pages/              # Page components
├── routes/             # Routing configuration
├── services/           # API services
├── types/              # Type definitions
├── utils/              # Utility functions
```

## Custom Styling System

The application uses a custom CSS styling system with:

- Utility classes similar to Tailwind CSS
- Consistent component styling
- Responsive design patterns
- Semantic class names
- Component-specific styling


 1. API → Frontend Feature Mapping Table


  ┌─────────────────────────┬───────────────────────┬────────┬───────────────────────────────┐
  │ Frontend Feature        │ Backend API Endpoint  │ Method │ Description                   │
  ├─────────────────────────┼───────────────────────┼────────┼───────────────────────────────┤
  │ User Registration       │ /auth/register        │ POST   │ Create new user account       │
  │ User Login              │ /auth/login           │ POST   │ Authenticate user and get JWT │
  │ User Logout             │ /auth/logout          │ POST   │ Invalidate session            │
  │ Token Verification      │ /auth/verify          │ GET    │ Check if token is valid       │
  │ User Profile View       │ /users/:id            │ GET    │ Get user details              │
  │ User Profile Update     │ /users/:id            │ PUT    │ Update user details           │
  │ User List               │ /users/               │ GET    │ Get all users                 │
  │ Create Post             │ /posts/               │ POST   │ Create new post               │
  │ Get Posts               │ /posts/               │ GET    │ Get all posts                 │
  │ Get Post by ID          │ /posts/:id            │ GET    │ Get specific post             │
  │ Update Post             │ /posts/:id            │ PUT    │ Update post                   │
  │ Delete Post             │ /posts/:id            │ DELETE │ Delete post                   │
  │ Create Comment          │ /comments/            │ POST   │ Add comment to post           │
  │ Get Comments by Post    │ /comments/by-post     │ GET    │ Get all comments for a post   │
  │ Get Comments by User    │ /comments/by-user     │ GET    │ Get all comments by user      │
  │ Get Comment by ID       │ /comments/:id         │ GET    │ Get specific comment          │
  │ Update Comment          │ /comments/:id         │ PUT    │ Update comment                │
  │ Delete Comment          │ /comments/:id         │ DELETE │ Delete comment                │
  │ Get Feed                │ /feed/                │ GET    │ Get user's feed               │
  │ Add to Feed             │ /feed/add             │ POST   │ Add item to feed              │
  │ Remove from Feed        │ /feed/remove          │ POST   │ Remove item from feed         │
  │ Create/Update Vote      │ /votes/               │ POST   │ Vote on post/comment          │
  │ Get Vote Counts         │ /votes/counts         │ GET    │ Get vote counts for entities  │
  │ Get Vote by User/Entity │ /votes/by-user-entity │ GET    │ Get user's vote for entity    │
  │ Remove Vote             │ /votes/by-user-entity │ DELETE │ Remove user's vote            │
  │ Search                  │ /search/              │ GET    │ Search posts/users            │
  └─────────────────────────┴───────────────────────┴────────┴───────────────────────────────┘
