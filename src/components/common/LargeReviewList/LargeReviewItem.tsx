'use client';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { ReviewItemResponseDto } from '@/lib/types/review/ReviewItemResponseDto';
import { useState } from 'react';

interface LargeReviewItemProps {
  review: ReviewItemResponseDto;
}

const LargeReviewItem: React.FC<LargeReviewItemProps> = ({ review }) => {
  const [showSpoiler, setShowSpoiler] = useState(false);
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/review-detail/${review.reviewId}`);
  };

  return (
    <Card
      className="flex mx-3 cursor-pointer border border-gray-300 rounded-lg bg-white p-4"
      onClick={handleNavigate}
    >
      <div className="flex flex-col flex-1 justify-between ">
        {/*  위쪽부분(유저 이미지, 이름, 조회수, 댓글) */}
        <div className="flex items-center mb-2 justify-between">
          {/*  유저 이미지, 이름 */}
          <div className="flex items-center">
            <img
              src={review.userDataResponse.profileImage}
              className=" border border-gray-300 w-[28px] h-[28px] rounded-full object-cover"
            />
            <p className="mx-2 text-[15px] text-gray-500">
              {review.userDataResponse.nickname}
            </p>
          </div>
          {/* 조회수, 댓글 */}
          <div className="flex space-x-2 mx-2">
            <p className="mx-2 text-xs text-gray-500">
              조회수: {review.viewCount}
            </p>
            <p className="mx-2 text-xs text-gray-500">
              추천수: {review.recommendCount}
            </p>
            <p className="mx-2 text-xs text-gray-500">
              댓글: {review.commentCount}
            </p>
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-800 mb-1 flex items-center ">
          {review.title}
          {review.spoilerStatus === 'TRUE' && (
            <span className="text-red-500 text-sm">🚨 [스포일러]</span>
          )}
        </h2>

        {review.spoilerStatus === 'TRUE' && !showSpoiler ? (
          <div className="bg-red-100 text-red-500 p-2 rounded mt-2 mr-2 flex items-center justify-between">
            <span>⚠️ 이 리뷰에는 스포일러가 포함되어 있습니다.</span>
            <button
              onClick={(e) => {
                e.stopPropagation(); // 클릭 이벤트 전파 방지
                setShowSpoiler(true);
              }}
              className="text-blue-500 underline text-sm"
            >
              보기
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-600 line-clamp-1 ">
            {review.content}
          </p>
        )}

        <div className="flex flex-row space-x-2 mt-2">
          {/* 이미지가 있으면 이미지들을 표시 */}
          {(review.spoilerStatus === 'FALSE' || showSpoiler) &&
          review.imageUrls &&
          review.imageUrls.length > 0 ? (
            review.imageUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`리뷰 이미지 ${index + 1}`}
                className="border border-gray-300 w-[200px] h-[150px] object-cover"
              />
            ))
          ) : (
            <span className="text-xs text-gray-500">이미지가 없습니다.</span>
          )}
        </div>
        <div></div>
      </div>

      <div className="flex flex-row m-0">
        <img
          src={review.webtoon.thumbnailUrl}
          alt="웹툰 썸네일"
          className="w-[150px] h-[calc(100%-16px)] object-cover "
        />
      </div>
    </Card>
  );
};

export default LargeReviewItem;
