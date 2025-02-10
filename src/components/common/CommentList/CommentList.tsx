import { UserDataResponseDto } from '@/lib/types/user/UserDataResponseDto';
import { CommentResponseDto } from '@/lib/types/reviewComment/CommentResponseDto';
import { CommentRequestDto } from '@/lib/types/reviewComment/CommentRequestDto';
import CommentItem from './CommentItem';

interface CommentListProps {
  reviewId: number;
  currentUser: {
    id: number;
    nickname: string;
    profileImage: string | null;
  } | null;
  isEnabled: boolean;
  comments: CommentResponseDto[];
  currentUserId: number;
  onEdit: (commentId: number, commentRequestDto: CommentRequestDto) => Promise<void>;
  onDelete: (commentId: number) => Promise<void>;
  onReply: (commentRequestDto: CommentRequestDto) => Promise<void>;
  existingUsers?: UserDataResponseDto[];
  error?: string | null;
  isLoading?: boolean;
}

const CommentList = ({
  reviewId,
  currentUser,
  isEnabled,
  comments,
  currentUserId,
  onEdit,
  onDelete,
  onReply,
  existingUsers = [],
  error,
  isLoading
}: CommentListProps) => {
  if (isLoading) {
    return <div className="text-center text-gray-500">댓글을 불러오는 중...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4 rounded-lg bg-red-50">
        {error}
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return <div className="text-center text-gray-500">아직 댓글이 없습니다.</div>;
  }

  // ✅ 댓글을 부모-자식 트리 구조로 정리
  const commentMap = new Map<number, CommentResponseDto>();
  const rootComments: CommentResponseDto[] = [];

  // 모든 댓글을 맵에 저장하고, `childComments` 초기화
  comments.forEach((comment) => {
    commentMap.set(comment.commentId, { ...comment, childComments: [] });
  });

  // `parentId`를 기반으로 대댓글을 부모 댓글의 `childComments`에 추가
  comments.forEach((comment) => {
    if (!comment.parentId || comment.parentId === 0) {
      // ✅ 루트 댓글
      rootComments.push(commentMap.get(comment.commentId)!);
    } else {
      // ✅ 대댓글 → `parentId`가 있는 경우 부모 댓글의 `childComments`에 추가
      const parentComment = commentMap.get(comment.parentId);
      if (parentComment) {
        parentComment.childComments.push(commentMap.get(comment.commentId)!);
      }
    }
  });

  return (
    <div className="space-y-6">
      {rootComments.map((comment) => (
        <CommentItem
          key={comment.commentId}
          comment={comment}
          currentUserId={currentUserId}
          onEdit={onEdit}
          onDelete={onDelete}
          onReply={onReply}
          existingUsers={existingUsers}
        />
      ))}
    </div>
  );
};

export default CommentList;
