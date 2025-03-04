import { ReviewItemResponseDto } from '@/lib/types/review/ReviewItemResponseDto';
import SmallReviewItem from '@/components/common/SmallReviewList/SmallReviewItem';
import { useMemo } from 'react';

export const SmallReviewList: React.FC<{
  reviews: ReviewItemResponseDto[];
}> = ({ reviews }) => {
  // 백엔드에서 받은 순서 그대로 표시 (스포일러 상태로 정렬하지 않음)
  const sortedReviews = useMemo(() => {
    // 원본 배열의 순서를 유지하되, 스포일러 상태로 정렬하지 않음
    return [...reviews];
  }, [reviews]);

  return (
    <div className="grid grid-cols-1 gap-4">
      {' '}
      {/* 고정값으로 설정 */}
      {sortedReviews.map((review) => (
        <SmallReviewItem key={review.reviewId} review={review} />
      ))}
    </div>
  );
};

// 웹툰 게시물 보기에 써보려고 합니다. (백엔드 구현안되서 아직 못써봄)
export const SmallReviewListTwoCols: React.FC<{
  reviews: ReviewItemResponseDto[];
}> = ({ reviews }) => {
  // 백엔드에서 받은 순서 그대로 표시
  const sortedReviews = useMemo(() => {
    return [...reviews]; // 원본 배열의 순서를 유지
  }, [reviews]);

  return (
    <div className="grid grid-cols-2 gap-4">
      {' '}
      {/* 가로 2개씩 정렬 */}
      {sortedReviews.map((review) => (
        <SmallReviewItem key={review.reviewId} review={review} />
      ))}
    </div>
  );
};
