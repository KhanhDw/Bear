import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PostApp from "../remotes/PostApp";
import UserApp from "../remotes/UserApp";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default */}
        <Route
          path="/"
          element={
            <Navigate
              to="/posts"
              replace
            />
          }
        />

        {/* Micro Apps */}
        <Route
          path="/posts/*"
          element={<PostApp />}
        />
        <Route
          path="/users/*"
          element={<UserApp />}
        />

        {/* 404 */}
        <Route
          path="*"
          element={<div>404 - Shell</div>}
        />
      </Routes>
    </BrowserRouter>
  );
}
