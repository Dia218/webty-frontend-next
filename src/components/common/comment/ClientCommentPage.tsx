'use client';

import dynamic from 'next/dynamic';

const CommentSection = dynamic(
  () => import('@/components/common/comment/CommentSection'),
  { ssr: false }
);

export default function ClientCommentPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-lg border p-6">
        <h1 className="text-2xl font-bold">댓글 테스트 페이지</h1>
        <p className="mt-4 text-gray-600">
          이 페이지는 댓글 기능을 테스트하기 위한 페이지입니다.
          댓글을 작성할 때마다 랜덤한 닉네임이 생성되며,
          @닉네임 형식으로 다른 사용자를 멘션할 수 있습니다.
        </p>
      </div>

      <div className="rounded-lg border p-6">
        <h2 className="mb-6 text-xl font-semibold">댓글</h2>
        <CommentSection />
      </div>
    </div>
  );
} 