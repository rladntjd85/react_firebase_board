import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Register() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");

    const handleRegister = async () => {
        setErr("");

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("회원가입 완료!");
            navigate("/login");
        } catch (error) {
            console.error(error);
            setErr(error.message);
        }
    };

    return (
        <div style={container}>
          <h2>회원가입</h2>
    
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
    
          <button style={button} onClick={handleRegister}>회원가입</button>
    
          <p style={{ marginTop: 16 }}>
            이미 계정이 있나요? <Link to="/login">로그인</Link>
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
      background: "#2e7d32",
      border: "none",
      borderRadius: 4,
      color: "#fff",
      fontWeight: "bold",
      cursor: "pointer",
    };