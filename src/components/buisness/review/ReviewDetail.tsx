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
import ReviewRecommendationBox from '@/components/buisness/review/ReviewRecommendBox';
import ReviewInfo from '@/components/buisness/review/ReviewInfo';
import ReviewContentBox from '@/components/buisness/review/ReviewContentBox';
import ReviewWebtoonBox from '@/components/common/ReviewWebtoonBox/ReviewWebtoonBox';

interface ReviewDetailProps {
  review: ReviewDetailResponseDto;
  recommendationStatus: { likes: boolean; hates: boolean } | null;
  isLoggedIn: boolean;
  id: number | null;
}

const ReviewDetail: React.FC<ReviewDetailProps> = ({
  review,
  recommendationStatus,
  isLoggedIn,
  id,
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
      <div className="w-full max-w-6xl mx-auto p-10 bg-white shadow-lg rounded-lg flex">
        {/* 왼쪽: 리뷰 콘텐츠 (크게) */}
        <div className="flex-1 pr-6">
          <ReviewContentBox review={review} />
        </div>

        {/* 오른쪽: 정보 + 추천 버튼 (세로 정렬) */}
        <div className="w-1/3 flex flex-col justify-between">
          {/* 리뷰 정보 (상단) */}
          <div className="mb-4">
            <ReviewInfo
              actionButtons={
                <UpdateDeleteButtons
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                />
              }
              viewCount={review.viewCount}
              createdAt={review.createdAt}
              updatedAt={review.updatedAt}
              showButtons={review.userDataResponse.id === id}
            />
          </div>

          {/* 웹툰 박스 (중간) */}
          <ReviewWebtoonBox
            webtoon={{
              webtoonId: review.webtoonId,
              webtoonName: review.webtoonName,
              thumbnailUrl: review.thumbnailUrl,
            }}
          />

          {/* 추천 박스 (하단) */}
          <div>
            <ReviewRecommendationBox
              likeButton={
                <LikeButton
                  isLoggedIn={isLoggedIn}
                  isInitialActive={recommendationStatus?.likes || false}
                  onActivate={() => recommendLike(review.reviewId)}
                  onDeactivate={() => removeRecommendLike(review.reviewId)}
                />
              }
              dislikeButton={
                <DislikeButton
                  isLoggedIn={isLoggedIn}
                  isInitialActive={recommendationStatus?.hates || false}
                  onActivate={() => recommendHate(review.reviewId)}
                  onDeactivate={() => removeRecommendHate(review.reviewId)}
                />
              }
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewDetail;
