import { UserDataResponse } from '@/lib/types/user/UserDataResponse';

export interface CommentResponseDto {
  user: UserDataResponse;
  commentId: number;
  content: string;
  createdAt: string; // LocalDateTime → ISO 8601 문자열
  modifiedAt: string;
  depth: number;
  mentions: string[];
  childComments: CommentResponseDto[];
}
