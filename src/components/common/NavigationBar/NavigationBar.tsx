"use client"

import Link from "next/link";
import { useState, useEffect } from "react";
import "./NavigationBar.css";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const NavigationBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null); // 로그인한 사용자 이름 저장
  const socialLoginForKaKaoUrl = `http://localhost:8080/oauth2/authorization/kakao`;
  const redirectUrlAfterSocialLogin = "http://localhost:3000";
  const socialLogoutUrl = `http://localhost:8080/logout`;

   // 로그인 상태 확인
   useEffect(() => {
    fetch("http://localhost:8080/me", { // 예시 api
      method: "GET",
      credentials: "include", // 쿠키를 포함하여 요청
    })
      .then((response) => {
        if (response.ok) {
          return response.text(); // username 반환
        }
        throw new Error("Not logged in");
      })
      .then((username) => {
        setIsLoggedIn(true); // 로그인 상태로 변경
        setUsername(username); // 사용자 이름 저장
      })
      .catch(() => {
        setIsLoggedIn(false); // 로그아웃 상태로 설정
        setUsername(null); // 사용자 이름 초기화
      });
  }, []);

  const handleLogin = (): void => {
    window.location.href = `${socialLoginForKaKaoUrl}?redirectUrl=${redirectUrlAfterSocialLogin}`;
  };

  const handleLogout = (): void => {
    fetch(socialLogoutUrl, {
      method: "GET",
      credentials: "include",
    })
      .then(() => {
        setIsLoggedIn(false);
        window.location.href = "http://localhost:3000";
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

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
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="write-btn">
              {isLoggedIn ? "로그아웃" : "로그인"}
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {isLoggedIn ? "로그아웃 하시겠습니까?" : "로그인"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {isLoggedIn
                  ? "로그아웃하려면 아래 버튼을 클릭하세요."
                  : "카카오 로그인을 진행하려면 아래 버튼을 클릭하세요."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              {isLoggedIn ? (
                <Button
                  onClick={handleLogout}
                  className="bg-red-500 text-white hover:bg-red-600"
                >
                  로그아웃
                </Button>
              ) : (
                <div
                  onClick={handleLogin}
                  className="cursor-pointer flex items-center"
                >
                  <Image
                    src="/assets/kakao_login_medium_wide.png"
                    alt="카카오 로그인"
                    width={300}
                    height={45}
                  />
                </div>
              )}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </nav>
  );
};

export default NavigationBar;
