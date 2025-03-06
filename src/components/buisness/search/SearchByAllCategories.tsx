'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchLogic } from '@/lib/api/search/useSearchLogic';
import SearchResultComponent from './SearchResultComponent';

interface SearchByAllCategoriesProps {
  searchQuery: string;
  limit?: number;
  showTitle?: boolean;
}

/**
 * 전체 검색 결과 컴포넌트
 * 웹툰, 사용자, 리뷰 검색 결과를 모두 통합하여 하나의 정렬된 리스트로 표시합니다.
 */
const SearchByAllCategories: React.FC<SearchByAllCategoriesProps> = ({ 
  searchQuery,
  limit,
  showTitle = true
}) => {
  // 단일 통합 검색 사용 (all 타입으로 검색)
  const allSearch = useSearchLogic(searchQuery, 'all', 'recommend', limit);
  
  // 정렬 상태
  const [sortBy, setSortBy] = useState(allSearch.sortBy);
  
  // 정렬 변경 핸들러
  const handleSortChange = useCallback((newSortBy: string) => {
    setSortBy(newSortBy);
    allSearch.handleSortChange(newSortBy);
  }, [allSearch]);

  // 정렬 동기화
  useEffect(() => {
    if (sortBy !== allSearch.sortBy) {
      setSortBy(allSearch.sortBy);
    }
  }, [allSearch.sortBy]);

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
        reviewItems={allSearch.items}
        isLoading={allSearch.isLoading}
        currentPage={allSearch.currentPage}
        totalPages={allSearch.totalPages}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        onPrevPage={allSearch.goToPrevPage}
        onNextPage={allSearch.goToNextPage}
        hasMore={allSearch.hasMore}
        loadMore={allSearch.loadMore}
        emptyMessage="검색 결과가 없습니다. 다른 검색어를 입력해보세요."
      />
    </div>
  );
};

export default SearchByAllCategories; 