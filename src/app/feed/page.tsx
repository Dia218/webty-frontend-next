'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LargeReviewList } from '@/components/common/LargeReview/LargeReviewList';
import { ReviewItemResponseDto } from '@/lib/types/review/ReviewItemResponseDto';
import { PageDto } from '@/lib/types/common/PageDto';
import NavigationBar from '@/components/common/NavigationBar/NavigationBar';
import FeedReviewPage from '@/components/buisness/review/FeedReview';

const FeedPage = () => {
  const [reviews, setReviews] = useState<ReviewItemResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);


  return (
    <>
      <NavigationBar />
      <FeedReviewPage />
    </>
  );
};

export default FeedPage;
