import React from 'react';
import { ReviewDetailResponseDto } from '@/lib/types/review/ReviewDetailResponseDto';
import useReviews from '@/lib/api/review/review';
import UpdateDeleteButtons from '@/components/common/UpdateDeleteButtons/UpdateDeleteButtons';
import {
  LikeButton,
  DislikeButton,
} from '@/components/common/RecommendButton/RecommendButton';

interface ReviewDetailProps {
  review: ReviewDetailResponseDto;
}

const ReviewDetail: React.FC<ReviewDetailProps> = ({ review }) => {
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
          isLoggedIn={true}
          isInitialActive={false}
          onActivate={() => console.log('👍 추천 추가!')}
          onDeactivate={() => console.log('👍 추천 취소!')}
        />
        <DislikeButton
          isLoggedIn={true}
          isInitialActive={false}
          onActivate={() => console.log('👎 비추천 추가!')}
          onDeactivate={() => console.log('👎 비추천 취소!')}
        />
      </div>
    </>
  );
};

export default ReviewDetail;
