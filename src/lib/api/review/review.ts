import axios from 'axios';
import { ReviewDetailResponse } from '@/lib/types/review/ReviewDetailResponseDto';

export const createReview = async (
  data: ReviewRequestDto
): Promise<number | null> => {
  const { title, content, webtoonId, spoilerStatus, images } = data;

  // FormData 생성
  const formData = new FormData();
  // JSON 데이터 추가
  const reviewRequest = {
    webtoonId,
    title,
    content,
    spoilerStatus,
  };
  formData.append(
    'reviewRequest',
    new Blob([JSON.stringify(reviewRequest)], { type: 'application/json' })
  );

  // 이미지 파일 추가
  if (images) {
    images.forEach((image) => {
      formData.append('images', image);
    });
  }

  try {
    const response = await fetch('http://localhost:8080/reviews/create', {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    console.log('Response Status', response.status);

    if (!response.ok) {
      console.error('리뷰 작성 실패:', await response.text());
      return null;
    }
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('리뷰 작성 중 오류 발생:', error);
    return null;
  }
};

export const fetchReviewDetails = async (
  reviewId: string
): Promise<ReviewDetailResponse> => {
  const response = await axios.get<ReviewDetailResponse>(
    `http://localhost:8080/reviews/${reviewId}`
  );
  return response.data;
};
