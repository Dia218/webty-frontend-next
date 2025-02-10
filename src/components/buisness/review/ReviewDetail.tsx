'use client';

import React from 'react';
import { ReviewDetailResponseDto } from '@/lib/types/review/ReviewDetailResponseDto';
import useReviews from '@/lib/api/review/review';
import UpdateDeleteButtons from '@/components/common/UpdateDeleteButtons/UpdateDeleteButtons';
import { useRouter } from 'next/navigation';
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
  nickname: string | null;
}

const ReviewDetail: React.FC<ReviewDetailProps> = ({
  review,
  recommendationStatus,
  isLoggedIn,
  nickname,
}) => {
  const { deleteReview } = useReviews();
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteReview(review.reviewId);
      alert('게시글이 삭제되었습니다.');
      router.push('/feed');
    } catch (error) {
      alert('삭제에 실패했습니다.');
    }
  };

  const handleUpdate = () => {
    // review 객체를 sessionStorage에 저장
    sessionStorage.setItem('reviewData', JSON.stringify(review));

    // reviewId만 URL을 통해 전달
    router.push(`/review-update/${review.reviewId}`);
  };

  return (
    <>
      <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg flex items-stretch">
        {nickname === review.userDataResponse.nickname && (
          <UpdateDeleteButtons
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        )}
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
