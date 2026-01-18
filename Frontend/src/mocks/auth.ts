// src/mocks/auth.ts
import type { User } from "../services/userService";

// Mock users database
export const mockUsers: User[] = [
  {
    id: "user1",
    username: "johndoe",
    email: "johndoe@example.com",
    firstName: "John",
    lastName: "Doe",
    bio: "Software developer passionate about React and TypeScript",
    profilePictureUrl: "",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
  {
    id: "user2",
    username: "janesmith",
    email: "janesmith@example.com",
    firstName: "Jane",
    lastName: "Smith",
    bio: "UI/UX designer with a love for clean interfaces",
    profilePictureUrl: "",
    createdAt: "2023-01-02T00:00:00Z",
    updatedAt: "2023-01-02T00:00:00Z",
  },
  {
    id: "user3",
    username: "bobjohnson",
    email: "bobjohnson@example.com",
    firstName: "Bob",
    lastName: "Johnson",
    bio: "Product manager and tech enthusiast",
    profilePictureUrl: "",
    createdAt: "2023-01-03T00:00:00Z",
    updatedAt: "2023-01-03T00:00:00Z",
  },
];

// Mock authentication service
export class MockAuthService {
  private static instance: MockAuthService;
  private currentUser: User | null = null;
  private token: string | null = null;

  private constructor() {}

  public static getInstance(): MockAuthService {
    if (!MockAuthService.instance) {
      MockAuthService.instance = new MockAuthService();
    }
    return MockAuthService.instance;
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ user: User; token: string }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Find user by email
    const user = mockUsers.find((u) => u.email === email);
    console.log(password);

    if (!user) {
      throw new Error("Invalid email or password");
    }

    // In a real app, you would validate the password here
    // For mock purposes, we'll just accept any password for existing users
    this.currentUser = user;
    this.token = `mock-token-${user.id}-${Date.now()}`;
    let token = this.token;

    return { user, token };
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    username: string;
  }): Promise<{ user: User; token: string }> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Check if user already exists
    const existingUser = mockUsers.find(
      (u) => u.email === userData.email || u.username === userData.username,
    );

    if (existingUser) {
      throw new Error("Email or username already exists");
    }

    // Create new user
    const newUser: User = {
      id: `user${mockUsers.length + 1}`,
      username: userData.username,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      bio: "",
      profilePictureUrl: "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to mock users array
    mockUsers.push(newUser);

    this.currentUser = newUser;
    this.token = `mock-token-${newUser.id}-${Date.now()}`;
    let token = this.token;

    return { user: newUser, token };
  }

  async logout(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 300));
    this.currentUser = null;
    this.token = null;
  }

  async getCurrentUser(): Promise<User | null> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return this.currentUser;
  }

  isAuthenticated(): boolean {
    return this.currentUser !== null && this.token !== null;
  }

  getToken(): string | null {
    return this.token;
  }

  setCurrentUser(user: User): void {
    this.currentUser = user;
    this.token = `mock-token-${user.id}-${Date.now()}`;
  }
}

export const mockAuthService = MockAuthService.getInstance();
