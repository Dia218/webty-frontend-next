import React from 'react';
import { ReviewDetailResponseDto } from '@/lib/types/review/ReviewDetailResponseDto';
import useReviews from '@/lib/api/review/review';
import UpdateDeleteButtons from '@/components/common/UpdateDeleteButtons/UpdateDeleteButtons';

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
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* 제목 */}
      <h1 className="text-2xl font-bold mt-4">{review.title}</h1>

      {/* 유저 정보 */}
      <div className="flex items-center mt-2">
        <img
          src={review.userDataResponse.profileImage}
          alt="프로필"
          className="w-10 h-10 rounded-full mr-3"
        />
        <span className="text-gray-700">
          {review.userDataResponse.nickname}
        </span>
      </div>

      {/* 조회수 */}
      <p className="text-sm text-gray-500 mt-1">조회수: {review.viewCount}</p>

      <UpdateDeleteButtons onUpdate={handleUpdate} onDelete={handleDelete} />

      {/* 내용 */}
      <p className="mt-4 text-gray-800">{review.content}</p>

      {/* 이미지 */}
      {review.imageUrls.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          {review.imageUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`추가 이미지 ${index + 1}`}
              className="w-full h-32 object-cover rounded-md"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewDetail;
