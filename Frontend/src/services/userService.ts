// src/services/userService.ts
import ApiService from './api';

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  bio: string;
  profilePictureUrl: string;
  createdAt: string;
  updatedAt: string;
}

class UserService extends ApiService {
  async getUsers(): Promise<User[]> {
    return this.request<User[]>('/users');
  }

  async getUserById(id: string): Promise<User> {
    return this.request<User>(`/users/${id}`);
  }

  async getUserByUsername(username: string): Promise<User> {
    return this.request<User>(`/users/username/${username}`);
  }

  async createUser(userData: Partial<User>): Promise<User> {
    return this.request<User>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    return this.request<User>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string): Promise<void> {
    await this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  async followUser(userId: string, targetUserId: string): Promise<{ success: boolean }> {
    return this.request(`/users/${userId}/follow`, {
      method: 'POST',
      body: JSON.stringify({ targetUserId }),
    });
  }

  async unfollowUser(userId: string, targetUserId: string): Promise<{ success: boolean }> {
    return this.request(`/users/${userId}/unfollow`, {
      method: 'POST',
      body: JSON.stringify({ targetUserId }),
    });
  }
}

const userService = new UserService();
export default userService;
export type { User };