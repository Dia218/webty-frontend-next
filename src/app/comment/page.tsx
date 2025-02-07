'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import CommentSection from '@/components/common/comment/CommentSection';
import { User } from '@/lib/types/comment';

export default function ReviewDetailPage() {
  const params = useParams();
  const reviewId = Number(params.id);
  const [currentUser, setCurrentUser] = useState<User | undefined>();

  useEffect(() => {
    // TODO: 실제 사용자 정보 가져오기
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('http://localhost:8080/user/info', {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data);
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <div className="space-y-8">
        {/* TODO: 리뷰 내용 표시 */}
        <div className="rounded-lg border p-6">
          <h1 className="text-3xl font-bold">리뷰 제목</h1>
          <p className="mt-4">리뷰 내용...</p>
        </div>

        {/* 댓글 섹션 */}
        <CommentSection reviewId={reviewId} currentUser={currentUser} />
      </div>
    </div>
  );
} 