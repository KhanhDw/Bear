import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../contexts/UserContext';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';

const CreatePostPage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { state } = useUserContext();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if user is authenticated
    if (!state.isAuthenticated || !state.currentUser) {
      setError('You must be logged in to create a post');
      return;
    }

    if (!postContent.trim()) {
      setError('Post content cannot be empty');
      return;
    }

    console.log('Creating post:', postContent);
    // In a real app, you would call the post service here
    setPostContent('');
    setError(null);

    // Optionally redirect back to feed after posting
    // navigate('/feed');
  };

  return (
    <div className="app-container">
      <Header onDrawerToggle={handleDrawerToggle} />
      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={() => setMobileOpen(!mobileOpen)}
      />
      <main className="main-content">
        <div className="max-w-lg mx-auto">
          <h1 className="text-2xl font-bold mb-6">Create New Post</h1>

          {error && (
            <div className="alert alert-error mb-2">
              {error}
            </div>
          )}

          <div className="card">
            <div className="flex gap-2 items-start">
              <div className="avatar">
                {state.currentUser?.firstName?.charAt(0) || 'U'}
              </div>
              <div className="flex-1">
                <form onSubmit={handleSubmit}>
                  <textarea
                    className="form-input w-full mb-2"
                    rows={4}
                    placeholder="What's on your mind?"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <button
                      className="button button-primary"
                      type="submit"
                      disabled={!postContent.trim()}
                    >
                      Post
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreatePostPage;