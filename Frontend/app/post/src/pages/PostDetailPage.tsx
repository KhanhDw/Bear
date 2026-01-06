import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Post } from "../components/PostItem";

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);

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

  if (loading || !post) {
    return (
      <div className="max-w-2xl mx-auto mt-10 text-center text-gray-500">
        Đang tải bài viết...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-6">
      <article className="rounded-2xl bg-white shadow-sm border border-gray-100 flex flex-col">
        {/* Header */}
        <div className="px-5 pt-5 pb-3 border-b">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Tác giả #{post.post_author_id}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(post.post_created_at).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="px-5 py-6">
          <p className="text-gray-800 text-sm leading-relaxed whitespace-pre-line">
            {post.post_content}
          </p>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 pt-4 border-t flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Quay lại
          </button>

          <button
            onClick={() => navigate(`/posts/${post.post_id}/edit`)}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            Chỉnh sửa
          </button>
        </div>
      </article>
    </div>
  );
}
