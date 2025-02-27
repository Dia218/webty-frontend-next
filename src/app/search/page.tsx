'use client';

import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';
import NavigationBar from '@/components/common/NavigationBar/NavigationBar';
import SearchBar from '@/components/common/SearchBar/SearchBar';
import { Suspense } from 'react';

const WebtoonPage = dynamic(
  () => import('@/components/buisness/search/webtoonSearchResult'),
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
  const router = useRouter();
  const searchQuery = searchParams.get('query') || '';
  const typeParam = searchParams.get('type') || 'all';

  const handleSearch = (query: string, type: string) => {
    router.push(`/search?query=${encodeURIComponent(query)}&type=${type}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 네비게이션 바 */}
      <NavigationBar />

      {/* 검색 영역 */}
      <SearchBar 
        initialQuery={searchQuery} 
        initialType={typeParam} 
        onSearch={handleSearch} 
      />

      <div className="flex flex-1">
        {/* 왼쪽 리뷰 리스트 */}
        <div className="w-2/3 p-4 border-r border-gray-300">
          <ReviewPage searchQuery={searchQuery} searchType={typeParam} />
        </div>

        {/* 오른쪽 웹툰 리스트 */}
        <div className="w-1/3 p-4 overflow-auto">
          <WebtoonPage searchQuery={searchQuery} searchType={typeParam} />
        </div>
      </div>
    </div>
  );
};

// ✅ 최상위 `export default`에 `Suspense` 적용
export default function SearchPageWithSuspense() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPage />
    </Suspense>
  );
}
