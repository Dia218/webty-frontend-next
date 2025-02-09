'use client';

import NavigationBar from '@/components/common/NavigationBar/NavigationBar';
import ReviewUpdate from '@/components/buisness/review/UpdateReview';
import { useSearchParams } from 'next/navigation';

const ReviewUpdatePage = () => {
  const searchParams = useSearchParams();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <NavigationBar />
      <ReviewUpdate />
    </main>
  );
};

export default ReviewUpdatePage;
