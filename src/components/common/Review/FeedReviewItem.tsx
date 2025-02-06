import { FeedReviewResponseDto } from '@/lib/types/review/FeedReviewResponseDto';
import { useState } from 'react';

const FeedReviewItem: React.FC<{ review: FeedReviewResponseDto }> = ({
  review,
}) => {
  const [showSpoiler, setShowSpoiler] = useState(false);

  return (
    <div className="border p-4 rounded-lg shadow-md flex justify-between items-start">
      {/* 왼쪽 컨텐츠 */}
      <div className="flex-1">
        {/* 웹툰 ID & 조회수/댓글 */}
        <div className="flex justify-between items-center text-xs text-gray-400">
          <p>웹툰 ID: {review.webtoonId}</p>
          <div className="flex space-x-2">
            <p>조회수: {review.viewCount}</p>
            <p>댓글: {review.commentCount}</p>
          </div>
        </div>

        {/* 제목 (스포일러 표시 포함) */}
        <h2 className="text-lg font-bold mt-1">
          {review.title}{' '}
          {review.spoilerStatus === 'TRUE' && (
            <span className="text-red-500 text-sm">🚨 [스포일러]</span>
          )}
        </h2>

        {/* 내용 (스포일러 시 가리기) */}
        {review.spoilerStatus === 'TRUE' && !showSpoiler ? (
          <div className="bg-red-100 text-red-500 p-2 rounded mt-2 flex items-center justify-between">
            <span>⚠️ 이 리뷰에는 스포일러가 포함되어 있습니다.</span>
            <button
              onClick={() => setShowSpoiler(true)}
              className="text-blue-500 underline text-sm"
            >
              보기
            </button>
          </div>
        ) : (
          <p className="text-gray-500 line-clamp-3 mt-1">{review.content}</p>
        )}

        {/* 유저 정보 */}
        <div className="flex items-center mt-2">
          <img
            src={`${review.userDataResponse.profileImage}`}
            alt={review.userDataResponse.nickname}
            className="w-8 h-8 rounded-full mr-2 object-cover"
          />
          <span className="text-sm font-medium">
            {review.userDataResponse.nickname}
          </span>
        </div>
      </div>

      {/* 오른쪽 이미지 (가로 배치) */}
      {review.imageUrls?.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {review.imageUrls.slice(0, 2).map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`추가 이미지 ${index + 1}`}
              className="w-40 h-40 object-cover rounded" // ✅ 가로 배치 & 크기 조정
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedReviewItem;
