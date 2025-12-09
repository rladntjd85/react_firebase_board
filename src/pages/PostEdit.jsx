import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function PostEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  //기존 데이터 불러오기
  useEffect(() => {
    const fetch = async () => {
      const ref = doc(db, "posts", id);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        alert("글을 찾을 수 없습니다.");
        navigate("/board");
        return;
      }

      const data = snap.data();

      //본인 글인지 체크
      if (data.authorUid !== auth.currentUser.uid) {
        alert("수정 권한이 없습니다.");
        navigate(`/post/${id}`);
        return;
      }

      setTitle(data.title);
      setContent(data.content);
    };

    fetch();
  }, [id]);

  //수정 저장
  const handleUpdate = async (e) => {
    e.preventDefault();

    const ref = doc(db, "posts", id);

    await updateDoc(ref, {
      title,
      content,
    });

    alert("수정되었습니다!");
    navigate(`/post/${id}`);
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <h2>게시글 수정</h2>

      <form onSubmit={handleUpdate} style={{ marginTop: 20 }}>
        <input
          type="text"
          value={title}
          style={{ width: "100%", padding: 10, marginBottom: 12 }}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          value={content}
          style={{ width: "100%", padding: 10, minHeight: 200 }}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          type="submit"
          style={{
            marginTop: 16,
            padding: "10px 14px",
            background: "#1976d2",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            borderRadius: 4,
          }}
        >
          수정 완료
        </button>
        <button onClick={() => navigate(`/board`)}
          type="button"
          style={{
            marginTop: 16,
            marginLeft:5,
            padding: "10px 14px",
            background: "#1976d2",
            border: "none",
            color: "#fff",
            cursor: "pointer",
            borderRadius: 4,
          }}
        >
          목록으로
        </button>
      </form>
    </div>
  );
}
