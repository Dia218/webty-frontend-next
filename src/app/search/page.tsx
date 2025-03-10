import { Suspense } from 'react';
import SearchContent from '@/components/buisness/search/SearchContent';

export default function SearchPageW() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          검색 결과를 불러오는 중...
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
