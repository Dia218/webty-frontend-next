import fetchReviewById from '@/lib/api/review/review';
import NavigationBar from '@/components/common/NavigationBar/NavigationBar';
import { useEffect, useState } from 'react';

export default async function Page({ params }: { params: { id?: string } }) {
  const { id } = await params;

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
        const reviewData = await fetchReviewById(reviewId); // 데이터 fetch
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
      {/* 이 위치에 만드신 컴포넌트를 넣어주세요!! */}
      <div>{review?.title}</div>
      <div>{review?.content}</div>
    </>
  );
}
