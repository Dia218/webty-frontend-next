import { useState } from 'react';
import useReviews from '@/lib/api/review/review';

const SpoilerButton = ({ reviewId }: { reviewId: number }) => {
  const { spoilerReview } = useReviews();
  const [loading, setLoading] = useState(false);

  const handleSpoiler = async () => {
    setLoading(true);
    await spoilerReview(reviewId);
    setLoading(false);
  };

  return (
    <button
      onClick={handleSpoiler}
      disabled={loading}
      className={`flex items-center space-x-2 bg-red-500 text-white px-2 py-1 rounded-md 
        transition duration-200 hover:bg-red-600 disabled:bg-gray-400 disabled:cursor-not-allowed`}
    >
      <span className="text-lg">🚨</span>
      <span>{loading ? '신고 중...' : '스포일러 신고'}</span>
    </button>
  );
};

export default SpoilerButton;
