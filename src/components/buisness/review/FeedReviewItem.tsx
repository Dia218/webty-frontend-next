import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';

interface FeedReview {
    reviewId: number;
    name: string;
    content : string;
    author : string;
  }
  const FeedReviewItem: React.FC = () => {
    return (
      <Card className="flex mx-4 cursor-pointer border border-gray-300 shadow-md rounded-lg bg-white p-4">
        {/* 왼쪽 텍스트 정보 */}
        <div className="flex flex-col flex-1 justify-between pr-4">
          {/* 웹툰 이름 */}
          <span className="text-xs text-gray-500">웹툰 이름</span>
          
          {/* 제목 */}
          <h2 className="text-lg font-semibold text-gray-800">리뷰 제목</h2>
          
          {/* 리뷰 내용 */}
          <p className="text-sm text-gray-600 line-clamp-1">
            리뷰 내용이 여기에 들어갑니다. 최대 한 줄까지만 표시됩니다.
            zxfaf agfdfa리뷰 내용이 여기에 들어갑니다. 최대 한 줄까지만 표시됩니다.리뷰 내용이 여기에 들어갑니다. 
          </p>
          
          {/* 작성자 */}
          <p className="text-xs text-gray-500">홍길동</p>
          

          {/* 이미지들 */}
          <div className="flex flex-row space-x-2 mt-4">
            <img src="path/to/image1.jpg" alt="Content Image 1" className="border border-gray-300" />
            <img src="path/to/image2.jpg" alt="Content Image 2" className="border border-gray-300" />
           </div>
        </div>
        {/* 오른쪽 이미지 영역 */}
        <div className="flex flex-row m-0  border border-gray-300">
          <img
           src="path/to/image3.jpg"
           alt="webtoon Image 1"
            className="w-[150px] h-[calc(100%-16px)] object-cover rounded-t-lg sm:rounded-l-lg"
          />
        </div>

      </Card>
    );
  };
  
  
  export default FeedReviewItem;
  