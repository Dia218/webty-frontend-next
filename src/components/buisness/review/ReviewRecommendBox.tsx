'use client';

import React from 'react';

interface ReviewRecommendationBoxProps {
  likeButton: React.ReactNode;
  dislikeButton: React.ReactNode;
}

const ReviewRecommendationBox: React.FC<ReviewRecommendationBoxProps> = ({
  likeButton,
  dislikeButton,
}) => {
  return (
    <div className="flex space-x-4 mt-4">
      {likeButton}
      {dislikeButton}
    </div>
  );
};

export default ReviewRecommendationBox;
