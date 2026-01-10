// src/services/searchService.ts
import ApiService from './api';

interface SearchResult {
  id: string;
  type: 'user' | 'post';
  title: string;
  subtitle?: string;
  avatar?: string;
}

interface SearchQuery {
  query: string;
  type?: 'user' | 'post' | 'all';
  limit?: number;
  offset?: number;
}

class SearchService extends ApiService {
  async search(query: SearchQuery): Promise<SearchResult[]> {
    const params = new URLSearchParams({
      q: query.query,
      ...(query.type && { type: query.type }),
      ...(query.limit && { limit: query.limit.toString() }),
      ...(query.offset && { offset: query.offset.toString() }),
    });

    return this.request<SearchResult[]>(`/search?${params}`);
  }

  async getTrendingSearches(): Promise<string[]> {
    return this.request<string[]>('/search/trending');
  }

  async getRecentSearches(userId: string): Promise<string[]> {
    return this.request<string[]>(`/users/${userId}/searches/recent`);
  }

  async saveSearch(userId: string, query: string): Promise<void> {
    await this.request('/searches', {
      method: 'POST',
      body: JSON.stringify({ userId, query }),
    });
  }
}

const searchService = new SearchService();
export default searchService;
export type { SearchResult, SearchQuery };