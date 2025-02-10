import { UserDataResponseDto } from '@/lib/types/user/UserDataResponseDto';
import { CommentResponseDto } from '@/lib/types/reviewComment/CommentResponseDto';
import CommentItem from './CommentItem';
import NestedCommentItem from './NestedCommentItem';

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
  onEdit: (commentId: number, content: string) => void;
  onDelete: (commentId: number) => void;
  onReply: (content: string, parentId: number) => void;
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

  // 댓글을 시간순으로 정렬
  const sortedComments = [...comments].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );

  // 댓글 트리 구조 생성
  const commentTree: CommentResponseDto[] = [];
  const commentMap = new Map<number, CommentResponseDto>();

  // 모든 댓글을 맵에 저장
  sortedComments.forEach(comment => {
    commentMap.set(comment.commentId, { ...comment, childComments: [] });
  });

  // 트리 구조 구성
  sortedComments.forEach(comment => {
    const commentWithChildren = commentMap.get(comment.commentId)!;
    
    if (comment.depth === 0) {
      // 최상위 댓글
      commentTree.push(commentWithChildren);
    } else {
      // 대댓글인 경우, 부모 댓글 찾기
      const parentComment = sortedComments.find(
        potential => potential.depth === 0 && 
        comment.content.includes(`@${potential.user.nickname}`) &&
        new Date(potential.createdAt).getTime() < new Date(comment.createdAt).getTime()
      );

      if (parentComment) {
        const parent = commentMap.get(parentComment.commentId);
        if (parent) {
          parent.childComments = [...parent.childComments, commentWithChildren];
        }
      }
    }
  });

  return (
    <div className="space-y-6">
      {commentTree.map((comment) => (
        <div key={comment.commentId} className="space-y-3">
          <CommentItem
            comment={comment}
            currentUserId={currentUserId}
            onEdit={onEdit}
            onDelete={onDelete}
            onReply={onReply}
            existingUsers={existingUsers}
          />
          {comment.childComments.length > 0 && (
            <div className="ml-12 space-y-3">
              {comment.childComments.map((reply) => (
                <NestedCommentItem
                  key={reply.commentId}
                  comment={reply}
                  currentUserId={currentUserId}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  existingUsers={existingUsers}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentList;
