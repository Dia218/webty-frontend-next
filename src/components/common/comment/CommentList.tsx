'use client';

import { CommentDTO } from '@/lib/types/comment';
import CommentItem from './CommentItem';

interface CommentListProps {
  comments: CommentDTO[];
  onReply: (content: string, parentId: number) => void;
  onUpdate: (commentId: number, content: string) => void;
  onDelete: (commentId: number) => void;
}

export default function CommentList({ comments, onReply, onUpdate, onDelete }: CommentListProps) {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment.commentId}
          comment={comment}
          onReply={onReply}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
      {comments.length === 0 && (
        <div className="text-center text-gray-500">
          아직 댓글이 없습니다.
        </div>
      )}
    </div>
  );
} 