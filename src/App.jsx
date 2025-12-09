import Header from "./components/Header";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { auth } from "./firebase";

export default function App() {
  const user = auth.currentUser;
  const location = useLocation();

  // 루트("/")로 접근했을 때만 리다이렉트 처리
  if (location.pathname === "/") {
    if (user) {
      return <Navigate to="/board" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return (
    <>
      <Header />
      <div style={{ padding: "20px" }}>
        <Outlet />
      </div>
    </>
  );
}
