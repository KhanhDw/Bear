import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PostCard from '../components/ui/PostCard';
import type { User } from '../services/userService';
import type { Post } from '../services/postService';
import Layout from '../components/common/Layout';
import styles from './UserProfilePage.module.css';

const UserProfilePage = () => {
  const { id } = useParams<{ id?: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for user and posts
  useEffect(() => {
    // Simulate API call
    const fetchUser = () => {
      setTimeout(() => {
        const mockUser: User = {
          id: id || '1',
          username: id ? `user${id}` : 'currentuser',
          email: id ? `user${id}@example.com` : 'currentuser@example.com',
          firstName: id ? `User${id}` : 'Current',
          lastName: id ? `Name${id}` : 'User',
          bio: id
            ? `This is the profile for user ${id}. They enjoy hiking, photography, and sharing their experiences with the community.`
            : 'This is your profile. You enjoy hiking, photography, and sharing your experiences with the community.',
          profilePictureUrl: '/static/images/avatar/1.jpg',
          createdAt: '2023-01-01T00:00:00Z',
          updatedAt: '2023-01-01T00:00:00Z'
        };
        setUser(mockUser);
        
        const mockPosts: Post[] = [
          {
            id: '1',
            authorId: id || '1',
            authorName: id ? `User ${id}` : 'Current User',
            content: 'Just finished an amazing hike in the mountains! The view was absolutely breathtaking.',
            createdAt: '2023-05-15T10:30:00Z',
            likesCount: 24,
            commentsCount: 5
          },
          {
            id: '2',
            authorId: id || '1',
            authorName: id ? `User ${id}` : 'Current User',
            content: 'Beautiful sunset tonight. Nature never fails to amaze me.',
            createdAt: '2023-05-14T18:45:00Z',
            likesCount: 42,
            commentsCount: 12
          }
        ];
        setPosts(mockPosts);
        setLoading(false);
      }, 500);
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading profile...</p>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className={styles.errorContainer}>
          <h2>User not found</h2>
          <p>The user you're looking for doesn't exist.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.profileContainer}>
        <div className={styles.profileHeader}>
          <div className={styles.coverImage}>
            <div className={styles.coverPlaceholder}></div>
          </div>
          <div className={styles.profileInfo}>
            <div className={styles.avatarContainer}>
              <div className={styles.avatar}>
                {user.firstName?.charAt(0) || user.username.charAt(0)}
              </div>
            </div>
            <div className={styles.userInfo}>
              <h1 className={styles.userName}>
                {user.firstName} {user.lastName}
              </h1>
              <p className={styles.userHandle}>@{user.username}</p>
              {user.bio && <p className={styles.userBio}>{user.bio}</p>}
            </div>
          </div>
        </div>
        
        <div className={styles.profileContent}>
          <div className={styles.postsSection}>
            <h2 className={styles.sectionTitle}>Posts</h2>
            {posts.length > 0 ? (
              <div className={styles.postsList}>
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    id={post.id}
                    authorId={post.authorId}
                    authorName={post.authorName}
                    content={post.content}
                    createdAt={post.createdAt}
                    likesCount={post.likesCount}
                    commentsCount={post.commentsCount}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p>This user hasn't posted anything yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfilePage;