import { CommentDTO } from '../dto/comment';

// 프론트엔드 내부 사용 타입
export interface CommentUI extends CommentDTO {
  isEditing?: boolean;
  isReplying?: boolean;
} 