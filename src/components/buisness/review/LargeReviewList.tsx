import { useEffect, useRef, useState, useCallback } from 'react';
import LargeReviewItem from './LargeReviewItem';
import { ReviewItemResponseDto } from '@/lib/types/review/ReviewItemResponseDto';

interface ReviewApiResponse {
  content: ReviewItemResponseDto[];
  last: boolean;
}

const LargeReviewList = () => {
  const [reviews, setReviews] = useState<ReviewItemResponseDto[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  const fetchReviews = useCallback(async () => {
    if (loading || isLastPage) return;

    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/reviews?page=${page}`);
      const data: ReviewApiResponse = await res.json();

      console.log('API Response:', data);

      setReviews((prev) => {
        const newReviews = data.content.filter(
          (newReview) =>
            !prev.some(
              (existingReview) => existingReview.reviewId === newReview.reviewId
            )
        );
        return [...prev, ...newReviews];
      });

      setIsLastPage(data.last);
    } catch (error) {
      console.error('리뷰 데이터를 불러오는 중 오류 발생:', error);
    }
    setLoading(false);
  }, [page, loading, isLastPage]);

  useEffect(() => {
    fetchReviews();
  }, [page]);

  useEffect(() => {
    if (isLastPage) return;

    observer.current = new IntersectionObserver(
      (entries) => {
        console.log('🔎 IntersectionObserver 이벤트 발생:', {
          isIntersecting: entries[0].isIntersecting,
          loading,
          isLastPage,
        });

        if (entries[0].isIntersecting && !loading && !isLastPage) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.current.observe(observerRef.current);
    }

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [loading, isLastPage]);

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <LargeReviewItem key={review.reviewId} review={review} />
      ))}
      <div ref={observerRef} className="h-40"></div>
      {loading && <p className="text-center">로딩 중...</p>}
      {isLastPage && (
        <p className="text-center text-gray-500">더 이상 리뷰가 없습니다.</p>
      )}
    </div>
  );
};

export default LargeReviewList;
