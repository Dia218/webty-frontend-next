import { useRouter } from 'next/router';
import { Card } from '@/components/ui/card';
import { ReviewItemResponseDto } from '@/lib/types/review/ReviewItemResponseDto'; // 수정된 인터페이스 임포트
import LargeReviewItem from './LargeReviewItem';

// 리뷰 리스트 컴포넌트 (페이지네이션에 맞게 수정)
interface LargeReviewListProps {
  reviews: ReviewItemResponseDto[]; // ReviewDto -> ReviewItemResponseDto로 변경
}

export const LargeReviewList: React.FC<LargeReviewListProps> = ({ reviews }) => {
  return (
    <div className="grid grid-cols-1 gap-3 mt-3">
      {reviews.map((review) => (
        <LargeReviewItem key={review.reviewId} review={review} 
         />
      ))}
    </div>
  );
};