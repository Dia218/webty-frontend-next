export interface Review {
    reviewId: number;
    title: string;
    content: string;
    userDataResponse: {
      nickname: string;
      profileImage: string;
    };
    thumbnailUrl: string;
    imageUrls: string[];
  }