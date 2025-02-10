'use client';

import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { WebtoonSummaryDto } from '@/lib/types/webtoon/WebtoonSummaryDto';

const ReviewWebtoonBox: React.FC<{ webtoon: WebtoonSummaryDto }> = ({
  webtoon,
}) => {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(`/webtoon-detail/${webtoon.webtoonId}`);
  };

  return (
    <Card
      className="flex flex-col sm:flex-row w-full min-w-[200px] max-w-[450px] mx-auto cursor-pointer rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
      onClick={handleNavigate}
    >
      {/* 썸네일 */}
      <div className="w-full sm:w-1/3 flex-shrink-0">
        <img
          src={webtoon.thumbnailUrl}
          alt={webtoon.webtoonName}
          className="w-full h-full object-cover aspect-[3/4] rounded-t-lg sm:rounded-l-lg"
        />
      </div>

      {/* 웹툰 정보 */}
      <CardContent className="flex flex-1 p-4 flex-col justify-between">
        <div>
          <h2 className="text-base md:text-lg font-semibold truncate">
            {webtoon.webtoonName}
          </h2>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewWebtoonBox;
