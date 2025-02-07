import axios from 'axios';
import { ReviewDetailResponse } from '@/lib/types/review/ReviewDetailResponse';

export const fetchReviewDetails = async (
  reviewId: string
): Promise<ReviewDetailResponse> => {
  const response = await axios.get<ReviewDetailResponse>(
    `http://localhost:8080/reviews/${reviewId}`
  );
  return response.data;
};
