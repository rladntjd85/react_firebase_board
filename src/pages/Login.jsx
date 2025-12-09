import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const navigate = useNavigate();

  if (auth.currentUser) {
    return <Navigate to="/board" replace />;
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const handleLogin = async () => {
    setErr("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/board");
    } catch (error) {
      console.error(error);
      setErr("로그인 실패: " + error.message);
    }
  };

  return (
    <div style={container}>
      <h2>로그인</h2>

      <input
        type="email"
        placeholder="이메일"
        style={input}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="비밀번호"
        style={input}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {err && <p style={{ color: "red", fontSize: 13 }}>{err}</p>}

      <button style={button} onClick={handleLogin}>
        로그인
      </button>

      <p style={{ marginTop: 16 }}>
        계정이 없나요? <Link to="/register">회원가입</Link>
      </p>
    </div>
  );
}

const container = {
  maxWidth: 400,
  margin: "80px auto",
  display: "flex",
  flexDirection: "column",
  gap: 12,
};
const input = {
  padding: 10,
  borderRadius: 4,
  border: "1px solid #ccc",
};
const button = {
  padding: 12,
  background: "#1976d2",
  border: "none",
  borderRadius: 4,
  color: "#fff",
  fontWeight: "bold",
  cursor: "pointer",
};
