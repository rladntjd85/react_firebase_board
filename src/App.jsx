import Header from "./components/Header";
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <>
      <Header />

      {/* 개별 페이지가 여기 안에 렌더됨 */}
      <div style={{ padding: "20px" }}>
        <Outlet />
      </div>
    </>
  );
}
