import { searchAll, countSearchResults, initializeSearchIndex, indexEntity } from './search.repository.js';

async function testSearchFunctionality() {
  console.log('Testing search functionality...');
  
  try {
    // Initialize the search index
    await initializeSearchIndex();
    console.log('✅ Search index initialized');
    
    // Index some sample data
    await indexEntity('post-1', 'post', 'This is a sample post about technology', 'Technology Post', 'author-1');
    await indexEntity('user-1', 'user', 'john_doe john@example.com', 'john_doe', 'john_doe');
    await indexEntity('comment-1', 'comment', 'This is a great post!', '', 'user-1');
    
    console.log('✅ Sample data indexed');
    
    // Test search
    const searchResults = await searchAll({ query: 'technology', type: 'all', limit: 10, offset: 0 });
    console.log('Search results:', searchResults);
    
    // Test count
    const count = await countSearchResults({ query: 'technology', type: 'all' });
    console.log('Search count:', count);
    
    console.log('✅ All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testSearchFunctionality();