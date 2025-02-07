'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { ReviewItemResponseDto } from '@/lib/types/review/ReviewItemResponseDto'; // 수정된 인터페이스 임포트

// 각 리뷰 아이템에 대한 컴포넌트
interface LargeReviewItemProps {
  review: ReviewItemResponseDto; // ReviewDto -> ReviewItemResponseDto로 변경
}

const LargeReviewItem: React.FC<LargeReviewItemProps> = ({ review }) => {

  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/reviews/${review.reviewId}`);
  };

  return (
    <Card
      className="flex mx-4 cursor-pointer border border-gray-300 shadow-md rounded-lg bg-white p-4"
      onClick={handleNavigate}
    >
      <div className="flex flex-col flex-1 justify-between pr-4">
        <span className="text-xs text-gray-500">웹툰 리뷰</span>
        <h2 className="text-lg font-semibold text-gray-800">{review.title}</h2>
        <p className="text-sm text-gray-600 line-clamp-1">{review.content}</p>
        <p className="text-xs text-gray-500">{review.userDataResponse.nickname}</p>

        <div className="flex flex-row space-x-2 mt-4">
          {review.imageUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt="리뷰 이미지"
              className="border border-gray-300 w-[80px] h-[80px] object-cover"
            />
          ))}
        </div>
      </div>

      <div className="flex flex-row m-0 border border-gray-300">
        <img
          src={review.thumbnailUrl}
          alt="웹툰 썸네일"
          className="w-[150px] h-[calc(100%-16px)] object-cover rounded-t-lg sm:rounded-l-lg"
        />
      </div>
    </Card>
  );
};

export default LargeReviewItem;