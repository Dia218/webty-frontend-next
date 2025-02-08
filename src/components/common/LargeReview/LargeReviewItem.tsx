'use client';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { ReviewItemResponseDto } from '@/lib/types/review/ReviewItemResponseDto';
// Props 타입 정의

interface LargeReviewItemProps {
  review: ReviewItemResponseDto; // ReviewDto -> ReviewItemResponseDto로 변경
}

const LargeReviewItem: React.FC<LargeReviewItemProps> = ({ review }) => {

  // const [FeedReviewResponseDto, setFeedReviewResponseDto] =
  //   useState<FeedReviewResponseDto | null>(null);
  const router = useRouter();

  // useEffect(() => {
  //   fetch(`http://localhost:8080/review-detail/${reviewId}`)
  //     .then((res) => res.json())
  //     .then((data) => setFeedReviewResponseDto(data))
  //     .catch((err) =>
  //       console.error('리뷰 데이터를 가져오는 중 오류 발생:', err)
  //     );
  // }, [reviewId]);

  // if (!FeedReviewResponseDto) {
  //   return <div className="text-center p-4">리뷰를 불러오는 중...</div>;
  // }

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
         <div className="flex items-center mb-2 justify-between" >
              {/*  유저 이미지, 이름 */}
             <div className="flex items-center">
               <img  src={review.userDataResponse.profileImage}
                  className=" border border-gray-300 w-[28px] h-[28px] rounded-full object-cover"
                />
               <p className="mx-2 text-[15px] text-gray-500">{ review.userDataResponse.nickname}</p>
            </div>
             {/* 조회수, 댓글 */}
             <div className="flex space-x-2 mx-2">
               <p className="mx-2 text-xs text-gray-500">조회수: {review.viewCount}</p>
               <p className="mx-2 text-xs text-gray-500">댓글: {review.commentCount}</p>
             </div>
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
                 className="border border-gray-300 w-[200px] h-[150px] object-cover"
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
