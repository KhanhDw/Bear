// src/services/voteService.ts
import ApiService from './api';

interface Vote {
  id: string;
  postId: string | null;
  commentId: string | null;
  userId: string;
  voteType: 'upvote' | 'downvote';
  createdAt: string;
  updatedAt: string;
}

interface VoteRequest {
  userId: string;
  postId?: string;
  commentId?: string;
  voteType: 'upvote' | 'downvote';
}

class VoteService extends ApiService {
  async getVotesByPostId(postId: string): Promise<Vote[]> {
    return this.request<Vote[]>(`/posts/${postId}/votes`);
  }

  async getVotesByCommentId(commentId: string): Promise<Vote[]> {
    return this.request<Vote[]>(`/comments/${commentId}/votes`);
  }

  async getVotesByUser(userId: string): Promise<Vote[]> {
    return this.request<Vote[]>(`/users/${userId}/votes`);
  }

  async createVote(voteData: VoteRequest): Promise<Vote> {
    return this.request<Vote>('/votes', {
      method: 'POST',
      body: JSON.stringify(voteData),
    });
  }

  async updateVote(id: string, voteData: Partial<Vote>): Promise<Vote> {
    return this.request<Vote>(`/votes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(voteData),
    });
  }

  async deleteVote(id: string): Promise<void> {
    await this.request(`/votes/${id}`, {
      method: 'DELETE',
    });
  }

  async getUserVoteForPost(userId: string, postId: string): Promise<Vote | null> {
    try {
      return await this.request<Vote>(`/users/${userId}/posts/${postId}/vote`);
    } catch (error) {
      // If the vote doesn't exist, return null
      return null;
    }
  }

  async getUserVoteForComment(userId: string, commentId: string): Promise<Vote | null> {
    try {
      return await this.request<Vote>(`/users/${userId}/comments/${commentId}/vote`);
    } catch (error) {
      // If the vote doesn't exist, return null
      return null;
    }
  }
}

const voteService = new VoteService();
export default voteService;
export type { Vote, VoteRequest };