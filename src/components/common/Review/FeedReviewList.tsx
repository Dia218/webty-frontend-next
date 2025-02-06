import { FeedReviewResponseDto } from '@/lib/types/review/FeedReviewResponseDto';
import FeedReviewItem from '@/components/common/Review/FeedReviewItem';

const ReviewList: React.FC<{ reviews: FeedReviewResponseDto[] }> = ({
  reviews,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {' '}
      {/* 고정값으로 설정 */}
      {reviews.map((review) => (
        <FeedReviewItem key={review.reviewId} review={review} />
      ))}
    </div>
  );
};

export default ReviewList;
