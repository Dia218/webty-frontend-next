import { UserDataResponseDto } from '@/lib/types/user/UserDataResponseDto';
import { CommentResponseDto } from '@/lib/types/reviewComment/CommentResponseDto';
import { CommentRequestDto } from '@/lib/types/reviewComment/CommentRequestDto';
import CommentItem from './CommentItem';

interface CommentListProps {
  comments: CommentResponseDto[];
  currentUserId: number;
  onEdit: (commentId: number, commentRequestDto: CommentRequestDto) => Promise<CommentResponseDto | null>;
  onDelete: (commentId: number) => Promise<void>;
  onReply: (commentRequestDto: CommentRequestDto) => Promise<CommentResponseDto | null>;
  existingUsers?: UserDataResponseDto[];
  error?: string | null;
  isLoading?: boolean;
}

const CommentList = ({
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

  // ✅ 루트 댓글만 필터링하여 전달 (백엔드가 이미 childComments를 포함하여 응답을 줌)
  const rootComments = comments.filter(comment => !comment.parentId || comment.parentId === 0);

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
