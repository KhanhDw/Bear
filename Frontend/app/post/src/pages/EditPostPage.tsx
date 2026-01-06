import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PostEdit } from "../components/PostEditor";
import type { Post } from "../components/PostItem";

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/posts/${id}`);
        const data = await res.json();
        setPost(data);
      } catch (error) {
        console.error(error);
        alert("Không tải được bài viết");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const updatePost = async (content: string) => {
    if (!post) return;

    try {
      setSaving(true);

      await fetch(`/api/posts/${post.post_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      navigate(-1); // quay lại trang trước
    } catch (error) {
      console.error(error);
      alert("Cập nhật bài viết thất bại");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !post) {
    return (
      <div className="max-w-2xl mx-auto mt-10 text-center text-gray-500">
        Đang tải bài viết...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <PostEdit
        post={post}
        loading={saving}
        onSave={updatePost}
        onCancel={() => navigate(-1)}
      />
    </div>
  );
}
