'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/comment-avatar';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils/date';
import { CommentArea } from './CommentArea';
import { NestedCommentItem } from './NestedCommentItem';
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

interface CommentItemsProps {
  comment: Comment;
  currentUserId: number;
  existingUsers?: UserDataResponse[];
  onEdit: (commentId: number, content: string) => void;
  onDelete: (commentId: number) => void;
  onReply?: (commentId: number, content: string) => void;
}

export function CommentItems({
  comment,
  currentUserId,
  existingUsers = [],
  onEdit,
  onDelete,
  onReply
}: CommentItemsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const renderContent = (content: string) => {
    const parts = content.split(/(@[^\s]+(?:\s+[^\s]+)*\u200B)/g);
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        const nickname = part.slice(1).replace('\u200B', '').trim();
        const isMentioned = comment.mentionedUsernames?.includes(nickname);
        
        return (
          <span
            key={index}
            className={`inline-flex items-center ${
              isMentioned 
                ? "bg-blue-50 text-blue-600 font-semibold" 
                : "text-gray-500"
            } rounded px-1.5 py-0.5 mx-0.5`}
          >
            {part.replace('\u200B', '')}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const handleEdit = (newContent: string) => {
    onEdit(comment.commentId, newContent);
    setIsEditing(false);
  };

  const handleReply = (content: string) => {
    if (onReply) {
      onReply(comment.commentId, content);
      setIsReplying(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 p-4 bg-white rounded-lg border">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage 
            src={comment.user.profileImageUrl || "/default-profile.png"} 
            alt={comment.user.nickname} 
          />
          <AvatarFallback>{comment.user.nickname[0]}</AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">{comment.user.nickname}</span>
            <div className="text-sm text-gray-500">
              <time>{formatDate(comment.createdAt)}</time>
              {comment.modifiedAt && comment.modifiedAt !== comment.createdAt && (
                <span className="ml-2">(수정됨)</span>
              )}
            </div>
          </div>

          {isEditing ? (
            <CommentArea
              onSubmit={handleEdit}
              onCancel={() => setIsEditing(false)}
              initialContent={comment.content}
              existingUsers={existingUsers}
            />
          ) : (
            <>
              <p className="text-gray-800 whitespace-pre-wrap">
                {renderContent(comment.content)}
              </p>
              
              <div className="mt-3 space-x-2">
                {onReply && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsReplying(!isReplying)}
                  >
                    답글
                  </Button>
                )}
                {currentUserId === comment.user.userId && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
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
      </div>

      {isReplying && (
        <div className="ml-12">
          <CommentArea
            onSubmit={handleReply}
            onCancel={() => setIsReplying(false)}
            placeholder="답글을 입력하세요..."
            existingUsers={existingUsers}
          />
        </div>
      )}

      {comment.childComments && comment.childComments.length > 0 && (
        <div className="ml-12 space-y-4">
          {comment.childComments.map((reply) => (
            <NestedCommentItem
              key={reply.commentId}
              comment={reply}
              currentUserId={currentUserId}
              existingUsers={existingUsers}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}