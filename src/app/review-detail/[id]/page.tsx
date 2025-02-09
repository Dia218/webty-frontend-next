'use client';

import useReviews from '@/lib/api/review/review';
import NavigationBar from '@/components/common/NavigationBar/NavigationBar';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation'; // useParams 사용

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
  const hasFetched = useRef<boolean>(false); // 중복방지

  useEffect(() => {
    if (hasFetched.current) return; // ✅ 이미 요청했으면 실행하지 않음
    hasFetched.current = true; // ✅ 요청 완료 상태로 변경
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
      <div>{review?.title}</div>
      <div>{review?.content}</div>
    </>
  );
}
