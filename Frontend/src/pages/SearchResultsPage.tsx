import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PostCard from '../components/ui/PostCard';
import type { User } from '../services/userService';
import type { Post } from '../services/postService';
import Layout from '../components/common/Layout';
import UserAvatar from '../components/ui/UserAvatar';
import styles from './SearchResultsPage.module.css';

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState<'all' | 'users' | 'posts'>('all');
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for search results
  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    // Simulate API call
    const fetchSearchResults = () => {
      setTimeout(() => {
        const mockUsers: User[] = [
          {
            id: '1',
            username: 'john_doe',
            email: 'john@example.com',
            firstName: 'John',
            lastName: 'Doe',
            bio: 'Software engineer and photographer',
            avatar: '',
            created_at: '2023-01-01T00:00:00Z'
          },
          {
            id: '2',
            username: 'jane_smith',
            email: 'jane@example.com',
            firstName: 'Jane',
            lastName: 'Smith',
            bio: 'Digital artist and traveler',
            avatar: '',
            created_at: '2023-02-01T00:00:00Z'
          }
        ];

        const mockPosts: Post[] = [
          {
            post_id: '1',
            post_author_id: '1',
            post_author_name: 'John Doe',
            post_content: 'Just finished my morning run! Feeling great and ready for the day ahead.',
            post_created_at: '2023-05-15T10:30:00Z',
            upvotes: 12,
            downvotes: 2,
            comments_count: 5
          },
          {
            post_id: '2',
            post_author_id: '2',
            post_author_name: 'Jane Smith',
            post_content: 'Working on a new React project with TypeScript. The type safety is really helpful for avoiding bugs!',
            post_created_at: '2023-05-15T09:15:00Z',
            upvotes: 24,
            downvotes: 1,
            comments_count: 8
          }
        ];

        setUsers(mockUsers);
        setPosts(mockPosts);
        setLoading(false);
      }, 500);
    };

    fetchSearchResults();
  }, [query]);

  const filteredUsers = activeTab === 'posts' ? [] : users;
  const filteredPosts = activeTab === 'users' ? [] : posts;

  return (
    <Layout>
      <div className={styles.searchContainer}>
        <h1 className={styles.pageTitle}>Search</h1>
        
        <div className={styles.searchTabs}>
          <button 
            className={`${styles.tabButton} ${activeTab === 'all' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'users' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button 
            className={`${styles.tabButton} ${activeTab === 'posts' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            Posts
          </button>
        </div>

        <div className={styles.searchResults}>
          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <p>Searching for "{query}"...</p>
            </div>
          ) : (
            <>
              {filteredUsers.length > 0 && (
                <div className={styles.usersSection}>
                  <h2 className={styles.sectionTitle}>Users</h2>
                  <div className={styles.usersList}>
                    {filteredUsers.map(user => (
                      <div key={user.id} className={styles.userItem}>
                        <UserAvatar 
                          name={`${user.firstName} ${user.lastName}`} 
                          size="large" 
                        />
                        <div className={styles.userInfo}>
                          <h3 className={styles.userName}>
                            {user.firstName} {user.lastName}
                          </h3>
                          <p className={styles.userHandle}>@{user.username}</p>
                          {user.bio && <p className={styles.userBio}>{user.bio}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredPosts.length > 0 && (
                <div className={styles.postsSection}>
                  <h2 className={styles.sectionTitle}>Posts</h2>
                  <div className={styles.postsList}>
                    {filteredPosts.map(post => (
                      <PostCard
                        key={post.post_id}
                        post_id={post.post_id}
                        post_author_id={post.post_author_id}
                        post_author_name={post.post_author_name}
                        post_content={post.post_content}
                        post_created_at={post.post_created_at}
                        upvotes={post.upvotes}
                        downvotes={post.downvotes}
                        comments_count={post.comments_count}
                      />
                    ))}
                  </div>
                </div>
              )}

              {filteredUsers.length === 0 && filteredPosts.length === 0 && !loading && (
                <div className={styles.emptyState}>
                  <p>No results found for "{query}". Try different keywords.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SearchResultsPage;