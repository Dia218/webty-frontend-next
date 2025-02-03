"use client";

import Link from "next/link";
import { useAuth } from "@/lib/api/user/user";
import "./NavigationBar.css";
import LogInOutDialog from "../LogInOutDialog/LogInOutDialog";

const NavigationBar = () => {
  const { isLoggedIn } = useAuth();

  return (
    <nav className="navbar">
      {/* 로고 */}
      <div className="logo">
        <Link href="/">WEBTY</Link>
      </div>

      {/* 검색창 */}
      <div className="search-box">
        <input type="text" placeholder="검색어를 입력하세요" />
        <button>🔍</button>
      </div>

      {/* 버튼 그룹 */}
      <div className="nav-buttons">
        <Link href="/write">
          <button className="write-btn">글 작성</button>
        </Link>

        {isLoggedIn && (
          <Link href="/mypage">
            <button>마이페이지</button>
          </Link>
        )}

        {/* 로그인 / 로그아웃 모달 */}
        <LogInOutDialog />
      </div>
    </nav>
  );
};

export default NavigationBar;
