import { fetchWebtoonById } from '@/lib/api/webtoon/webtoon';
import WebtoonDetail from '@/components/buisness/webtoonDetail/WebtoonInfo';
import NavigationBar from '@/components/common/NavigationBar/NavigationBar';

export default async function Page({ params }: { params: { id?: string } }) {
  const { id } = await params;

  if (!id) {
    return <div className="text-center text-red-500">잘못된 요청입니다.</div>;
  }

  try {
    const webtoon = await fetchWebtoonById(id);

    return (
      <>
        <NavigationBar /> {/* 네비게이션 바 추가 */}
        <WebtoonDetail webtoon={webtoon} />
      </>
    );
  } catch (error) {
    return (
      <div className="text-center text-red-500">
        웹툰 데이터를 불러오는데 실패했습니다.
      </div>
    );
  }
}
