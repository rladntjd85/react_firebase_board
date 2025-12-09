import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./auth/AuthContext.jsx";

import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Board from "./pages/Board.jsx";
import PostDetail from "./pages/PostDetail.jsx";
import PostEdit from "./pages/PostEdit.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 레이아웃(부모 라우트)로 사용 */}
          <Route path="/" element={<App />}>
            {/* 자식 라우트들은 여기서부터 */}

            {/* /login */}
            <Route path="login" element={<Login />} />

            {/* /register */}
            <Route path="register" element={<Register />} />

            {/* /board */}
            <Route
              path="board"
              element={
                <ProtectedRoute>
                  <Board />
                </ProtectedRoute>
              }
            />

            {/* /post/:id */}
            <Route
              path="post/:id"
              element={
                <ProtectedRoute>
                  <PostDetail />
                </ProtectedRoute>
              }
            />

            {/* /post/:id/edit */}
            <Route
              path="post/:id/edit"
              element={
                <ProtectedRoute>
                  <PostEdit />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
