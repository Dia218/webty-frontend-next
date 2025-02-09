import React from 'react';
import { ReviewDetailResponseDto } from '@/lib/types/review/ReviewDetailResponseDto';
import useReviews from '@/lib/api/review/review';
import UpdateDeleteButtons from '@/components/common/UpdateDeleteButtons/UpdateDeleteButtons';
import {
  LikeButton,
  DislikeButton,
} from '@/components/common/RecommendButton/RecommendButton';
import {
  recommendHate,
  recommendLike,
  removeRecommendHate,
  removeRecommendLike,
} from '@/lib/api/review/recommend';

interface ReviewDetailProps {
  review: ReviewDetailResponseDto;
  recommendationStatus: { likes: boolean; hates: boolean } | null;
  isLoggedIn: boolean;
}

const ReviewDetail: React.FC<ReviewDetailProps> = ({
  review,
  recommendationStatus,
  isLoggedIn,
}) => {
  const { updateReview, deleteReview } = useReviews();

  const handleDelete = async () => {
    try {
      await deleteReview(review.reviewId); // 삭제 요청 실행
      alert('게시글이 삭제되었습니다.');
    } catch (error) {
      alert('삭제에 실패했습니다.');
    }
  };

  const handleUpdate = () => {
    alert('수정 기능은 아직 구현되지 않았습니다.'); // 수정 폼으로 이동하던가 해야할것 같습니다
  };

  return (
    <>
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg flex items-stretch">
        <UpdateDeleteButtons onUpdate={handleUpdate} onDelete={handleDelete} />
        <div className="px-3 py-3 bg-white text-black">
          조회수 : {review.viewCount}
        </div>
        <LikeButton
          isLoggedIn={isLoggedIn}
          isInitialActive={recommendationStatus?.likes || false}
          onActivate={() => recommendLike(review.reviewId)}
          onDeactivate={() => removeRecommendLike(review.reviewId)}
        />
        <DislikeButton
          isLoggedIn={isLoggedIn}
          isInitialActive={recommendationStatus?.hates || false}
          onActivate={() => recommendHate(review.reviewId)}
          onDeactivate={() => removeRecommendHate(review.reviewId)}
        />
      </div>
    </>
  );
};

export default ReviewDetail;
