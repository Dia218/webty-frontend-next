import WebtoonDetail from '@/components/buisness/WebtoonDetail/WebtoonInfo';

interface WebtoonDTO {
  webtoonId: string;
  webtoonName: string;
  platform: string;
  webtoonLink: string;
  thumbnailUrl: string;
  authors: string;
  finished: boolean;
}

export default function ClientPage({ webtoon }: { webtoon: WebtoonDTO }) {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold text-center my-4">웹툰 상세 정보</h1>
      <WebtoonDetail webtoon={webtoon} />
    </div>
  );
}
