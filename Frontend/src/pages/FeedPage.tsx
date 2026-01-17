import { Box, Container } from "@mui/material";
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
    <Box className="w-full ">
      <Header onDrawerToggle={handleDrawerToggle} />
      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={() => setMobileOpen(!mobileOpen)}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${240}px)` },
          minHeight: "100vh",
          marginTop: "64px",
        }}
      >
        <div className="flex items-center justify-center w-full ">
          <Container maxWidth="lg">
            <Box display="flex" flexDirection="column" gap={2}>
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
            </Box>
          </Container>
        </div>
      </Box>
    </Box>
  );
};

export default FeedPage;
