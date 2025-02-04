import { Card, CardContent } from '@/components/ui/card';

interface Webtoon {
  webtoonId: number;
  webtoonName: string;
  webtoonLink: string;
  thumbnailUrl: string;
  authors: string;
  finished: boolean;
}

const WebtoonItem: React.FC<{ webtoon: Webtoon }> = ({ webtoon }) => {
  return (
    <Card className="flex mx-4">
      <CardContent className="flex-1 p-4 h-40 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-semibold">{webtoon.webtoonName}</h2>
          <p className="text-sm text-gray-500 line-clamp-2">
            {webtoon.authors}
          </p>
          <p className="text-sm text-gray-500">
            {webtoon.finished ? '완결' : '진행 중'}
          </p>
        </div>
        <a
          href={webtoon.webtoonLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 text-sm mt-2 inline-block"
        >
          웹툰 보기
        </a>
      </CardContent>
      <div className="flex-shrink-0 mr-4 h-40 my-2">
        <a href={webtoon.webtoonLink} target="_blank" rel="noopener noreferrer">
          <img
            src={webtoon.thumbnailUrl}
            alt={webtoon.webtoonName}
            className="w-32 h-full object-cover rounded-lg"
          />
        </a>
      </div>
    </Card>
  );
};

export default WebtoonItem;
