import WebtoonItem from '@/components/buisness/webtoon/WebtoonItem';

interface Webtoon {
  webtoonId: number;
  webtoonName: string;
  webtoonLink: string;
  thumbnailUrl: string;
  authors: string;
  finished: boolean;
}

const WebtoonList: React.FC<{ webtoons: Webtoon[] }> = ({ webtoons }) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {webtoons.map((webtoon) => (
        <WebtoonItem key={webtoon.webtoonId} webtoon={webtoon} />
      ))}
    </div>
  );
};

export default WebtoonList;
