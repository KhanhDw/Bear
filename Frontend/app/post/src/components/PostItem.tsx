export interface Post {
  post_id: string;
  post_content: string;
  post_author_id: number;
  post_created_at: string;
}

/* =====================
   PostItem Component
===================== */
interface PostItemProps {
  post: Post;
}

export function PostItem({ post }: PostItemProps) {
  return (
    <article className="rounded-2xl bg-white shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col">
      {/* Header */}
      <div className="px-5 pt-5 pb-3 border-b">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Tác giả #{post.post_author_id}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(post.post_created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-4 flex-1">
        <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">
          {post.post_content}
        </p>
      </div>

      {/* Footer */}
      <div className="px-5 pb-5 pt-3 border-t flex justify-end">
        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
          Xem chi tiết →
        </button>
      </div>
    </article>
  );
}
