'use client';

import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, memo, useCallback, useState } from 'react';
import NavigationBar from '@/components/common/NavigationBar/NavigationBar';
import SearchContainer from '@/components/common/Search';

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

// 웹툰 검색을 위한 WebtoonSearchResult
const WebtoonSearchResult = dynamic(
  () => import('@/components/buisness/search/WebtoonSearchResult'),
  {
    ssr: false,
  }
);

// 모든 검색 결과를 위한 AllSearchResults
const AllSearchResults = dynamic(
  () => import('@/components/buisness/search/SearchByAll'),
  {
    ssr: false,
  }
);

// 메모이제이션된 검색 결과 컴포넌트들
const MemoizedReviewsSearch = memo(ReviewsSearch);
const MemoizedWebtoonsSearch = memo(WebtoonsSearch);
const MemoizedUsersSearch = memo(UsersSearch);
const MemoizedWebtoonSearchResult = memo(WebtoonSearchResult);
const MemoizedAllSearchResults = memo(AllSearchResults);

const SearchPage: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get('query') || '';
  const typeParam = searchParams.get('type') || 'all';
  const [activeTab, setActiveTab] = useState(typeParam);

  // useCallback으로 핸들러 함수 메모이제이션
  const handleSearch = useCallback((query: string, type: string) => {
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query)}&type=${type}`);
    }
  }, [router]);

  // 탭 변경 핸들러
  const handleTabChange = useCallback((tab: string) => {
    setActiveTab(tab);
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}&type=${tab}`);
    }
  }, [searchQuery, router]);

  // 검색 결과가 없을 때 표시할 컴포넌트
  if (!searchQuery.trim()) {
    return (
      <div className="flex flex-col min-h-screen">
        <NavigationBar />
        <SearchContainer
          initialQuery={searchQuery}
          initialType={activeTab}
          onSearch={handleSearch}
          onTabChange={handleTabChange}
          showTabs={true}
        />
        <div className="max-w-6xl mx-auto py-4 flex-1 w-full flex items-center justify-center">
          <p className="text-gray-500">검색어를 입력해주세요.</p>
        </div>
      </div>
    );
  }

  // 활성화된 탭에 따라 적절한 검색 컴포넌트 선택
  const renderSearchResults = () => {
    switch (activeTab) {
      case 'all':
        // 전체 검색 - AllSearchResults 컴포넌트 사용
        return (
          <div className="w-full">
            <h2 className="text-xl font-bold mb-4">전체 검색 결과</h2>
            <MemoizedAllSearchResults 
              key={`all-search-${searchQuery}`}
              searchQuery={searchQuery}
              showTitle={false}
            />
          </div>
        );
      case 'webtoon':
        // 웹툰 검색 - 웹툰 이름으로 검색한 리뷰 결과
        return (
          <div className="w-full">
            <h2 className="text-xl font-bold mb-4">웹툰 관련 리뷰</h2>
            <MemoizedWebtoonsSearch 
              key={`webtoon-review-${searchQuery}`}
              searchQuery={searchQuery}
              showTitle={false}
            />
          </div>
        );
      case 'review':
        // 리뷰 검색 - 리뷰 제목 및 내용으로 검색한 결과
        return (
          <div className="w-full">
            <h2 className="text-xl font-bold mb-4">리뷰 검색 결과</h2>
            <MemoizedReviewsSearch 
              key={`review-only-${searchQuery}`}
              searchQuery={searchQuery}
              showTitle={false}
            />
          </div>
        );
      case 'user':
        // 사용자 검색 - 사용자 닉네임으로 검색한 리뷰 결과
        return (
          <div className="w-full">
            <h2 className="text-xl font-bold mb-4">사용자 작성 리뷰</h2>
            <MemoizedUsersSearch 
              key={`user-review-${searchQuery}`}
              searchQuery={searchQuery}
              showTitle={false}
            />
          </div>
        );
      default:
        // 기본값은 전체 검색과 동일
        return (
          <div className="w-full">
            <h2 className="text-xl font-bold mb-4">리뷰 검색 결과</h2>
            <MemoizedReviewsSearch 
              key={`default-review-${searchQuery}`}
              searchQuery={searchQuery}
              showTitle={false}
              searchType="all"
            />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* 네비게이션 바 */}
      <NavigationBar />

      {/* 검색 영역 */}
      <SearchContainer
        initialQuery={searchQuery}
        initialType={activeTab}
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
              <MemoizedWebtoonSearchResult 
                key={`webtoon-${searchQuery}`}
                searchQuery={searchQuery}
                searchType="webtoonName"
              />
            </div>
          </div>
        </div>
      </div>
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