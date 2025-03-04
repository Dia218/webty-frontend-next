'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchLogic } from '@/lib/api/search/searchLogic';
import SearchResultComponent from './SearchResultComponent';
import { ReviewItemResponseDto } from '@/lib/types/review/ReviewItemResponseDto';

interface SearchByAllProps {
  searchQuery: string;
  limit?: number;
  showTitle?: boolean;
}

/**
 * 전체 검색 결과 컴포넌트
 * 웹툰, 사용자, 리뷰 검색 결과를 모두 통합하여 하나의 리스트로 표시합니다.
 * 각 검색 유형(리뷰, 사용자, 웹툰)의 결과를 하나로 통합하여 표시합니다.
 */
const SearchByAll: React.FC<SearchByAllProps> = ({ 
  searchQuery,
  limit,
  showTitle = true
}) => {
  // 리뷰 검색 로직 - 리뷰 제목 및 내용 검색
  const reviewSearch = useSearchLogic(searchQuery, 'review', 'recommend', limit);
  
  // 사용자 검색 로직 - 사용자 닉네임 검색
  const userSearch = useSearchLogic(searchQuery, 'user', 'recommend', limit);
  
  // 웹툰 이름 검색 로직 - 웹툰 이름 검색
  const webtoonSearch = useSearchLogic(searchQuery, 'webtoon', 'recommend', limit);
  
  // 로딩 상태 통합
  const isLoading = reviewSearch.isLoading || userSearch.isLoading || webtoonSearch.isLoading;
  
  // 정렬 상태 공유 (리뷰 검색의 정렬을 기준으로 함)
  const [sortBy, setSortBy] = useState(reviewSearch.sortBy);
  
  // 정렬 변경 시 모든 검색에 적용
  const handleSortChange = useCallback((newSortBy: string) => {
    setSortBy(newSortBy);
    reviewSearch.handleSortChange(newSortBy);
    userSearch.handleSortChange(newSortBy);
    webtoonSearch.handleSortChange(newSortBy);
  }, [reviewSearch, userSearch, webtoonSearch]);

  // 정렬 동기화
  useEffect(() => {
    if (sortBy !== reviewSearch.sortBy) {
      setSortBy(reviewSearch.sortBy);
    }
  }, [reviewSearch.sortBy]);

  // 모든 검색 결과 통합
  const allReviews = useMemo(() => {
    // 검색 결과에 출처 레이블 추가
    const reviewResults = reviewSearch.items.map(item => ({
      ...item,
      searchResultSource: '리뷰'
    }));
    
    const userResults = userSearch.items.map(item => ({
      ...item,
      searchResultSource: '사용자'
    }));
    
    const webtoonResults = webtoonSearch.items.map(item => ({
      ...item,
      searchResultSource: '웹툰'
    }));
    
    // 모든 결과를 합치기
    const combined: (ReviewItemResponseDto & { searchResultSource: string })[] = [
      ...reviewResults, 
      ...userResults, 
      ...webtoonResults
    ];
    
    // 중복 제거 (reviewId 기준)
    const uniqueIds = new Set<number>();
    const uniqueReviews = combined.filter(review => {
      if (uniqueIds.has(review.reviewId)) {
        return false;
      }
      uniqueIds.add(review.reviewId);
      return true;
    });
    
    // 로그로 각 유형별 검색 결과 수 확인
    console.log('검색 결과 통계:', {
      리뷰: reviewResults.length,
      사용자: userResults.length,
      웹툰: webtoonResults.length,
      중복제거후: uniqueReviews.length,
      정렬: sortBy
    });
    
    // 백엔드에서 각 결과는 이미 정렬되어 옴
    // 로컬에서는 단순 통합만 수행하고 정렬은 백엔드에 의존
    return uniqueReviews;
  }, [reviewSearch.items, userSearch.items, webtoonSearch.items, sortBy]);

  // 더 보기 기능을 위한 상태
  const hasMore = reviewSearch.hasMore || userSearch.hasMore || webtoonSearch.hasMore;
  
  // 더 보기 클릭 시 모든 검색에 적용
  const loadMore = useCallback(() => {
    reviewSearch.loadMore();
    userSearch.loadMore();
    webtoonSearch.loadMore();
  }, [reviewSearch, userSearch, webtoonSearch]);

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
        reviewItems={allReviews}
        isLoading={isLoading}
        currentPage={0}
        totalPages={1}
        sortBy={sortBy}
        onSortChange={handleSortChange}
        onPrevPage={() => {}}
        onNextPage={() => {}}
        hasMore={hasMore}
        loadMore={loadMore}
        emptyMessage="검색 결과가 없습니다. 다른 검색어를 입력해보세요."
      />
    </div>
  );
};

export default SearchByAll; 