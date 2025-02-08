'use client';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { ReviewItemResponseDto } from '@/lib/types/review/ReviewItemResponseDto';

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
      className="flex mx-2 cursor-pointer border border-gray-300 rounded-lg bg-white p-5"
      onClick={handleNavigate}
    >
      <div className="flex flex-col flex-1 justify-between ">
        <div className="flex items-center mb-2" >
           <img  src={review.userDataResponse.profileImage}
                className=" border border-gray-300 w-[28px] h-[28px] rounded-full object-cover"
             />
           <span className="mx-2 text-xs text-gray-500">{ review.userDataResponse.nickname}</span>
        </div>
        <h2 className="text-lg font-semibold text-gray-800 mb-1 ">{review.title}</h2>
        <p className="text-sm text-gray-600 line-clamp-1 ">{review.content}</p>
        

        <div className="flex flex-row space-x-2 mt-2">
           {/* 이미지가 있으면 이미지들을 표시 */}
           {review.imageUrls && review.imageUrls.length > 0 ? (
             review.imageUrls.map((url, index) => (
               <img
                 key={index}
                 src={url}
                 alt={`리뷰 이미지 ${index + 1}`}
                 className="border border-gray-300 w-[120px] h-[120px] object-cover"
                />
              ))
            ) : (
             <span className="text-xs text-gray-500">이미지가 없습니다.</span>
            )}
        </div>
        <div>
        
       </div>
      </div>

       

       <div className="flex flex-row m-0">
         <img
           src={review.thumbnailUrl}
           alt="웹툰 썸네일"
           className="w-[150px] h-[calc(100%-16px)] object-cover "
          />
      </div>
    </Card>
  );
};

export default LargeReviewItem;
