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