'use client';

import { useSearchLogic } from '@/lib/service/search/useSearchLogic';
import SearchResultComponent from './SearchResultComponent';

interface SearchByReviewProps {
  searchQuery: string;
  onResultsStatus?: (hasResults: boolean) => void;
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
    items: searchResults,
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

  // 검색 결과 상태를 부모 컴포넌트에 전달
  useEffect(() => {
    if (onResultsStatus) {
      onResultsStatus(searchResults.length > 0);
    }
  }, [searchResults, onResultsStatus]);

  return (
    <div>
      <SearchResultComponent
        title="리뷰 검색 결과"
        resultType="review"
        reviewItems={searchResults}
        isLoading={isLoading}
        currentPage={currentPage}
        totalPages={totalPages}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        onPrevPage={goToPrevPage}
        onNextPage={goToNextPage}
        emptyMessage={`"${searchQuery}"에 대한 리뷰 검색 결과가 없습니다.`}
        hasMore={hasMore}
        loadMore={loadMore}
      />
    </div>
  );
};

export default SearchByReview;
