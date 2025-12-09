// src/auth/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    // Firebase가 로그인 정보 복구할 때까지 기다려주는 영역
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);      // 로그인 유저 or null
      setInitializing(false);     // 초기 로딩 끝
    });

    return () => unsub();
  }, []);

  const logout = () => signOut(auth);

  const value = { user, logout };

  if (initializing) {
    return <div>로딩 중...</div>;
  }

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
