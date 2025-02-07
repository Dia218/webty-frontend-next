import { fetchReviewDetails } from '@/lib/api/review/reviewDetails';
import NavigationBar from '@/components/common/NavigationBar/NavigationBar';

export default async function Page({ params }: { params: { id?: string } }) {
  const { id } = await params;

  if (!id) {
    return <div className="text-center text-red-500">잘못된 요청입니다.</div>;
  }

  try {
    const review = await fetchReviewDetails(id);

    return (
      <>
        <NavigationBar /> {/* 네비게이션 바 추가 */}
        <div> {review.title} </div>
        <div> {review.content} </div>
      </>
    );
  } catch (error) {
    return (
      <div className="text-center text-red-500">
        리뷰 데이터를 불러오는데 실패했습니다.
      </div>
    );
  }
}
