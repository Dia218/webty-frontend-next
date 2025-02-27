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
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between">
      {/* 로고 */}
      <div className="logo">
        <Link href="/">WEBTY</Link>
      </div>

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

        {isLoggedIn && (
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
