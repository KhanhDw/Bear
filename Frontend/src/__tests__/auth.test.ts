// src/__tests__/auth.test.ts
import { mockAuthService } from '../mocks/auth';
import { getTestUserCredentials } from '../utils/authUtils';

describe('Authentication Service', () => {
  test('should successfully login with valid credentials', async () => {
    const credentials = getTestUserCredentials();
    
    const result = await mockAuthService.login(credentials.email, 'any_password');
    
    expect(result).toHaveProperty('user');
    expect(result).toHaveProperty('token');
    expect(result.user.email).toBe(credentials.email);
  });

  test('should fail login with invalid email', async () => {
    await expect(mockAuthService.login('nonexistent@example.com', 'password'))
      .rejects
      .toThrow('Invalid email or password');
  });

  test('should successfully register a new user', async () => {
    const userData = {
      email: 'newuser@example.com',
      password: 'newpassword123',
      firstName: 'New',
      lastName: 'User',
      username: 'newuser',
    };

    const result = await mockAuthService.register(userData);
    
    expect(result).toHaveProperty('user');
    expect(result).toHaveProperty('token');
    expect(result.user.email).toBe(userData.email);
    expect(result.user.firstName).toBe(userData.firstName);
  });

  test('should fail to register with existing email', async () => {
    const credentials = getTestUserCredentials();
    
    await expect(mockAuthService.register({
      ...credentials,
      password: 'different_password',
    })).rejects.toThrow('Email or username already exists');
  });

  test('should maintain authentication state', async () => {
    const credentials = getTestUserCredentials();
    
    // Login
    await mockAuthService.login(credentials.email, 'any_password');
    
    // Check if authenticated
    expect(mockAuthService.isAuthenticated()).toBe(true);
    
    // Get current user
    const currentUser = await mockAuthService.getCurrentUser();
    expect(currentUser).not.toBeNull();
    expect(currentUser?.email).toBe(credentials.email);
    
    // Logout
    await mockAuthService.logout();
    
    // Check if not authenticated
    expect(mockAuthService.isAuthenticated()).toBe(false);
    
    // Current user should be null
    const currentUserAfterLogout = await mockAuthService.getCurrentUser();
    expect(currentUserAfterLogout).toBeNull();
  });
});