import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

const CreatePostPage = lazy(() => import("../pages/CreatePostPage"));
const PostDetailPage = lazy(() => import("../pages/PostDetailPage"));
const EditPostPage = lazy(() => import("../pages/EditPostPage"));

type AppRoute = {
  path: string;
  element: React.JSX.Element;
};

const routes: AppRoute[] = [
  { path: "/posts/create", element: <CreatePostPage /> },
  { path: "/posts/:id", element: <PostDetailPage /> },
  { path: "/posts/:id/edit", element: <EditPostPage /> },

  // root redirect
  {
    path: "/",
    element: (
      <Navigate
        to="/posts"
        replace
      />
    ),
  },
];

export default function AppRoutes() {
  return (
    <Routes>
      {routes.map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={<Suspense fallback={<>Loading...</>}>{element}</Suspense>}
        />
      ))}

      {/* 404 */}
      <Route
        path="*"
        element={<div>404 - Not Found</div>}
      />
    </Routes>
  );
}
