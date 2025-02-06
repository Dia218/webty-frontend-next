export interface UserDataResponse {
  userId: number;
  nickname: string;
  profileImageUrl?: string;
  email: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  modifiedAt: string;
} 