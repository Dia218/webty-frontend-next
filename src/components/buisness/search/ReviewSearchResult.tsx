'use client';

import { useState, useEffect } from 'react';
import useReviews from '@/lib/api/review/review';
import { ReviewItemResponseDto } from '@/lib/types/review/ReviewItemResponseDto';
import { Button } from '@/components/ui/button';
import { SmallReviewList } from '@/components/common/SmallReviewList/SmallReviewList';

interface ReviewPageProps {
  searchQuery: string;
}

const ReviewPage: React.FC<ReviewPageProps> = ({ searchQuery }) => {
  const [reviews, setReviews] = useState<ReviewItemResponseDto[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const { searchReviews } = useReviews();

  useEffect(() => {
    if (!searchQuery.trim()) {
      setReviews([]);
      return;
    }

    console.log('🔍 API 요청:', { searchQuery, currentPage });

    searchReviews(searchQuery, currentPage)
      .then((data) => {
        if (data) {
          console.log('✅ API 응답 데이터:', data);
          setReviews(data.content || []);
          setCurrentPage(data.currentPage);
          setTotalPages(data.totalPages);
        } else {
          console.warn('⚠️ API 응답이 예상과 다름:', data);
        }
      })
      .catch((error) => console.error('❌ API 요청 실패:', error));
  }, [searchQuery, currentPage]);

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-xl font-bold mb-4">리뷰 검색 결과</h1>
      {reviews.length > 0 ? (
        <>
          <SmallReviewList reviews={reviews} />
          <div className="flex justify-between mt-4">
            <Button onClick={goToPrevPage} disabled={currentPage === 0}>
              이전
            </Button>
            <span className="text-sm">
              {currentPage + 1} / {totalPages}
            </span>
            <Button onClick={goToNextPage} disabled={currentPage >= totalPages - 1}>
              다음
            </Button>
          </div>
        </>
      ) : (
        <p>검색 결과가 없습니다.</p>
      )}
    </div>
  );
};

export default ReviewPage;
