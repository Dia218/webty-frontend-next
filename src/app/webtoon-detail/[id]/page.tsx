import { fetchWebtoonById, WebtoonDTO } from '@/lib/api/webtoon/webtoon';
import NavigationBar from '@/components/common/NavigationBar/NavigationBar';
import ClientPage from './ClientPage';

interface WebtoonPageProps {
  params: { id: string }; // 동적 라우팅에서 전달되는 [id]
}

const WebtoonPage = async ({ params }: WebtoonPageProps) => {
  // API를 통해 웹툰 데이터를 가져옴
  const { id } = await params;
  const webtoon: WebtoonDTO = await fetchWebtoonById(id);

  return (
    <div className="flex flex-col items-center bg-gray-50 min-h-screen">
      {/* 상단 NavigationBar */}
      <NavigationBar />

      {/* NavigationBar와 콘텐츠 사이 간격 */}
      <div className="h-6"></div>

      {/* ClientPage에 데이터 전달 */}
      <ClientPage webtoon={webtoon} />
    </div>
  );
};

export default WebtoonPage;
