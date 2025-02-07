import { UserDataResponse } from '../user';

// 백엔드 DTO와 일치하는 타입
export interface CommentDTO {
  commentId: number;
  reviewId: number;
  comment: string;
  createdAt: string;
  modifiedAt: string;
  depth: number;
  parentId: number | null;
  childComments: CommentDTO[];
  mentionedUsernames: string[];
  user: UserDataResponse;
}

// 요청 DTO
export interface CommentRequestDTO {
  reviewId: number;
  comment: string;
  parentId: number | null;
  mentionedUsernames: string[];
} 