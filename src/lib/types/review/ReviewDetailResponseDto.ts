export interface ReviewDetailResponseDto {
  reviewId: number;
  userDataResponse: {
    id: number;
    nickname: string;
    profileImage: string;
  };
  webtoonId: number;
  webtoonName: string;
  content: string;
  title: string;
  viewCount: number;
  spoilerStatus: 'TRUE' | 'FALSE';
  thumbnailUrl: string;
  imageUrls: string[];
  commentResponses: {
    content: any[];
    currentPage: number;
    totalPages: number;
    totalElements: number;
    hasNext: boolean;
    hasPrevious: boolean;
    last: boolean;
  };
  createdAt: string;
  updatedAt: string | null;
  recommendCount: {
    hates: number;
    likes: number;
  };
}
