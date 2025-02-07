import { FeedReviewResponseDto } from '@/lib/types/review/FeedReviewResponseDto';
import SmallReviewItem from '@/components/common/Review/SmaillReviewItem';

export const SmallReviewList: React.FC<{
  reviews: FeedReviewResponseDto[];
}> = ({ reviews }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {' '}
      {/* 고정값으로 설정 */}
      {reviews.map((review) => (
        <SmallReviewItem key={review.reviewId} review={review} />
      ))}
    </div>
  );
};

{
  /* 나중에 LargeReviewList 합쳐도 됩니다 */
}
