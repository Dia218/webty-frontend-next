'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import CommentSection from '@/components/common/comment/CommentSection';
import NavigationBar from '@/components/common/NavigationBar/NavigationBar';

export default function ReviewDetailPage() {
  const params = useParams();
  const reviewId = Number(params.id);

  return (
    <div>
      <NavigationBar />
      <div className="container mx-auto py-8">
        <div className="space-y-8">
          {/* TODO: 리뷰 내용 표시 */}
          <div className="rounded-lg border p-6">
            <h1 className="text-3xl font-bold">리뷰 제목</h1>
            <p className="mt-4">리뷰 내용...</p>
          </div>

          {/* 댓글 섹션 */}
          <CommentSection reviewId={reviewId} />
        </div>
      </div>
    </div>
  );
} 