import { Outlet, useNavigate } from "react-router-dom";

export default function PostLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
        <h1
          className="text-lg font-semibold cursor-pointer"
          onClick={() => navigate("/posts")}
        >
          Post Management
        </h1>

        <button
          onClick={() => navigate("/posts/create")}
          className="text-sm font-medium px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700"
        >
          + Tạo bài viết
        </button>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
