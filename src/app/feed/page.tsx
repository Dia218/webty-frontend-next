'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LargeReviewList } from '@/components/buisness/review/LargeReviewList';
import { ReviewItemResponseDto } from '@/lib/types/review/ReviewItemResponseDto';
import { PageDto } from '@/lib/types/common/PageDto';
import NavigationBar from '@/components/common/NavigationBar/NavigationBar';

const FeedPage = () => {
  const [reviews, setReviews] = useState<ReviewItemResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();

  // 서버에서 리뷰 데이터를 가져오는 함수
  const fetchReviews = async () => {
    setLoading(true); // 데이터 로딩 시작
    try {
      const res = await fetch(`http://localhost:8080/reviews?page=${currentPage}`);
      if (!res.ok) throw new Error('서버 응답 오류');

      const data: PageDto<ReviewItemResponseDto> = await res.json();
      setReviews(data.content); // 리뷰 리스트 상태 업데이트
      setTotalPages(data.totalPages); // 전체 페이지 수 업데이트
    } catch (err) {
      setError('리뷰를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false); // 데이터 로딩 완료
    }
  };

  // 페이지가 변경될 때마다 리뷰 데이터를 다시 fetch
  useEffect(() => {
    
      fetchReviews(); // 클라이언트에서만 fetchReviews 호출
    
  }, [currentPage]); // 클라이언트에서만 실행되도록

  if (loading) return <div className="text-center p-4">로딩 중...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

  return (
    <>
      <NavigationBar />
      <LargeReviewList reviews={reviews} />

      {/* 페이지네이션 버튼 */}
      <div className="flex justify-between mt-4">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
          disabled={currentPage === 0} // 첫 번째 페이지에서 이전 버튼 비활성화
        >
          이전
        </Button>
        <span className="text-sm">
          {currentPage + 1} / {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
          disabled={currentPage >= totalPages - 1}
        >
          다음
        </Button>
      </div>
    </>
  );
};

export default FeedPage;
