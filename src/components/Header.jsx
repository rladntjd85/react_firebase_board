import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header
      style={{
        padding: "12px 20px",
        background: "#1976d2",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* 로고 / 메인 이동 */}
      <Link to="/board" style={{ fontSize: 20, color: "white" }}>
        Firebase Board
      </Link>

      {/* 로그인 상태에 따라 메뉴 변경 */}
      <nav style={{ display: "flex", gap: 16 }}>
        {!user && (
          <>
            <Link to="/login" style={{ color: "white" }}>
              로그인
            </Link>
            <Link to="/register" style={{ color: "white" }}>
              회원가입
            </Link>
          </>
        )}

        {user && (
          <>
            <span style={{ fontSize: 14 }}>{user.email}</span>
            <button
              onClick={handleLogout}
              style={{
                background: "white",
                color: "#1976d2",
                borderRadius: 4,
                padding: "4px 8px",
                border: "none",
                cursor: "pointer",
              }}
            >
              로그아웃
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
