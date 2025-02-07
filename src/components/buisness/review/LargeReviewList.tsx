import { ReviewItemResponseDto } from '@/lib/types/review/ReviewItemResponseDto';
import FeedReviewItem from './LargeReviewItem';
import { FC } from 'react';

interface LargeReviewListProps {
  reviews: ReviewItemResponseDto[];
}

const LargeReviewList: FC<LargeReviewListProps> = ({ reviews }) => {
  return (
    <div>
      <FeedReviewItem reviewId={1} />
      <FeedReviewItem reviewId={2} />
    </div>
  );
};

export default LargeReviewList;
