import { useState } from "react";
import Header from "../components/common/Header";
import Sidebar from "../components/common/Sidebar";
import PostCard from "../components/ui/PostCard";
import type { Post } from "../types/types";

const FeedPage = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className="app-container">
      <Header onDrawerToggle={handleDrawerToggle} />
      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={() => setMobileOpen(!mobileOpen)}
      />
      <main className="main-content">
        <div className="flex items-center justify-center w-full">
          <div className="max-w-4xl w-full">
            <div className="flex flex-col gap-4">
              {posts.map((post) => (
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
        </div>
      </main>
    </div>
  );
};

export default FeedPage;