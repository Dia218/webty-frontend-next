'use client';

import { useEffect } from 'react';
import { useSearchLogic } from '@/lib/api/search';
import SearchResultComponent from './SearchResultComponent';

interface SearchByWebtoonNameProps {
  searchQuery: string;
  limit?: number;
  showTitle?: boolean;
  onResultsStatus?: (hasResults: boolean) => void;
}

/**
 * 웹툰 이름으로 검색 결과를 표시하는 컴포넌트
 */
const SearchByWebtoonName = ({ searchQuery, limit, showTitle = true, onResultsStatus }: SearchByWebtoonNameProps) => {
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
  } = useSearchLogic(searchQuery, 'webtoon', 'recommend', limit);

  // 검색 결과 상태를 부모 컴포넌트에 전달
  useEffect(() => {
    if (onResultsStatus) {
      onResultsStatus(reviews.length > 0);
    }
  }, [reviews, onResultsStatus]);

  if (!searchQuery) {
    return showTitle ? (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">웹툰의 리뷰 검색 결과</h1>
        <p>검색어를 입력해주세요.</p>
      </div>
    ) : (
      <p>검색어를 입력해주세요.</p>
    );
  }

  return (
    <SearchResultComponent
      title="웹툰의 리뷰 검색 결과"
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
      emptyMessage="해당 웹툰에 대한 리뷰를 찾을 수 없습니다."
    />
  );
};

export default SearchByWebtoonName; 