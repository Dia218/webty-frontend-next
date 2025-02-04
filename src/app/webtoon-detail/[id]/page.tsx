import { fetchWebtoonById } from '@/lib/api/webtoon/webtoon';
import ClientPage from './ClientPage';

export default async function Page({ params }: { params: { id?: string } }) {
  const { id } = await params; // 비동기적으로 가져오기 전에 구조 분해 할당 (Next.js에서는 `params`가 동기적으로 전달됨)

  if (!id) {
    return <div className="text-center text-red-500">잘못된 요청입니다.</div>;
  }

  try {
    const webtoon = await fetchWebtoonById(id); // ✅ 비동기 API 호출

    return (
      <>
        <ClientPage webtoon={webtoon} />
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
