import React from 'react';
import { ReviewDetailResponseDto } from '@/lib/types/review/ReviewDetailResponseDto';

interface ReviewContentBoxProps {
  review: ReviewDetailResponseDto;
}

const ReviewContentBox: React.FC<ReviewContentBoxProps> = ({ review }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* 제목 */}
      <h2 className="text-2xl font-bold mb-2">{review.title}</h2>

      {/* 스포일러 경고 */}
      {review.spoilerStatus === 'TRUE' && (
        <p className="text-red-500 font-semibold">⚠️ 스포일러 포함</p>
      )}

      {/* 프로필 정보 */}
      <div className="flex items-center space-x-4 mb-4">
        <img
          src={review.userDataResponse.profileImage}
          alt={`${review.userDataResponse.nickname}의 프로필 이미지`}
          className="w-12 h-12 rounded-full object-cover"
        />
        <span className="text-lg font-semibold">
          {review.userDataResponse.nickname}
        </span>
      </div>

      {/* 이미지 리스트 */}
      {review.imageUrls.length > 0 && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
          {review.imageUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`리뷰 이미지 ${index + 1}`}
              className="w-full h-auto rounded-md"
            />
          ))}
        </div>
      )}

      {/* 본문 내용 */}
      <p className="text-gray-700 mt-4">{review.content}</p>
    </div>
  );
};

export default ReviewContentBox;
