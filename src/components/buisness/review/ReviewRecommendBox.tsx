'use client';

import React from 'react';

interface ReviewRecommendationBoxProps {
  likeButton: React.ReactNode;
  likeCount: number;
  dislikeButton: React.ReactNode;
  hateCount: number;
}

const ReviewRecommendationBox: React.FC<ReviewRecommendationBoxProps> = ({
  likeButton,
  likeCount,
  dislikeButton,
  hateCount,
}) => {
  return (
    <div className="flex items-center space-x-6 mt-4">
      {likeButton}
      <span className="text-lg">{likeCount}</span>
      {dislikeButton}
      <span className="text-lg">{hateCount}</span>
    </div>
  );
};

export default ReviewRecommendationBox;
