import { useState } from "react";
import type { Post } from "./PostItem";

interface PostEditProps {
  post: Post;
  loading?: boolean;
  onSave: (content: string) => void;
  onCancel?: () => void;
}

/*
using component
<PostEdit
  post={post}
  loading={saving}
  onSave={(content) => updatePost(post.post_id, content)}
  onCancel={() => setEdit(false)}
/>

*/

export function PostEdit({
  post,
  loading = false,
  onSave,
  onCancel,
}: PostEditProps) {
  const [content, setContent] = useState(post.post_content);
  const [dirty, setDirty] = useState(false);

  const handleSave = () => {
    if (!content.trim()) return;
    onSave(content.trim());
  };

  return (
    <article className="rounded-2xl bg-white shadow-sm border border-gray-100 flex flex-col">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b flex items-center justify-between">
        <span className="text-sm text-gray-500">
          Chỉnh sửa bài viết #{post.post_id}
        </span>
        <span className="text-xs text-gray-400">
          {new Date(post.post_created_at).toLocaleDateString()}
        </span>
      </div>

      {/* Content */}
      <div className="px-5 py-4 flex-1">
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setDirty(true);
          }}
          placeholder="Bạn đang nghĩ gì?"
          className="
            w-full min-h-[120px] resize-none
            text-sm text-gray-700
            rounded-xl border border-gray-200
            px-4 py-3
            focus:outline-none focus:ring-2 focus:ring-indigo-500
          "
        />

        <div className="mt-2 text-right text-xs text-gray-400">
          {content.length} ký tự
        </div>
      </div>

      {/* Footer */}
      <div className="px-5 pb-5 pt-3 border-t flex items-center justify-end gap-3">
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Hủy
          </button>
        )}

        <button
          disabled={!dirty || loading}
          onClick={handleSave}
          className={`
            text-sm font-medium px-4 py-2 rounded-xl
            transition
            ${
              dirty && !loading
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }
          `}
        >
          {loading ? "Đang lưu..." : "Lưu thay đổi"}
        </button>
      </div>
    </article>
  );
}
