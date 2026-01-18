import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PostCard from '../components/ui/PostCard';
import CommentCard from '../components/ui/CommentCard';
import type { Post } from '../services/postService';
import type { Comment } from '../services/commentService';
import Layout from '../components/common/Layout';
import styles from './PostDetailPage.module.css';

const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  // Mock data for post
  useEffect(() => {
    // Simulate API call
    const fetchPost = () => {
      setTimeout(() => {
        const mockPost: Post = {
          post_id: id || '1',
          post_author_id: 'user1',
          post_author_name: 'John Doe',
          post_content: 'Just finished an amazing hike in the mountains! The view was absolutely breathtaking. This is a longer post to demonstrate how content looks in the detail view.',
          post_created_at: '2023-05-15T10:30:00Z',
          upvotes: 24,
          downvotes: 2,
          comments_count: 5
        };
        setPost(mockPost);
        
        const mockComments: Comment[] = [
          {
            id: '1',
            post_id: id || '1',
            author_id: 'user2',
            author_name: 'Jane Smith',
            content: 'Looks amazing! Where exactly did you hike?',
            created_at: '2023-05-15T11:30:00Z',
            likes_count: 3
          },
          {
            id: '2',
            post_id: id || '1',
            author_id: 'user3',
            author_name: 'Bob Johnson',
            content: 'Beautiful view! Thanks for sharing.',
            created_at: '2023-05-15T12:00:00Z',
            likes_count: 1
          }
        ];
        setComments(mockComments);
        setLoading(false);
      }, 500);
    };

    fetchPost();
  }, [id]);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !post) return;

    const comment: Comment = {
      id: (comments.length + 1).toString(),
      post_id: post.post_id,
      author_id: 'current-user', // In real app, this would be the logged in user
      author_name: 'Current User', // In real app, this would be the logged in user
      content: newComment,
      created_at: new Date().toISOString(),
      likes_count: 0
    };

    setComments([...comments, comment]);
    setNewComment('');
    
    // Update post comment count
    if (post) {
      setPost({
        ...post,
        comments_count: post.comments_count + 1
      });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Loading post...</p>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className={styles.errorContainer}>
          <h2>Post not found</h2>
          <p>The post you're looking for doesn't exist.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.postDetailContainer}>
        <div className={styles.postContainer}><PostCard
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
        </div>
        
        <div className={styles.commentsSection}>
          <h2 className={styles.commentsTitle}>Comments ({comments.length})</h2>
          
          {comments.length > 0 ? (
            <div className={styles.commentsList}>
              {comments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  id={comment.id}
                  authorName={comment.author_name}
                  authorAvatar=""
                  content={comment.content}
                  likesCount={comment.likes_count}
                  createdAt={new Date(comment.created_at).toLocaleString()}
                  onLike={() => console.log('Like comment', comment.id)}
                  onReply={() => console.log('Reply to comment', comment.id)}
                />
              ))}
            </div>
          ) : (
            <div className={styles.noComments}>
              <p>No comments yet. Be the first to comment!</p>
            </div>
          )}
          
          <form onSubmit={handleAddComment} className={styles.commentForm}>
            <textarea
              className={styles.commentInput}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
            />
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={!newComment.trim()}
            >
              Comment
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default PostDetailPage;