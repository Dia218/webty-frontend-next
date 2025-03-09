'use client';

import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, memo, useCallback, useState, useEffect } from 'react';
import NavigationBar from '@/components/common/NavigationBar/NavigationBar';
import SearchContainer from '@/components/common/Search';
import PopularSearchTerms from '@/components/common/Search/PopularSearchTerms';
import SearchResults from '@/components/buisness/search/SearchByAllCategories';
import SearchByWebtoonName from '@/components/buisness/search/SearchByWebtoonName';
import SearchByNickName from '@/components/buisness/search/SearchByNickName';
import SearchByReview from '@/components/buisness/search/SearchByReview';

// 동적 임포트 최적화
const ReviewsSearch = dynamic(
  () => import('@/components/buisness/search/SearchByReview'),
  {
    ssr: false,
  }
);

const WebtoonsSearch = dynamic(
  () => import('@/components/buisness/search/SearchByWebtoonName'),
  {
    ssr: false,
  }
);

const UsersSearch = dynamic(
  () => import('@/components/buisness/search/SearchByNickName'),
  {
    ssr: false,
  }
);

// 웹툰 검색을 위한 ResultOfWebtoonsSearch
const ResultOfWebtoonsSearch = dynamic(
  () => import('@/components/buisness/search/ResultOfWebtoonsSearch'),
  {
    ssr: false,
  }
);

// 모든 검색 결과를 위한 AllSearchResults
const AllSearchResults = dynamic(
  () => import('@/components/buisness/search/SearchByAllCategories'),
  {
    ssr: false,
  }
);

// 메모이제이션된 검색 결과 컴포넌트들
const MemoizedReviewsSearch = memo(ReviewsSearch);
const MemoizedWebtoonsSearch = memo(WebtoonsSearch);
const MemoizedUsersSearch = memo(UsersSearch);
const MemoizedResultOfWebtoonsSearch = memo(ResultOfWebtoonsSearch);
const MemoizedAllSearchResults = memo(AllSearchResults);

/**
 * 검색 페이지 컴포넌트
 */
export const SearchPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryParam = searchParams.get('query') || '';
  const typeParam = searchParams.get('type') || 'all';
  const sortParam = searchParams.get('sort') || 'recommend';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [searchType, setSearchType] = useState(typeParam);
  const [sortBy, setSortBy] = useState(sortParam);
  const [hasResults, setHasResults] = useState(false);

  useEffect(() => {
    setSearchQuery(queryParam);
    setSearchType(typeParam);
    setSortBy(sortParam);
  }, [queryParam, typeParam, sortParam]);

  // 검색 결과가 있는지 여부를 업데이트하는 콜백 함수
  const handleResultsStatus = (hasAnyResults: boolean) => {
    setHasResults(hasAnyResults);
  };

  // 검색 시 실행할 핸들러
  const handleSearch = (query: string, type: string) => {
    setSearchQuery(query);
    setSearchType(type);
  };
  
  // 인기 검색어 클릭 시 실행할 핸들러
  const handlePopularTermClick = (term: string) => {
    setSearchQuery(term);
    setSearchType('all');
  };

  // 탭 변경 시 정렬 상태 유지
  const handleTabChange = useCallback((tab: string) => {
    setSearchType(tab);
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}&type=${tab}&sort=${sortBy}`);
    }
  }, [searchQuery, router, sortBy]);
  
  // 정렬 변경 핸들러
  const handleSortChange = useCallback((sort: string) => {
    setSortBy(sort);
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}&type=${searchType}&sort=${sort}`);
    }
  }, [searchQuery, searchType, router]);

  const renderSearchResults = () => {
    if (!searchQuery) {
      return (
        <div className="text-center p-8">
          <h2 className="text-xl font-bold mb-4">검색어를 입력해주세요</h2>
          <PopularSearchTerms onTermClick={handlePopularTermClick} className="max-w-2xl mx-auto" />
        </div>
      );
    }

    switch (searchType) {
      case 'webtoon':
        return <SearchByWebtoonName searchQuery={searchQuery} onResultsStatus={handleResultsStatus} />;
      case 'user':
        return <SearchByNickName searchQuery={searchQuery} onResultsStatus={handleResultsStatus} />;
      case 'review':
        return <SearchByReview searchQuery={searchQuery} onResultsStatus={handleResultsStatus} />;
      case 'all':
      default:
        return <SearchResults searchQuery={searchQuery} onResultsStatus={handleResultsStatus} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 네비게이션 바 */}
      <NavigationBar />

      {/* 검색 영역 */}
      <SearchContainer
        initialQuery={searchQuery}
        initialType={searchType}
        onSearch={handleSearch}
        onTabChange={handleTabChange}
        showTabs={true}
      />

      {/* 검색 결과 - 항상 동일한 레이아웃 사용 */}
      <div className="max-w-6xl mx-auto py-4 flex-1 w-full">
        <div className="flex flex-col md:flex-row gap-6">
          {/* 왼쪽 섹션: 검색 탭에 맞는 리뷰 결과 */}
          <div className="w-full md:w-2/3">
            {renderSearchResults()}
          </div>

          {/* 오른쪽 섹션: 항상 웹툰 검색 결과 */}
          <div className="w-full md:w-1/3">
            <div className="w-full">
              <h2 className="text-xl font-bold mb-4">웹툰 검색 결과</h2>
              <MemoizedResultOfWebtoonsSearch 
                key={`webtoon-${searchQuery}`}
                searchQuery={searchQuery}
                searchType="webtoonName"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 검색 결과가 없을 때 인기 검색어 표시 */}
      {searchQuery && !hasResults && (
        <div className="mt-8 text-center">
          <h3 className="text-lg font-medium mb-2">"{searchQuery}"에 대한 검색 결과가 없습니다.</h3>
          <p className="text-gray-500 mb-6">다른 검색어로 시도해보세요.</p>
          <PopularSearchTerms onTermClick={handlePopularTermClick} className="max-w-2xl mx-auto" />
        </div>
      )}
    </div>
  );
};


// 최상위 `export default`에 `Suspense` 적용
export default function SearchPageWithSuspense() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">검색 결과를 불러오는 중...</div>}>
      <SearchPage />
    </Suspense>
  );
}