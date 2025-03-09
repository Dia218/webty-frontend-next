'use client';

import { useEffect } from 'react';
import { useSearchLogic } from '@/lib/api/search';
import SearchResultComponent from './SearchResultComponent';

interface SearchByNickNameProps {
  searchQuery: string;
  limit?: number;
  showTitle?: boolean;
  onResultsStatus?: (hasResults: boolean) => void;
}

/**
 * 사용자 닉네임으로 검색 결과를 표시하는 컴포넌트
 */
const SearchByNickName = ({ searchQuery, limit, showTitle = true, onResultsStatus }: SearchByNickNameProps) => {
  const {
    items: reviews,
    isLoading,
    currentPage,
    totalPages,
    sortBy,
    goToNextPage,
    goToPrevPage,
    handleSortChange,
    hasMore,
    loadMore
  } = useSearchLogic(searchQuery, 'user', 'recommend', limit);

  // 검색 결과 상태를 부모 컴포넌트에 전달
  useEffect(() => {
    if (onResultsStatus) {
      onResultsStatus(reviews.length > 0);
    }
  }, [reviews, onResultsStatus]);

  if (!searchQuery) {
    return showTitle ? (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">사용자의 리뷰 검색 결과</h1>
        <p>검색어를 입력해주세요.</p>
      </div>
    ) : (
      <p>검색어를 입력해주세요.</p>
    );
  }

  return (
    <SearchResultComponent
      title="사용자의 리뷰 검색 결과"
      showTitle={showTitle}
      resultType="review"
      reviewItems={reviews}
      isLoading={isLoading}
      currentPage={currentPage}
      totalPages={totalPages}
      sortBy={sortBy}
      onSortChange={handleSortChange}
      onPrevPage={goToPrevPage}
      onNextPage={goToNextPage}
      hasMore={hasMore}
      loadMore={loadMore}
      emptyMessage="해당 사용자의 리뷰를 찾을 수 없습니다."
    />
  );
};

export default SearchByNickName; 