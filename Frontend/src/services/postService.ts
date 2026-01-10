// src/services/postService.ts
import ApiService from './api';

interface Post {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  createdAt: string;
  updatedAt: string;
  imageUrls?: string[];
  likesCount: number;
  commentsCount: number;
}

class PostService extends ApiService {
  async getPosts(): Promise<Post[]> {
    return this.request<Post[]>('/posts');
  }

  async getPostById(id: string): Promise<Post> {
    return this.request<Post>(`/posts/${id}`);
  }

  async createPost(postData: Partial<Post>): Promise<Post> {
    return this.request<Post>('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async updatePost(id: string, postData: Partial<Post>): Promise<Post> {
    return this.request<Post>(`/posts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(postData),
    });
  }

  async deletePost(id: string): Promise<void> {
    await this.request(`/posts/${id}`, {
      method: 'DELETE',
    });
  }

  async likePost(postId: string, userId: string): Promise<{ postId: string; likesCount: number }> {
    return this.request(`/posts/${postId}/like`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async unlikePost(postId: string, userId: string): Promise<{ postId: string; likesCount: number }> {
    return this.request(`/posts/${postId}/unlike`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }
}

const postService = new PostService();
export default postService;
export type { Post };