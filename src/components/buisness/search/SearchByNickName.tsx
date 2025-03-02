'use client';

import { useSearchLogic } from '@/lib/api/search/searchLogic';
import SearchResultComponent from './SearchResultComponent';

interface SearchByNickNameProps {
  searchQuery: string;
  limit?: number;
  showTitle?: boolean;
}

const SearchByNickName = ({ searchQuery, limit, showTitle = true }: SearchByNickNameProps) => {
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