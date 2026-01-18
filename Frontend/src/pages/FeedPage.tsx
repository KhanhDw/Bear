import { useState, useEffect } from "react";
import PostCard from "../components/ui/PostCard";
import type { Post } from "../types/types";
import Layout from "../components/common/Layout";
import styles from "./FeedPage.module.css";

const FeedPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for posts
  useEffect(() => {
    // Simulate API call
    const fetchPosts = () => {
      setTimeout(() => {
        const mockPosts: Post[] = [
          {
            post_id: "1",
            post_author_id: "user1",
            post_author_name: "John Doe",
            post_content: "Just finished my morning run! Feeling great and ready for the day ahead.",
            post_created_at: "2023-05-15T10:30:00Z",
            upvotes: 12,
            downvotes: 2,
            comments_count: 5
          },
          {
            post_id: "2",
            post_author_id: "user2",
            post_author_name: "Jane Smith",
            post_content: "Working on a new React project with TypeScript. The type safety is really helpful for avoiding bugs!",
            post_created_at: "2023-05-15T09:15:00Z",
            upvotes: 24,
            downvotes: 1,
            comments_count: 8
          },
          {
            post_id: "3",
            post_author_id: "user3",
            post_author_name: "Bob Johnson",
            post_content: "Beautiful sunset at the beach today. Nature always has a way of calming the mind.",
            post_created_at: "2023-05-14T18:45:00Z",
            upvotes: 42,
            downvotes: 0,
            comments_count: 12
          }
        ];
        setPosts(mockPosts);
        setLoading(false);
      }, 500);
    };

    fetchPosts();
  }, []);

  const handleUpvote = (postId: string) => {
    setPosts(posts.map(post => 
      post.post_id === postId 
        ? { ...post, upvotes: post.upvotes + 1 } 
        : post
    ));
  };

  const handleDownvote = (postId: string) => {
    setPosts(posts.map(post => 
      post.post_id === postId 
        ? { ...post, downvotes: post.downvotes + 1 } 
        : post
    ));
  };

  const handleComment = (postId: string) => {
    // Navigate to post detail page
    console.log(`Comment clicked for post ${postId}`);
  };

  return (
    <Layout>
      <div className={styles.feedContainer}>
        <div className={styles.postsContainer}>
          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <p>Loading posts...</p>
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
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
                onUpvote={() => handleUpvote(post.post_id)}
                onDownvote={() => handleDownvote(post.post_id)}
                onComment={() => handleComment(post.post_id)}
              />
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>No posts found. Be the first to share something!</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FeedPage;