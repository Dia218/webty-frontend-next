'use client';

import CommentSection from '@/components/common/CommentList/NestedCommentItem';

export default function CommentTestPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">댓글 테스트 페이지</h1>
      <CommentSection reviewId={1} isTestMode={true} />
    </div>
  );
}
