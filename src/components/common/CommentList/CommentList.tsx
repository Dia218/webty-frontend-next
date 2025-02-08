import { UserDataResponseDto } from '@/lib/types/user/UserDataResponseDto';
import { CommentResponseDto } from '@/lib/types/reviewComment/CommentResponseDto';
import CommentItem from './CommentItem';

interface CommentListProps {
  comments: CommentResponseDto[];
  currentUserId: number;
  onEdit: (commentId: number, content: string) => void;
  onDelete: (commentId: number) => void;
  onReply: (content: string, parentId: number) => void;
  existingUsers?: UserDataResponseDto[];
}

const CommentList = ({
  comments,
  currentUserId,
  onEdit,
  onDelete,
  onReply,
  existingUsers = []
}: CommentListProps) => {
  if (!comments || comments.length === 0) {
    return <div className="text-center text-gray-500">아직 댓글이 없습니다.</div>;
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
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