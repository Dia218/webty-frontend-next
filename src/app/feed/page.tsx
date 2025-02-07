'use client';

import LargeReviewList from '@/components/buisness/review/LargeReviewList';
import NavigationBar from '@/components/common/NavigationBar/NavigationBar';
import useReviews from '@/lib/api/review/review';
import { useEffect } from 'react';

const FeedPage = () => {
  const { reviews, loading, error, fetchReviews } = useReviews();

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <>
      <NavigationBar /> {/* 네비게이션 바 */}
      <LargeReviewList /> {/* ReviewList */}
      {/* VotingList */}
    </>
  );
};

export default FeedPage;
