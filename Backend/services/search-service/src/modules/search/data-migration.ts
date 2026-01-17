import { Client } from 'pg';
import { initializeSearchIndex, indexEntity } from './search.repository.js';

// Database connection configurations for each service
const DATABASE_CONFIGS = {
  user: {
    host: process.env.USER_DB_HOST || 'localhost',
    port: parseInt(process.env.USER_DB_PORT || '5432'),
    database: process.env.USER_DB_NAME || 'bear_user_service',
    user: process.env.USER_DB_USER || 'postgres',
    password: process.env.USER_DB_PASSWORD || 'your_password',
  },
  post: {
    host: process.env.POST_DB_HOST || 'localhost',
    port: parseInt(process.env.POST_DB_PORT || '5432'),
    database: process.env.POST_DB_NAME || 'bear_post_service',
    user: process.env.POST_DB_USER || 'postgres',
    password: process.env.POST_DB_PASSWORD || 'your_password',
  },
  comment: {
    host: process.env.COMMENT_DB_HOST || 'localhost',
    port: parseInt(process.env.COMMENT_DB_PORT || '5432'),
    database: process.env.COMMENT_DB_NAME || 'bear_comment_service',
    user: process.env.COMMENT_DB_USER || 'postgres',
    password: process.env.COMMENT_DB_PASSWORD || 'your_password',
  }
};

async function migrateUserData() {
  console.log('🔄 Migrating user data to search index...');
  
  const userClient = new Client(DATABASE_CONFIGS.user);
  await userClient.connect();
  
  try {
    const result = await userClient.query(`
      SELECT 
        user_id,
        username,
        email,
        user_created_at
      FROM users
    `);
    
    for (const user of result.rows) {
      await indexEntity(
        user.user_id,
        'user',
        `${user.username} ${user.email}`,
        user.username,
        user.username
      );
      console.log(`✅ Indexed user: ${user.username} (${user.user_id})`);
    }
    
    console.log(`✅ Migrated ${result.rows.length} users to search index`);
  } catch (error) {
    console.error('❌ Error migrating user data:', error);
  } finally {
    await userClient.end();
  }
}

async function migratePostData() {
  console.log('🔄 Migrating post data to search index...');
  
  const postClient = new Client(DATABASE_CONFIGS.post);
  await postClient.connect();
  
  try {
    const result = await postClient.query(`
      SELECT 
        post_id,
        post_content,
        post_author_id,
        post_created_at
      FROM post
    `);
    
    for (const post of result.rows) {
      await indexEntity(
        post.post_id,
        'post',
        post.post_content,
        '', // Posts typically don't have titles
        post.post_author_id
      );
      console.log(`✅ Indexed post: ${post.post_id}`);
    }
    
    console.log(`✅ Migrated ${result.rows.length} posts to search index`);
  } catch (error) {
    console.error('❌ Error migrating post data:', error);
  } finally {
    await postClient.end();
  }
}

async function migrateCommentData() {
  console.log('🔄 Migrating comment data to search index...');
  
  const commentClient = new Client(DATABASE_CONFIGS.comment);
  await commentClient.connect();
  
  try {
    const result = await commentClient.query(`
      SELECT 
        comment_id,
        content,
        user_id,
        comment_created_at
      FROM comments
    `);
    
    for (const comment of result.rows) {
      await indexEntity(
        comment.comment_id,
        'comment',
        comment.content,
        '',
        comment.user_id
      );
      console.log(`✅ Indexed comment: ${comment.comment_id}`);
    }
    
    console.log(`✅ Migrated ${result.rows.length} comments to search index`);
  } catch (error) {
    console.error('❌ Error migrating comment data:', error);
  } finally {
    await commentClient.end();
  }
}

async function runMigration() {
  console.log('🚀 Starting data migration to search index...\n');
  
  try {
    // Initialize the search index
    await initializeSearchIndex();
    console.log('✅ Search index initialized\n');
    
    // Migrate data from each service
    await migrateUserData();
    console.log('');
    
    await migratePostData();
    console.log('');
    
    await migrateCommentData();
    console.log('');
    
    console.log('🎉 Data migration completed successfully!');
    console.log('The search service now has indexed data from all services.');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
runMigration();