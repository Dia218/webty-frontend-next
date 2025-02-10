'use client';

import { useParams, useRouter } from 'next/navigation';
import useReviews from '@/lib/api/review/review';
import ReviewForm from '@/components/common/ReviewForm/ReviewForm';
import { ReviewRequestDto } from '@/lib/types/review/ReviewRequestDto';
import { ReviewDetailResponseDto } from '@/lib/types/review/ReviewDetailResponseDto';

const ReviewUpdate = () => {
  const { reviewId } = useParams(); // URL에서 reviewId 가져오기
  const { updateReview } = useReviews();
  const router = useRouter();

  // sessionStorage에서 review 데이터 가져오기
  const storedReview = sessionStorage.getItem('reviewData');
  const review: ReviewDetailResponseDto | null = storedReview
    ? JSON.parse(storedReview)
    : null;

  if (!review) {
    console.error('Review 데이터가 없습니다.');
    return (
      <p className="text-center text-red-500">
        리뷰 데이터를 불러올 수 없습니다.
      </p>
    );
  }

  const handleUpdateReview = async (reviewRequestDto: ReviewRequestDto) => {
    // 기존 이미지 URL을 File 객체로 변환하는 함수
    const convertUrlToFile = async (imageUrl: string): Promise<File> => {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      return new File([blob], imageUrl.split('/').pop() || 'image.jpg', {
        type: blob.type,
      });
    };
    // 기존 이미지 변환 (비동기 처리)
    const existingImageFiles = await Promise.all(
      (review.imageUrls ?? []).map((url) => convertUrlToFile(url))
    );

    // 기존 이미지 + 새로 추가한 이미지 합치기
    const allImages: File[] = [
      ...existingImageFiles,
      ...(reviewRequestDto.images ?? []),
    ];

    const formattedRequest: ReviewRequestDto = {
      ...reviewRequestDto,
      spoilerStatus:
        reviewRequestDto.spoilerStatus === 'TRUE' ? 'TRUE' : 'FALSE',
      images: allImages,
    };
    console.log('최종 요청 데이터:', formattedRequest);
    if (!review.reviewId) return null;

    try {
      await updateReview(review.reviewId, formattedRequest);
      console.log('업데이트 성공:');
      return review.reviewId;
    } catch (error) {
      console.error('리뷰 수정에 실패했습니다.');
      return null;
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[90vh] w-full bg-gray-100">
      <ReviewForm
        mode="edit"
        webtoonName={review.webtoonName}
        webtoonId={review.webtoonId}
        initialTitle={review.title}
        initialContent={review.content}
        initialImages={review.imageUrls ?? []}
        initialSpoilerStatus={review.spoilerStatus === 'TRUE'}
        onSubmit={handleUpdateReview}
      />
    </div>
  );
};

export default ReviewUpdate;
