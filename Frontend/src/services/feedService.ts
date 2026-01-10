// src/services/feedService.ts
import ApiService from './api';
import type { Post } from './postService';

interface FeedOptions {
  userId?: string;
  limit?: number;
  offset?: number;
  sortBy?: 'newest' | 'popular' | 'trending';
}

class FeedService extends ApiService {
  async getFeed(options: FeedOptions = {}): Promise<Post[]> {
    const params = new URLSearchParams();
    
    if (options.userId) params.append('userId', options.userId);
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.offset) params.append('offset', options.offset.toString());
    if (options.sortBy) params.append('sortBy', options.sortBy);
    
    const queryString = params.toString();
    const endpoint = `/feed${queryString ? `?${queryString}` : ''}`;
    
    return this.request<Post[]>(endpoint);
  }

  async getPersonalizedFeed(userId: string, options: Omit<FeedOptions, 'userId'> = {}): Promise<Post[]> {
    const params = new URLSearchParams();
    
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.offset) params.append('offset', options.offset.toString());
    if (options.sortBy) params.append('sortBy', options.sortBy);
    
    const queryString = params.toString();
    const endpoint = `/feed/user/${userId}${queryString ? `?${queryString}` : ''}`;
    
    return this.request<Post[]>(endpoint);
  }

  async getFollowingFeed(userId: string, options: Omit<FeedOptions, 'userId'> = {}): Promise<Post[]> {
    const params = new URLSearchParams();
    
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.offset) params.append('offset', options.offset.toString());
    if (options.sortBy) params.append('sortBy', options.sortBy);
    
    const queryString = params.toString();
    const endpoint = `/feed/following/${userId}${queryString ? `?${queryString}` : ''}`;
    
    return this.request<Post[]>(endpoint);
  }

  async getPostForFeed(postId: string): Promise<Post> {
    return this.request<Post>(`/feed/post/${postId}`);
  }
}

const feedService = new FeedService();
export default feedService;