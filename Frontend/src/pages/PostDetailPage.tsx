import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import PostCard from '../components/ui/PostCard';
import CommentCard from '../components/ui/CommentCard';

const PostDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Sample data for demonstration
  const samplePost = {
    id: id || '1',
    authorName: 'John Doe',
    authorAvatar: '/static/images/avatar/1.jpg',
    content: 'Just finished an amazing hike in the mountains! The view was absolutely breathtaking. This is a longer post to demonstrate how content looks in the detail view.',
    imageUrl: '/static/images/post/1.jpg',
    likesCount: 24,
    commentsCount: 5,
    createdAt: '2 hours ago'
  };

  const sampleComments = [
    {
      id: '1',
      authorName: 'Jane Smith',
      authorAvatar: '/static/images/avatar/2.jpg',
      content: 'Looks amazing! Where exactly did you hike?',
      likesCount: 3,
      createdAt: '1 hour ago'
    },
    {
      id: '2',
      authorName: 'Bob Johnson',
      authorAvatar: '/static/images/avatar/3.jpg',
      content: 'Beautiful view! Thanks for sharing.',
      likesCount: 1,
      createdAt: '30 minutes ago'
    }
  ];

  return (
    <div className="app-container">
      <Header onDrawerToggle={handleDrawerToggle} />
      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={() => setMobileOpen(!mobileOpen)}
      />
      <main className="main-content">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Post Detail - {id}</h1>
          <PostCard
            id={samplePost.id}
            authorName={samplePost.authorName}
            authorAvatar={samplePost.authorAvatar}
            content={samplePost.content}
            imageUrl={samplePost.imageUrl}
            likesCount={samplePost.likesCount}
            commentsCount={samplePost.commentsCount}
            createdAt={samplePost.createdAt}
          />
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-4">Comments ({sampleComments.length})</h2>
            <div className="flex flex-col gap-4">
              {sampleComments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  id={comment.id}
                  authorName={comment.authorName}
                  authorAvatar={comment.authorAvatar}
                  content={comment.content}
                  likesCount={comment.likesCount}
                  createdAt={comment.createdAt}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PostDetailPage;