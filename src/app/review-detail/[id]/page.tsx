'use client';

import useReviews from '@/lib/api/review/review';
import NavigationBar from '@/components/common/NavigationBar/NavigationBar';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // useParams 사용
import ReviewDetail from '@/components/buisness/review/ReviewDetail';

export default function Page() {
  const params = useParams(); //  Next.js에서 동적 라우트 가져오기
  const id = params?.id;
  const { fetchReviewById } = useReviews();

  if (!id) {
    return <div className="text-center text-red-500">잘못된 요청입니다.</div>;
  }

  const reviewId = Number(id);
  const [review, setReview] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reviewData = await fetchReviewById(reviewId);
        setReview(reviewData);
      } catch (err) {
        setError('리뷰 데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reviewId]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <>
      <NavigationBar />
      <ReviewDetail review={review} />
    </>
  );
}
