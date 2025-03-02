'use client';

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WebtoonsSearch from './SearchByWebtoonName';
import UsersSearch from './SearchByNickName';
import ReviewsSearch from './SearchByReview';

interface AllSearchProps {
  searchQuery: string;
}

const AllSearch = ({ searchQuery }: AllSearchProps) => {
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
              <WebtoonsSearch searchQuery={searchQuery} limit={3} showTitle={false} />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">사용자 결과</h2>
              </div>
              <UsersSearch searchQuery={searchQuery} limit={3} showTitle={false} />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">리뷰 결과</h2>
              </div>
              <ReviewsSearch searchQuery={searchQuery} limit={3} showTitle={false} />
            </div>
          </div>
        ) : activeTab === 'webtoons' ? (
          <WebtoonsSearch searchQuery={searchQuery} showTitle={false} />
        ) : activeTab === 'users' ? (
          <UsersSearch searchQuery={searchQuery} showTitle={false} />
        ) : (
          <ReviewsSearch searchQuery={searchQuery} showTitle={false} />
        )}
      </Tabs>
    </div>
  );
};

export default AllSearch; 