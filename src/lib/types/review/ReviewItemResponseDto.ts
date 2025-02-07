export interface ReviewItemResponseDto {
    reviewId: number;
    userDataResponse: {
      id: number;
      nickname: string;
      profileImage: string;
    };
    content: string;
    title: string;
    viewCount: number;
    spoilerStatus: 'TRUE' | 'FALSE';
    webtoonId: number;
    webtoonName: string;
    thumbnailUrl: string;
    imageUrls: string[];
    commentCount: number;
  }