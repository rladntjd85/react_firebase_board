import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  doc,
  limit,
  startAfter,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { formatDate } from "../utils/formatDate";

export default function Board() {
  // 상태 정의
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");

  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  

  const postsCol = collection(db, "posts");
  const PAGE_SIZE = 5;

  // 무한스크롤 트리거용 ref
  const observerTarget = useRef(null);

  const fileInputRef = useRef(null);

  // 초기 페이지 로딩
  const fetchInitialPosts = async () => {
    setInitialLoading(true);
    try {
      const q = query(
        postsCol,
        orderBy("createdAt", "desc"),
        limit(PAGE_SIZE)
      );

      const snap = await getDocs(q);

      if (snap.empty) {
        setPosts([]);
        setHasMore(false);
        setLastDoc(null);
        return;
      }

      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setPosts(list);
      setLastDoc(snap.docs[snap.docs.length - 1]);
      setHasMore(snap.docs.length === PAGE_SIZE);
    } catch (e) {
      console.error("게시글 초기 로딩 실패:", e);
    } finally {
      setInitialLoading(false);
    }
  };

  // 추가 페이지 로딩
  const fetchMorePosts = async () => {
    if (!hasMore || loadingMore || !lastDoc) return;

    setLoadingMore(true);
    try {
      const q = query(
        postsCol,
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(PAGE_SIZE)
      );

      const snap = await getDocs(q);

      if (snap.empty) {
        setHasMore(false);
        return;
      }

      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setPosts((prev) => [...prev, ...list]);
      setLastDoc(snap.docs[snap.docs.length - 1]);
      setHasMore(snap.docs.length === PAGE_SIZE);
    } catch (e) {
      console.error("추가 게시글 로딩 실패:", e);
    } finally {
      setLoadingMore(false);
    }
  };

  // 첫 로딩 때만 초기 페이지 가져오기
  useEffect(() => {
    fetchInitialPosts();
  }, []);

  // IntersectionObserver로 무한 스크롤
  useEffect(() => {
    if (!observerTarget.current) return;
    if (!hasMore) return;

    const io = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          fetchMorePosts();
        }
      },
      {
        threshold: 1,
      }
    );

    io.observe(observerTarget.current);

    return () => io.disconnect();
  }, [hasMore, lastDoc]);

  // 검색 필터
  const filteredPosts = posts.filter((post) => {
    if (!search.trim()) return true;

    const lower = search.toLowerCase();
    const titleText = (post.title || "").toLowerCase();
    const contentText = (post.content || "").toLowerCase();

    return titleText.includes(lower) || contentText.includes(lower);
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    // 확장자 검사
    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      alert("jpg 또는 png 파일만 업로드 가능합니다.");
      e.target.value = "";
      return;
    }
  
    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하만 가능합니다.");
      e.target.value = "";
      return;
    }
  
    setImageFile(file);
  };  

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
      let imageUrl = null;
      if (imageFile) {
        imageUrl = await uploadToCloudinary(imageFile);
      }

      await addDoc(postsCol, {
        title,
        content,
        createdAt: serverTimestamp(),
        authorUid: auth.currentUser.uid,
        authorEmail: auth.currentUser.email,
        imageUrl,
      });

      setTitle("");
      setContent("");
      setImageFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // 새 글까지 포함해서 첫 페이지 다시 로딩
      await fetchInitialPosts();
    } catch (e) {
      console.error("글 등록 실패:", e);
      alert("등록 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm("삭제하시겠습니까?")) return;

    try {
      await deleteDoc(doc(db, "posts", postId));
      // 삭제 후 첫 페이지 다시 로딩
      await fetchInitialPosts();
    } catch (e) {
      console.log("삭제 실패", e);
    }
  };

  const cloudName = import.meta.env.VITE_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_UPLOAD_PRESET;

  async function uploadToCloudinary(file) {
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const res = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!data.secure_url) {
      throw new Error("Cloudinary 업로드 실패");
    }

    return data.secure_url;
  }


  return (
    <div style={wrap}>
      <h2 style={{ marginBottom: 20 }}>게시판</h2>

      {/* 글쓰기 폼 - 로그인한 사용자만 보이게 */}
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
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
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
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* 목록 영역 */}
      <div style={{ marginTop: 30 }}>
        {initialLoading && <div>불러오는 중입니다.</div>}

        {!initialLoading && posts.length === 0 && (
          <div>첫 글을 작성해 보세요.</div>
        )}

        {posts.length > 0 && filteredPosts.length === 0 && (
          <div>검색 결과가 없습니다.</div>
        )}

        {filteredPosts.map((post) => (
          <div key={post.id} style={postItem}>
            <h3 style={{ marginBottom: 6 }}>
              <Link to={`/post/${post.id}`}>{post.title}</Link>
            </h3>

            <p style={{ whiteSpace: "pre-wrap" }}>{post.content}</p>

            {post.imageUrl && (
              <div style={{ marginTop: 12 }}>
                <img
                  src={post.imageUrl}
                  alt="이미지"
                  style={{
                    width: "100%",
                    maxWidth: 300,
                    height: "auto",
                    borderRadius: 8,
                    display: "block",
                    margin: "0 auto",
                  }}
                />
              </div>
            )}

            <div
              style={{
                marginTop: 12,
                fontSize: 12,
                color: "#666",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>
                작성자: {post.authorEmail || "알 수 없음"} · {formatDate(post.createdAt)}
              </span>

              {auth.currentUser && post.authorUid === auth.currentUser.uid && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "8px",
                    marginTop: "10px"
                  }}
                >
                  {/* 수정 */}
                  <button
                    onClick={() => navigate(`/post/${post.id}/edit`)}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 4,
                      border: "1px solid #1976d2",
                      background: "#fff",
                      color: "#1976d2",
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                  >
                    수정
                  </button>

                  {/* 삭제 */}
                  <button
                    onClick={() => handleDelete(post.id)}
                    style={{
                      padding: "4px 10px",
                      borderRadius: 4,
                      border: "1px solid #d32f2f",
                      background: "#fff",
                      color: "#d32f2f",
                      cursor: "pointer",
                      fontSize: 12,
                    }}
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}


        {/* 무한 스크롤 트리거 */}
        <div ref={observerTarget} style={{ height: 1 }} />

        {loadingMore && <div>추가 불러오는 중입니다.</div>}
        {!hasMore && posts.length > 0 && (
          <div style={{ marginTop: 12, fontSize: 12, color: "#888" }}>
            더 이상 불러올 게시글이 없습니다.
          </div>
        )}
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

const btnStyle = {
  padding: "4px 10px",
  borderRadius: 4,
  border: "1px solid #f44336",
  background: "#fff",
  color: "#f44336",
  cursor: "pointer",
  fontSize: 12,
};
