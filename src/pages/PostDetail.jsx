import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { formatDate } from "../utils/formatDate";

export default function PostDetail() {
  const { id } = useParams(); // URL의 :id 읽기
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  //글 1개 읽기
  useEffect(() => {
    const fetchPost = async () => {
      const ref = doc(db, "posts", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setPost({ id: snap.id, ...snap.data() });
      } else {
        alert("게시글이 존재하지 않습니다.");
        navigate("/board");
      }

      setLoading(false);
    };

    fetchPost();
  }, [id]);

  if (loading) return <div>불러오는 중...</div>;
  if (!post) return null;

  const isOwner = auth.currentUser?.uid === post.authorUid;

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "40px auto",
        padding: 20,
        borderRadius: 8,
        border: "1px solid #e0e0e0",
        boxSizing: "border-box",
        background: "#fff",
      }}
    >
      {/* 제목 */}
      <h2 style={{ marginBottom: 8 }}>{post.title}</h2>
  
      {/* 작성자 / 날짜 */}
      <div
        style={{
          fontSize: 12,
          color: "#888",
          marginBottom: 16,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span>{post.authorEmail || "알 수 없음"}</span>
        <span>{formatDate(post.createdAt)}</span>
      </div>
  
      {/* 이미지 (있을 때만) */}
      {post.imageUrl && (
        <div style={{ marginBottom: 20, textAlign: "center" }}>
          <img
            src={post.imageUrl}
            alt="이미지"
            style={{
              maxWidth: "100%",
              borderRadius: 8,
              display: "inline-block",
            }}
          />
        </div>
      )}
  
      {/* 본문 */}
      <p
        style={{
          whiteSpace: "pre-wrap",
          lineHeight: 1.6,
          marginTop: 0,
        }}
      >
        {post.content}
      </p>
  
      {/* 아래 영역: 왼쪽에는 목록 링크, 오른쪽에는 수정 버튼(본인일 때만) */}
      <div
        style={{
          marginTop: 30,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link to="/board">← 목록으로</Link>
  
        {isOwner && (
          <button
            style={{
              padding: "8px 12px",
              background: "#ffa726",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              color: "#fff",
            }}
            onClick={() => navigate(`/post/${id}/edit`)}
          >
            수정하기
          </button>
        )}
      </div>
    </div>
  );
}
