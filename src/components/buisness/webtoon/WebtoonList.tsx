import WebtoonItem from '@/components/buisness/webtoon/WebtoonItem';
import { WebtoonDetailDto } from '@/lib/types/webtoon/WebtoonDetailDto';

const WebtoonList: React.FC<{ webtoons: WebtoonDetailDto[] }> = ({
  webtoons,
}) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {webtoons.map((webtoon) => (
        <WebtoonItem key={webtoon.webtoonId} webtoon={webtoon} />
      ))}
    </div>
  );
};

export default WebtoonList;
