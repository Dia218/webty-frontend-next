'use client';

import { useEffect } from 'react';
import { useSearchLogic } from '@/lib/api/search';
import SearchResultComponent from './SearchResultComponent';

interface SearchByAllCategoriesProps {
  searchQuery: string;
  limit?: number;
  showTitle?: boolean;
  onResultsStatus?: (hasResults: boolean) => void;
}

/**
 * 전체 검색 결과 컴포넌트
 * 웹툰, 사용자, 리뷰 검색 결과를 모두 통합하여 하나의 정렬된 리스트로 표시합니다.
 */
const SearchByAllCategories: React.FC<SearchByAllCategoriesProps> = ({ 
  searchQuery,
  limit,
  showTitle = true,
  onResultsStatus
}) => {
  // 단일 통합 검색 사용 (all 타입으로 검색)
  const {
    items: searchResults,
    isLoading,
    currentPage,
    totalPages,
    sortBy,
    goToNextPage,
    goToPrevPage,
    handleSortChange,
    hasMore,
    loadMore
  } = useSearchLogic(searchQuery, 'all', 'recommend', limit);
  
  // 검색 결과 상태를 부모 컴포넌트에 전달
  useEffect(() => {
    if (onResultsStatus) {
      onResultsStatus(searchResults.length > 0);
    }
  }, [searchResults, onResultsStatus]);

  if (!searchQuery.trim()) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">검색어를 입력해주세요.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* 통합된 검색 결과 */}
      <SearchResultComponent
        title="전체 검색 결과"
        showTitle={showTitle}
        resultType="review"
        reviewItems={searchResults}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        onPrevPage={goToPrevPage}
        onNextPage={goToNextPage}
        hasMore={hasMore}
        loadMore={loadMore}
        emptyMessage={`"${searchQuery}"에 대한 검색 결과가 없습니다.`}
      />
    </div>
  );
};

export default SearchByAllCategories; 