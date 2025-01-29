'use client';

import Link from 'next/link';
import { useState } from 'react';
import './NavigationBar.css';

const NavigationBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
        {isLoggedIn ? (
          <>
            <Link href="/mypage">
              <button>마이페이지</button>
            </Link>
            <button onClick={() => setIsLoggedIn(false)}>로그아웃</button>
          </>
        ) : (
          <Link href="/login">
            <button onClick={() => setIsLoggedIn(true)}>로그인</button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavigationBar;
