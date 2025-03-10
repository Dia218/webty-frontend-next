'use client';

import dynamic from 'next/dynamic';
import { useSearchParams, useRouter } from 'next/navigation';
import { memo, useCallback, useState } from 'react';
import NavigationBar from '@/components/common/NavigationBar/NavigationBar';
import SearchContainer from '@/components/common/Search';

// 동적 임포트
const ReviewsSearch = dynamic(
  () => import('@/components/buisness/search/SearchByReview'),
  { ssr: false }
);
const WebtoonsSearch = dynamic(
  () => import('@/components/buisness/search/SearchByWebtoonName'),
  { ssr: false }
);
const UsersSearch = dynamic(
  () => import('@/components/buisness/search/SearchByNickName'),
  { ssr: false }
);
const ResultOfWebtoonsSearch = dynamic(
  () => import('@/components/buisness/search/ResultOfWebtoonsSearch'),
  { ssr: false }
);
const AllSearchResults = dynamic(
  () => import('@/components/buisness/search/SearchByAllCategories'),
  { ssr: false }
);

// 메모이제이션 처리
const MemoizedReviewsSearch = memo(ReviewsSearch);
const MemoizedWebtoonsSearch = memo(WebtoonsSearch);
const MemoizedUsersSearch = memo(UsersSearch);
const MemoizedResultOfWebtoonsSearch = memo(ResultOfWebtoonsSearch);
const MemoizedAllSearchResults = memo(AllSearchResults);

export default function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get('query') || '';
  const typeParam = searchParams.get('type') || 'all';
  const [activeTab, setActiveTab] = useState(typeParam);

  const sortParam = searchParams.get('sort') || 'recommend';
  const [activeSort, setActiveSort] = useState(sortParam);

  const handleSearch = useCallback(
    (query: string, type: string) => {
      if (query.trim()) {
        router.push(
          `/search?query=${encodeURIComponent(query)}&type=${type}&sort=${activeSort}`
        );
      }
    },
    [router, activeSort]
  );

  const handleTabChange = useCallback(
    (tab: string) => {
      setActiveTab(tab);
      if (searchQuery.trim()) {
        router.push(
          `/search?query=${encodeURIComponent(searchQuery)}&type=${tab}&sort=${activeSort}`
        );
      }
    },
    [searchQuery, router, activeSort]
  );

  const handleSortChange = useCallback(
    (sort: string) => {
      setActiveSort(sort);
      if (searchQuery.trim()) {
        router.push(
          `/search?query=${encodeURIComponent(searchQuery)}&type=${activeTab}&sort=${sort}`
        );
      }
    },
    [searchQuery, activeTab, router]
  );

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

  const renderSearchResults = () => {
    switch (activeTab) {
      case 'all':
        return (
          <div className="w-full">
            <h2 className="text-xl font-bold mb-4">검색 결과</h2>
            <MemoizedAllSearchResults
              key={`all-search-${searchQuery}-${activeSort}`}
              searchQuery={searchQuery}
              showTitle={false}
            />
          </div>
        );
      case 'webtoon':
        return (
          <div className="w-full">
            <h2 className="text-xl font-bold mb-4">웹툰 관련 리뷰</h2>
            <MemoizedWebtoonsSearch
              key={`webtoon-review-${searchQuery}-${activeSort}`}
              searchQuery={searchQuery}
              showTitle={false}
            />
          </div>
        );
      case 'review':
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
        return (
          <div className="w-full">
            <h2 className="text-xl font-bold mb-4">검색 결과</h2>
            <MemoizedAllSearchResults
              key={`all-search-${searchQuery}-${activeSort}`}
              searchQuery={searchQuery}
              showTitle={false}
            />
          </div>
        );
    }
  };

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
      <div className="max-w-6xl mx-auto py-4 flex-1 w-full">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-2/3">{renderSearchResults()}</div>
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
    </div>
  );
}
