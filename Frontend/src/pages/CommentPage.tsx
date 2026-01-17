import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import CommentCard from '../components/ui/CommentCard';

const CommentPage = () => {
  const { id } = useParams<{ id?: string }>();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Sample comments data
  const sampleComments = [
    {
      id: '1',
      authorName: 'John Doe',
      authorAvatar: '/static/images/avatar/1.jpg',
      content: 'This is a great post! Thanks for sharing.',
      likesCount: 5,
      createdAt: '2 hours ago'
    },
    {
      id: '2',
      authorName: 'Jane Smith',
      authorAvatar: '/static/images/avatar/2.jpg',
      content: 'I completely agree with your perspective on this topic.',
      likesCount: 3,
      createdAt: '1 hour ago'
    },
    {
      id: '3',
      authorName: 'Bob Johnson',
      authorAvatar: '/static/images/avatar/3.jpg',
      content: 'Could you provide more details about this? It sounds interesting.',
      likesCount: 1,
      createdAt: '30 minutes ago'
    },
    {
      id: '4',
      authorName: 'Alice Brown',
      authorAvatar: '/static/images/avatar/4.jpg',
      content: 'Thanks for the insight. This really helped me understand the topic better.',
      likesCount: 7,
      createdAt: '15 minutes ago'
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
          <h1 className="text-2xl font-bold mb-6">
            {id ? `Comments for Post - ${id}` : 'Comments'}
          </h1>
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
      </main>
    </div>
  );
};

export default CommentPage;