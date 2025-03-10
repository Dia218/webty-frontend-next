'use client';

import { useSearchLogic } from '@/lib/service/useSearchLogic';
import SearchResultComponent from './SearchResultComponent';

interface SearchByReviewProps {
  searchQuery: string;
  limit?: number;
  showTitle?: boolean;
  searchType?: string;
}

/**
 * 리뷰 내용으로 검색 결과를 표시하는 컴포넌트
 */
const SearchByReview = ({
  searchQuery,
  limit,
  showTitle = true,
  searchType = 'review',
}: SearchByReviewProps) => {
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
    loadMore,
  } = useSearchLogic(searchQuery, searchType, 'recommend', limit);

  if (!searchQuery) {
    return showTitle ? (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">리뷰 검색 결과</h1>
        <p>검색어를 입력해주세요.</p>
      </div>
    ) : (
      <p>검색어를 입력해주세요.</p>
    );
  }

  return (
    <SearchResultComponent
      title="리뷰 검색 결과"
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
      emptyMessage="검색 결과가 없습니다. 다른 검색어를 입력해보세요."
    />
  );
};

export default SearchByReview;
