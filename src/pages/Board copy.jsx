import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  addDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { formatDate } from "../utils/formatDate";

export default function Board() {
  // 상태 정의
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState([]);

  const [search, setSearch] = useState("");

  const postsCol = collection(db, "posts"); // posts 컬렉션 참조

  // Firestore에서 게시글 목록 불러오기
  useEffect(() => {
    const q = query(postsCol, orderBy("createdAt", "desc"));

    //실시간
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(list);
    });

    return () => unsubscribe();
  }, []);

  const filteredPosts = posts.filter((post) => {
    if (!search.trim()) return true; // 검색어 없으면 모두 통과

    const lower = search.toLowerCase();
    const title = (post.title || "").toLowerCase();
    const content = (post.content || "").toLowerCase();

    return title.includes(lower) || content.includes(lower);
  });

  // 글 등록 함수
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!auth.currentUser) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력하세요.");
      return;
    }

    try {
      await addDoc(postsCol, {
        title,
        content,
        createdAt: serverTimestamp(), // 서버 시간
        authorUid: auth.currentUser.uid,
        authorEmail: auth.currentUser.email,
      });

      setTitle("");
      setContent("");

    } catch (e) {
      console.error("글 등록 실패:", e);
      alert("등록 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async (postId) => {
    if(!window.confirm("삭제하시겠습니까?")) return;

    try {
      await deleteDoc(doc(db, "posts", postId))
    } catch (e) {
      console.log("삭제 실패", e);
    }
  };

  return (
    <div style={wrap}>
      <h2 style={{ marginBottom: 20 }}>게시판</h2>
      {/* 글쓰기 폼 */}
      {auth.currentUser && auth.currentUser.uid && (
      <form style={formBox} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="제목"
          style={input}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="내용"
          style={textarea}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button style={button} type="submit">
          등록
        </button>
      </form>
      )}

      {/* 검색 영역 */}
      <div style={{ marginTop: 20 }}>
      <input
          type="text"
          placeholder="제목/내용 검색"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px 14px",
            borderRadius: 8,
            border: "1px solid #ccc",
            width: "100%",
            boxSizing: "border-box",   //100% 너비 + padding 포함
          }}
        />
      </div>

      {/* 목록 영역 */}
      <div style={{ marginTop: 30 }}>
        {posts.length === 0 && <div>첫 글을 작성해보세요 ✏️</div>}
        {posts.length > 0 && filteredPosts.length === 0 && <div>검색 결과가 없습니다.</div>}

        {filteredPosts.map((post) => (
          <div key={post.id} style={postItem}>
            <h3 style={{ marginBottom: 6 }}>
              <Link to={`/post/${post.id}`}>{post.title}</Link>
            </h3>
            <p style={{ whiteSpace: "pre-wrap" }}>{post.content}</p>

            {/* {작성자 정보 표시} */}
            <div
              style={{
                marginTop: 8,
                fontSize: 12,
                color: "#666",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}  
            >
              <span>작성자: {post.authorEmail || "알 수 없음"} · {formatDate(post.createdAt) }</span>
              {auth.currentUser && 
                post.authorUid === auth.currentUser.uid && (
                  <button
                  onClick={() => handleDelete(post.id)}
                  style={{
                    padding: "4px 10px",
                    borderRadius: 4,
                    border: "1px solid #f44336",
                    background: "#fff",
                    color: "#f44336",
                    cursor: "pointer",
                    fontSize: 12,
                  }}
                >
                  삭제
                </button>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 스타일
const wrap = {
  maxWidth: 700,
  margin: "40px auto",
};

const formBox = {
  border: "1px solid #ccc",
  padding: 16,
  borderRadius: 8,
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const input = {
  padding: 8,
  borderRadius: 4,
  border: "1px solid #ccc",
};

const textarea = {
  padding: 8,
  borderRadius: 4,
  border: "1px solid #ccc",
  minHeight: 120,
};

const button = {
  padding: 10,
  borderRadius: 4,
  border: "none",
  background: "#1976d2",
  color: "#fff",
  cursor: "pointer",
};

const postItem = {
  border: "1px solid #ddd",
  borderRadius: 8,
  padding: 16,
  marginBottom: 12,
};
