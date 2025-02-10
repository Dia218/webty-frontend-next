'use client';

import useReviews from '@/lib/api/review/review';
import NavigationBar from '@/components/common/NavigationBar/NavigationBar';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation'; // useParams 사용
import ReviewDetail from '@/components/buisness/review/ReviewDetail';
import { getRecommendationStatus } from '@/lib/api/review/recommend';
import { useAuth } from '@/lib/api/security/useAuth';

export default function Page() {
  const params = useParams(); //  Next.js에서 동적 라우트 가져오기
  const id = params?.id;
  const { fetchReviewById } = useReviews();
  const { isLoggedIn, nickname } = useAuth();

  if (!id) {
    return <div className="text-center text-red-500">잘못된 요청입니다.</div>;
  }

  const reviewId = Number(id);
  const [review, setReview] = useState<any>(null);
  const [recommendationStatus, setRecommendationStatus] = useState<{
    likes: boolean;
    hates: boolean;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef<boolean>(false); // 중복방지

  useEffect(() => {
    if (isLoggedIn === null) return;
    if (hasFetched.current) return;
    hasFetched.current = true;
    const fetchData = async () => {
      try {
        const reviewData = await fetchReviewById(reviewId);
        setReview(reviewData);
        if (isLoggedIn) {
          const recommendationData = await getRecommendationStatus(reviewId);
          setRecommendationStatus(recommendationData);
        } else {
          setRecommendationStatus({ likes: false, hates: false });
        }
      } catch (err) {
        setError('리뷰 데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reviewId, isLoggedIn]);

  if (isLoggedIn === null || loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <>
      <NavigationBar />
      <div style={{ height: '20px' }} />
      <ReviewDetail
        review={review}
        recommendationStatus={recommendationStatus}
        isLoggedIn={isLoggedIn}
        nickname={nickname}
      />
    </>
  );
}
