'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/comment-avatar';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils/date';
import { CommentArea } from './CommentArea';
import { UserDataResponse } from '@/lib/types/user';

interface Comment {
  commentId: number;
  content: string;
  createdAt: string;
  modifiedAt?: string;
  user: UserDataResponse;
  mentionedUsernames: string[];
}

interface NestedCommentItemProps {
  comment: Comment;
  currentUserId: number;
  existingUsers?: UserDataResponse[];
  onEdit: (commentId: number, content: string) => void;
  onDelete: (commentId: number) => void;
}

export function NestedCommentItem({
  comment,
  currentUserId,
  existingUsers = [],
  onEdit,
  onDelete
}: NestedCommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);

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

  return (
    <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
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
            
            {currentUserId === comment.user.userId && (
              <div className="mt-3 space-x-2">
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
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}