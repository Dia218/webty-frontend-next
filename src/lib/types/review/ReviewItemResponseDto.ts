import { UserDataResponseDto } from '../user/UserDataResponseDto';

export interface ReviewItemResponseDto {
  reviewId: number;
  userDataResponse: UserDataResponseDto; // 사용자 프로필, 닉네임
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
