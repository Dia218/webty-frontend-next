import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface WebtoonDTO {
  webtoonId: string;
  webtoonName: string;
  platform: string;
  webtoonLink: string;
  thumbnailUrl: string;
  authors: string;
  finished: boolean;
}

const ClientPage = ({ webtoon }: { webtoon: WebtoonDTO }) => {
  return (
    <Card className="w-full max-w-6xl p-6">
      <CardContent className="flex items-center gap-10">
        {/* 썸네일 */}
        <div className="flex-shrink-0">
          <img
            src={webtoon.thumbnailUrl}
            alt={`${webtoon.webtoonName} Thumbnail`}
            className="w-[300px] h-[400px] object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* 상세 정보 */}
        <div className="flex flex-col justify-between h-[400px]">
          {/* 제목 */}
          <h1 className="text-4xl font-bold mb-4">{webtoon.webtoonName}</h1>

          {/* 작가 */}
          <p className="text-3xl font-bold mb-4">작가: {webtoon.authors}</p>

          {/* 연재 상태 */}
          <Badge
            variant={webtoon.finished ? 'default' : 'outline'}
            className="inline-flex items-center justify-center text-base px-4 py-2 mb-2"
          >
            {webtoon.finished ? '연재 완료' : '연재 중'}
          </Badge>

          {/* 플랫폼 */}
          <p className="text-3xl font-bold mb-4">플랫폼: {webtoon.platform}</p>

          {/* 웹툰 바로가기 버튼 */}
          <Button asChild className="px-6 py-3 text-base">
            <a
              href={webtoon.webtoonLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              웹툰 바로가기
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ClientPage;
