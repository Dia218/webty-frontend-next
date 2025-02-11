'use client';

import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import NavigationBar from '@/components/common/NavigationBar/NavigationBar';

const WebtoonPage = dynamic(
  () => import('@/components/buisness/search/WebtoonSearchResult'),
  {
    ssr: false,
  }
);

const ReviewPage = dynamic(
  () => import('@/components/buisness/search/ReviewSearchResult'),
  {
    ssr: false,
  }
);

const SearchPage: React.FC = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('query') || ''; // URL에서 검색어 가져오기

  return (
    <div className="flex flex-col h-screen">
      {/* 네비게이션 바 */}
      <NavigationBar />

      <div className="flex flex-1">
        {/* 왼쪽 리뷰 리스트 */}
        <div className="w-2/3 p-4 border-r border-gray-300">
          <ReviewPage searchQuery={searchQuery} />
        </div>

        {/* 오른쪽 웹툰 리스트 */}
        <div className="w-1/3 p-4 overflow-auto">
          <WebtoonPage searchQuery={searchQuery} />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
