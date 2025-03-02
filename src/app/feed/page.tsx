'use client';

import FeedReview from '@/components/buisness/review/FeedReview';
import NavigationBar from '@/components/common/NavigationBar/NavigationBar';
import SearchContainer from '@/components/common/Search';
import useReviews from '@/lib/api/review/review';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const FeedPage = () => {
  const { reviews, loading, error, fetchReviews } = useReviews();
  const router = useRouter();

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSearch = (query: string, type: string) => {
    router.push(`/search?query=${encodeURIComponent(query)}&type=${type}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <NavigationBar /> {/* 네비게이션 바 */}
      
      {/* 검색 영역 - 탭 표시 */}
      <SearchContainer 
        onSearch={handleSearch} 
        showTabs={true} 
      />
      
      {/* 피드 컨텐츠 */}
      <div className="flex-1">
        <FeedReview /> {/* ReviewList */}
        {/* VotingList */}
      </div>
    </div>
  );
};

export default FeedPage;