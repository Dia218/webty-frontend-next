'use client';

import { useEffect, useRef, useState } from 'react';
import LargeReviewItem from './LargeReviewItem';
import { ReviewItemResponseDto } from '@/lib/types/review/ReviewItemResponseDto';

const LargeReviewList = () => {
  const [reviews, setReviews] = useState<ReviewItemResponseDto[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:8080/reviews?page=${page}`);
        const data = await res.json();
        setReviews((prev) => [...prev, ...data]);
      } catch (error) {
        console.error('리뷰 데이터를 불러오는 중 오류 발생:', error);
      }
      setLoading(false);
    };

    fetchReviews();
  }, [page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [loading]);

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <LargeReviewItem key={review.reviewId} review={review} />
      ))}
      <div ref={observerRef} className="h-10"></div>
      {loading && <p className="text-center">로딩 중...</p>}
    </div>
  );
};

export default LargeReviewList;
