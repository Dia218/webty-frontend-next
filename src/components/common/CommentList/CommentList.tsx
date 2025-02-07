'use client';

import { CommentItems } from './CommentItem';
import { UserDataResponse } from '@/lib/types/user';

interface Comment {
  commentId: number;
  content: string;
  createdAt: string;
  modifiedAt?: string;
  user: UserDataResponse;
  mentionedUsernames: string[];
  childComments?: Comment[];
}

interface CommentListProps {
  comments: Comment[];
  currentUserId: number;
  existingUsers?: UserDataResponse[];
  onEdit: (commentId: number, content: string) => void;
  onDelete: (commentId: number) => void;
  onReply?: (commentId: number, content: string) => void;
}

export function CommentList({
  comments,
  currentUserId,
  existingUsers = [],
  onEdit,
  onDelete,
  onReply
}: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        아직 댓글이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentItems
          key={comment.commentId}
          comment={comment}
          currentUserId={currentUserId}
          existingUsers={existingUsers}
          onEdit={onEdit}
          onDelete={onDelete}
          onReply={onReply}
        />
      ))}
    </div>
  );
}