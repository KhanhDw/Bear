import { useState } from "react";
import { PostEdit } from "../components/PostEditor";
import type { Post } from "../components/PostItem";

/**
 * Fake post dùng cho chế độ tạo mới
 * post_id = 0 hoặc -1 để phân biệt với post thật
 */
const draftPost: Post = {
  post_id: String(0),
  post_author_id: 1,
  post_content: "",
  post_created_at: new Date().toISOString(),
};

export default function CreatePostPage() {
  const [saving, setSaving] = useState(false);

  const createPost = async (content: string) => {
    try {
      setSaving(true);

      // Ví dụ gọi API
      await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      // Sau khi tạo xong (tùy logic)
      // router.push("/") hoặc reset form
      alert("Tạo bài viết thành công!");
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra khi tạo bài viết");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <PostEdit
        post={draftPost}
        loading={saving}
        onSave={createPost}
        onCancel={() => {
          // Ví dụ: quay lại trang trước
          // history.back();
          console.log("quay lại");
        }}
      />
    </div>
  );
}
