// src/services/commentService.ts
import ApiService from './api';

interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
}

class CommentService extends ApiService {
  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    return this.request<Comment[]>(`/posts/${postId}/comments`);
  }

  async getCommentById(id: string): Promise<Comment> {
    return this.request<Comment>(`/comments/${id}`);
  }

  async createComment(commentData: Partial<Comment>): Promise<Comment> {
    return this.request<Comment>('/comments', {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  }

  async updateComment(id: string, commentData: Partial<Comment>): Promise<Comment> {
    return this.request<Comment>(`/comments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(commentData),
    });
  }

  async deleteComment(id: string): Promise<void> {
    await this.request(`/comments/${id}`, {
      method: 'DELETE',
    });
  }

  async likeComment(commentId: string, userId: string): Promise<{ commentId: string; likesCount: number }> {
    return this.request(`/comments/${commentId}/like`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async unlikeComment(commentId: string, userId: string): Promise<{ commentId: string; likesCount: number }> {
    return this.request(`/comments/${commentId}/unlike`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }
}

const commentService = new CommentService();
export default commentService;
export type { Comment };