'use client';

import { useState, useEffect } from 'react';
import { fetchReviewsByTitle } from '@/lib/api/search/feedReviewSearch';
import { FeedReviewResponseDto } from '@/lib/types/review/FeedReviewResponseDto';
import { Button } from '@/components/ui/button';
import { SmallReviewList } from '@/components/common/SmallReviewList/SmallReviewList';

interface ReviewPageProps {
  searchQuery: string;
}

const ReviewPage: React.FC<ReviewPageProps> = ({ searchQuery }) => {
  const [reviews, setReviews] = useState<FeedReviewResponseDto[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (searchQuery.trim() !== '') {
      fetchReviewsByTitle(currentPage, { title: searchQuery }).then((data) => {
        if (data) {
          setReviews(data.content);
          setCurrentPage(data.currentPage);
          setTotalPages(data.totalPages);
        }
      });
    }
  }, [searchQuery, currentPage]);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-xl font-bold mb-4">리뷰 검색 결과</h1>
      {reviews.length > 0 ? (
        <>
          <SmallReviewList reviews={reviews} />
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
        <p>검색 결과가 없습니다.</p>
      )}
    </div>
  );
};

export default ReviewPage;
