// src/utils/authUtils.ts
import { mockUsers } from '../mocks/auth';

// Utility function to get a valid test user
export const getTestUserCredentials = () => {
  const testUser = mockUsers[0]; // Using the first mock user
  return {
    email: testUser.email,
    password: 'any_password', // Our mock doesn't validate passwords
    firstName: testUser.firstName,
    lastName: testUser.lastName,
    username: testUser.username,
  };
};

// Utility function to simulate a registered user
export const getRegisteredUserCredentials = () => {
  return {
    email: 'testuser@example.com',
    password: 'testpassword123',
    firstName: 'Test',
    lastName: 'User',
    username: 'testuser',
  };
};