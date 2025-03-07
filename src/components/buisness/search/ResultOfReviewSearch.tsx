'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SearchByWebtoonName from './SearchByWebtoonName';
import SearchByNickName from './SearchByNickName';
import SearchByReview from './SearchByReview';

interface ResultOfReviewSearchProps {
  searchQuery: string;
}

/**
 * 카테고리별 검색 결과를 탭으로 보여주는 컴포넌트
 */
const ResultOfReviewSearch = ({ searchQuery }: ResultOfReviewSearchProps) => {
  const [activeTab, setActiveTab] = useState('all');

  if (!searchQuery) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">검색 결과</h1>
        <p>검색어를 입력해주세요.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">'{searchQuery}' 검색 결과</h1>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="webtoons">웹툰</TabsTrigger>
          <TabsTrigger value="users">사용자</TabsTrigger>
          <TabsTrigger value="reviews">리뷰</TabsTrigger>
        </TabsList>

        {activeTab === 'all' ? (
          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">웹툰 결과</h2>
              </div>
              <SearchByWebtoonName searchQuery={searchQuery} limit={3} showTitle={false} />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">사용자 결과</h2>
              </div>
              <SearchByNickName searchQuery={searchQuery} limit={3} showTitle={false} />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">리뷰 결과</h2>
              </div>
              <SearchByReview searchQuery={searchQuery} limit={3} showTitle={false} />
            </div>
          </div>
        ) : activeTab === 'webtoons' ? (
          <SearchByWebtoonName searchQuery={searchQuery} showTitle={false} />
        ) : activeTab === 'users' ? (
          <SearchByNickName searchQuery={searchQuery} showTitle={false} />
        ) : (
          <SearchByReview searchQuery={searchQuery} showTitle={false} />
        )}
      </Tabs>
    </div>
  );
};

export default ResultOfReviewSearch; 