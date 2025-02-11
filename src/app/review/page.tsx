'use client';

import { useSearchParams } from 'next/navigation';
import ReviewWritePage from '@/components/buisness/review/EditReview';
import NavigationBar from '@/components/common/NavigationBar/NavigationBar';

const ReviewPage = () => {
  const searchParams = useSearchParams();
  const webtoonId = searchParams.get('webtoonId');
  const webtoonName = searchParams.get('webtoonName');

  if (!webtoonId || !webtoonName) {
    return <p>유효한 웹툰 정보가 없습니다.</p>;
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <NavigationBar /> {/* 네비게이션 바 추가 */}
      <ReviewWritePage
        webtoonName={decodeURIComponent(webtoonName)}
        webtoonId={parseInt(webtoonId, 10)}
      />
    </main>
  );
};

export default ReviewPage;
