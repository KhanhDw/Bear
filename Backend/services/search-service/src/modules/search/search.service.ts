import { 
  indexEntity, 
  removeEntityFromIndex, 
  initializeSearchIndex 
} from './search.repository.js';
import { createKafkaClient, createProducer, connectProducer } from '../../../../libs/kafka/index.js';

class SearchService {
  private static instance: SearchService;
  private kafkaProducer: any;

  private constructor() {}

  public static getInstance(): SearchService {
    if (!SearchService.instance) {
      SearchService.instance = new SearchService();
    }
    return SearchService.instance;
  }

  async initialize(): Promise<void> {
    // Initialize the search index
    await initializeSearchIndex();

    // Initialize Kafka producer
    const kafkaBrokers = process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'];
    createKafkaClient(kafkaBrokers);
    this.kafkaProducer = createProducer();
    await connectProducer();
    
    console.log('✅ Search service initialized');
  }

  /**
   * Index a post when it's created or updated in the post service
   */
  async indexPost(postId: string, content: string, authorId: string): Promise<void> {
    try {
      await indexEntity(
        postId,
        'post',
        content,
        '', // Posts typically don't have titles
        authorId
      );
      console.log(`Indexed post: ${postId}`);
    } catch (error) {
      console.error(`Failed to index post ${postId}:`, error);
      throw error;
    }
  }

  /**
   * Remove a post from the search index when it's deleted
   */
  async removePost(postId: string): Promise<void> {
    try {
      await removeEntityFromIndex(postId, 'post');
      console.log(`Removed post from index: ${postId}`);
    } catch (error) {
      console.error(`Failed to remove post ${postId} from index:`, error);
      throw error;
    }
  }

  /**
   * Index a user when it's created or updated in the user service
   */
  async indexUser(userId: string, username: string, email: string): Promise<void> {
    try {
      await indexEntity(
        userId,
        'user',
        `${username} ${email}`, // Content includes both username and email
        username, // Title is the username
        username
      );
      console.log(`Indexed user: ${userId}`);
    } catch (error) {
      console.error(`Failed to index user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Remove a user from the search index when it's deleted
   */
  async removeUser(userId: string): Promise<void> {
    try {
      await removeEntityFromIndex(userId, 'user');
      console.log(`Removed user from index: ${userId}`);
    } catch (error) {
      console.error(`Failed to remove user ${userId} from index:`, error);
      throw error;
    }
  }

  /**
   * Index a comment when it's created or updated in the comment service
   */
  async indexComment(commentId: string, content: string, userId: string): Promise<void> {
    try {
      await indexEntity(
        commentId,
        'comment',
        content,
        '', // Comments typically don't have titles
        userId
      );
      console.log(`Indexed comment: ${commentId}`);
    } catch (error) {
      console.error(`Failed to index comment ${commentId}:`, error);
      throw error;
    }
  }

  /**
   * Remove a comment from the search index when it's deleted
   */
  async removeComment(commentId: string): Promise<void> {
    try {
      await removeEntityFromIndex(commentId, 'comment');
      console.log(`Removed comment from index: ${commentId}`);
    } catch (error) {
      console.error(`Failed to remove comment ${commentId} from index:`, error);
      throw error;
    }
  }

  /**
   * Handle incoming events from Kafka
   */
  async handleIncomingEvent(event: any): Promise<void> {
    const { eventType, payload } = event;

    switch (eventType) {
      case 'POST_CREATED':
      case 'POST_UPDATED':
        await this.indexPost(payload.postId, payload.content, payload.authorId);
        break;

      case 'POST_DELETED':
        await this.removePost(payload.postId);
        break;

      case 'USER_CREATED':
      case 'USER_UPDATED':
        await this.indexUser(payload.userId, payload.username, payload.email);
        break;

      case 'USER_DELETED':
        await this.removeUser(payload.userId);
        break;

      case 'COMMENT_CREATED':
      case 'COMMENT_UPDATED':
        await this.indexComment(payload.commentId, payload.content, payload.userId);
        break;

      case 'COMMENT_DELETED':
        await this.removeComment(payload.commentId);
        break;

      default:
        console.warn(`Unknown event type: ${eventType}`);
        break;
    }
  }

  /**
   * Main search function that the controller calls
   */
  async searchService(input: any): Promise<any> {
    // Import the search functions from the repository
    const { searchAll, countSearchResults } = await import('./search.repository.js');

    const results = await searchAll(input);
    const total = await countSearchResults(input);

    return {
      results,
      total,
      query: input.query,
      type: input.type,
      limit: input.limit,
      offset: input.offset
    };
  }
}

export default SearchService.getInstance();