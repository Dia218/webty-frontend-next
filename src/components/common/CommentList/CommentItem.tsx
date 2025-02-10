'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import CommentArea from './CommentArea';
import { CommentRequestDto } from '@/lib/types/reviewComment/CommentRequestDto';
import { CommentResponseDto } from '@/lib/types/reviewComment/CommentResponseDto';
import { UserDataResponseDto } from '@/lib/types/user/UserDataResponseDto';
import { CommentContainer } from '@/components/ui/comment-container';
import { CommentHeader } from '@/components/ui/comment-header';
import { CommentContent } from '@/components/ui/comment-content';

interface CommentItemProps {
  comment: CommentResponseDto;
  currentUserId: number;
  existingUsers?: UserDataResponseDto[];
  onEdit: (commentId: number, commentRequestDto: CommentRequestDto) => Promise<void>;
  onDelete: (commentId: number) => Promise<void>;
  onReply?: (commentRequestDto: CommentRequestDto) => Promise<void>;
}

const CommentItem = ({
  comment,
  currentUserId,
  existingUsers = [],
  onEdit,
  onDelete,
  onReply
}: CommentItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);

  // 수정된 댓글 저장
  const handleEdit = async (commentRequestDto: CommentRequestDto) => {
    if (!commentRequestDto.content.trim()) return;

    await onEdit(comment.commentId, commentRequestDto);
    setIsEditing(false);
  };

  // 답글 작성
  const handleReply = async (commentRequestDto: CommentRequestDto) => {
    if (!onReply) return;

    await onReply(commentRequestDto);
    setIsReplying(false);
  };

  return (
    <div className={`space-y-4 ${comment.parentId ? 'ml-6 border-l-2 pl-4' : ''}`}>
      <CommentContainer>
        <div className="flex flex-col">
          <CommentHeader author={comment.user.nickname} timestamp={new Date(comment.createdAt)} />

          {isEditing ? (
            <CommentArea
              onSubmit={handleEdit}
              onCancel={() => setIsEditing(false)}
              initialContent={editedContent}
              existingUsers={existingUsers}
            />
          ) : (
            <>
              <CommentContent>{comment.content}</CommentContent>
              <div className="flex space-x-2 mt-2">
                {onReply && (
                  <Button variant="ghost" size="sm" onClick={() => setIsReplying(!isReplying)}>
                    답글
                  </Button>
                )}
                {currentUserId === comment.user.id && (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                      수정
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(comment.commentId)}
                      className="text-red-500 hover:text-red-600"
                    >
                      삭제
                    </Button>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </CommentContainer>

      {isReplying && (
        <div className="ml-6">
          <CommentArea
            onSubmit={handleReply}
            onCancel={() => setIsReplying(false)}
            placeholder="답글을 입력하세요..."
            existingUsers={existingUsers}
            parentCommentId={comment.commentId}
          />
        </div>
      )}

      {/* ✅ 대댓글을 부모 댓글 안에서 렌더링 */}
      {comment.childComments.length > 0 && (
        <div className="ml-4 border-l-2 pl-2">
          {comment.childComments.map((reply) => (
            <CommentItem
              key={reply.commentId}
              comment={reply}
              currentUserId={currentUserId}
              onEdit={onEdit}
              onDelete={onDelete}
              onReply={onReply}
              existingUsers={existingUsers}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentItem;
