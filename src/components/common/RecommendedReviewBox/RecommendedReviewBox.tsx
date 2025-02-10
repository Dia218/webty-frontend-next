'use client';

import { useState, useEffect } from 'react';
import { fetchRecommendedReviews } from '@/lib/api/review/recommend';
import { ReviewItemResponseDto } from '@/lib/types/review/ReviewItemResponseDto';
import { Button } from '@/components/ui/button';
import WideReviewList from '@/components/common/WideReviewList/WideReviewList';

interface RecommendedReviewBoxProps {
  userId: number;
}

const RecommendedReviewBox: React.FC<RecommendedReviewBoxProps> = ({
  userId,
}) => {
  const [reviews, setReviews] = useState<ReviewItemResponseDto[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchRecommendedReviews(userId)
      .then((data) => {
        console.log('추천 리뷰 데이터:', data);
        if (data) {
          setReviews(data.content);
          setCurrentPage(data.currentPage);
          setTotalPages(data.totalPages);
        }
      })
      .catch((error) => {
        console.error('리뷰 불러오기 실패:', error);
      });
  }, [userId, currentPage]);

  return (
    <div className="p-4 max-w-9xl mx-auto max-h-[500px] overflow-y-auto">
      <h1 className="text-xl font-bold mb-4">추천 리뷰</h1>
      {reviews.length > 0 ? (
        <>
          <WideReviewList reviews={reviews} />
          {/* 페이지네이션 버튼 */}
          <div className="flex justify-between mt-4">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
            >
              이전
            </Button>
            <span className="text-sm">
              {currentPage + 1} / {totalPages}
            </span>
            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
              }
              disabled={currentPage >= totalPages - 1}
            >
              다음
            </Button>
          </div>
        </>
      ) : (
        <p>추천 리뷰가 없습니다.</p>
      )}
    </div>
  );
};

export default RecommendedReviewBox;
