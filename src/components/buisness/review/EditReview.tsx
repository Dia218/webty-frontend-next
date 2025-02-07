'use client';

import { useRouter } from 'next/navigation';
import ReviewForm from '@/components/common/ReviewForm/ReviewForm';
import { createReview } from '@/lib/api/review/review';

interface ReviewWritePageProps {
  webtoonName: string; // 검색한 웹툰 이름
  webtoonId: number; // 검색한 웹툰 ID
}

const ReviewWritePage: React.FC<ReviewWritePageProps> = ({
  webtoonName,
  webtoonId,
}) => {
  const router = useRouter();

  // 리뷰 작성 API 호출 함수
  const handleCreateReview = async (
    title: string,
    content: string,
    spoilerStatus: boolean,
    images: File[]
  ) => {
    const reviewId = await createReview({
      title,
      content,
      webtoonId,
      spoilerStatus: spoilerStatus ? 'TRUE' : 'FALSE',
      images,
    });

    if (reviewId) {
      return reviewId;
    } 
    return null;
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] w-full max-w-[100vw] p-0 bg-gray-100">
      <ReviewForm
        mode="write"
        webtoonName={webtoonName}
        webtoonId={webtoonId}
        onSubmit={handleCreateReview}
      />
    </div>
  );
};

export default ReviewWritePage;
