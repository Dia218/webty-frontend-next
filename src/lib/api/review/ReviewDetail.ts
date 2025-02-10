import { ReviewDetailResponseDto } from '@/lib/types/review/ReviewDetailResponseDto';

export const fetchReviewDetails = async (
  reviewId: string
): Promise<ReviewDetailResponseDto> => {
  try {
    const response = await fetch(`http://localhost:8080/reviews/${reviewId}`);

    if (!response.ok) {
      throw new Error(`Network response was not ok (status: ${response.status})`);
    }

    const data = await response.json();
    return data as ReviewDetailResponseDto;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error; 
  }
};