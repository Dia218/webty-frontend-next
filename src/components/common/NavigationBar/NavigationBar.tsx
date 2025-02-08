'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // 페이지 이동을 위해 추가
import { useAuth } from '@/lib/api/security/useAuth';
import './NavigationBar.css';
import LogInOutDialog from '../LogInOutDialog/LogInOutDialog';
import { usePathname } from 'next/navigation';
import { HIDDEN_ELEMENTS } from './hiddenElements';
import WriteReviewModal from '@/components/common/ReviewWriteModal/ReviewWriteModal';

const NavigationBar: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const router = useRouter(); // 페이지 이동을 위한 useRouter 훅
  const [searchText, setSearchText] = useState('');
  const pathname = usePathname();

  const handleSearch = () => {
    if (searchText.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchText)}`); // 검색 페이지로 이동
    }
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between">
      {/* 로고 */}
      <div className="logo">
        <Link href="/">WEBTY</Link>
      </div>

       {/* 검색창 */}
       {!HIDDEN_ELEMENTS.search.includes(pathname) && (
        <div className="search-box flex w-1/2 ">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()} // 엔터 키 검색
            className="flex-1 w-4/5 mx-2 h-full px-2 "
          />
          <button onClick={handleSearch}
          >🔍</button>
        </div>
      )}


      {/* 버튼 그룹 */}
      <div className="nav-buttons">
        {!HIDDEN_ELEMENTS.writeButton.some((route) =>
          pathname.startsWith(route)
        ) &&
          isLoggedIn && (
            <button onClick={() => setIsModalOpen(true)} className="write-btn">
              글 작성
            </button>
          )}

        {!HIDDEN_ELEMENTS.mypageButton.some((route) =>
          pathname.startsWith(route)
        ) &&
          isLoggedIn && (
            <Link href="/mypage">
              <button>마이페이지</button>
            </Link>
          )}

        {/* 로그인 / 로그아웃 모달 */}
        <LogInOutDialog />
      </div>
      <WriteReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </nav>
  );
};

export default NavigationBar;
