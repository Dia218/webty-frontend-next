'use client';

import { useState } from 'react';
import { CommentAvatar, CommentAvatarFallback, CommentAvatarImage } from '@/components/ui/comment-avatar';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils/formatDate';
import CommentArea from './CommentArea';
import { UserDataResponseDto } from '@/lib/types/user/UserDataResponseDto';
import { CommentResponseDto } from '@/lib/types/reviewComment/CommentResponseDto';
import { CommentContainer } from '@/components/ui/comment-container';
import { CommentHeader, CommentAuthor, CommentTime } from '@/components/ui/comment-header';
import { CommentContent, CommentMention } from '@/components/ui/comment-content';

interface NestedCommentItemProps {
  comment: CommentResponseDto;
  currentUserId: number;
  existingUsers?: UserDataResponseDto[];
  onEdit: (commentId: number, content: string) => void;
  onDelete: (commentId: number) => void;
}

const NestedCommentItem = ({
  comment,
  currentUserId,
  existingUsers = [],
  onEdit,
  onDelete
}: NestedCommentItemProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const renderContent = (content: string) => {
    const parts = content.split(/(@[^\s]+(?:\s+[^\s]+)*\u200B)/g);
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        const nickname = part.slice(1).replace('\u200B', '').trim();
        const isMentioned = comment.mentions?.includes(nickname);
        
        return (
          <CommentMention
            key={index}
            isMentioned={isMentioned}
          >
            {part.replace('\u200B', '')}
          </CommentMention>
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
    <CommentContainer className="bg-gray-50">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <CommentAvatar className="h-10 w-10">
            <CommentAvatarImage 
              src={comment.user.profileImage || "/default-profile.png"} 
              alt={comment.user.nickname} 
              className="object-cover"
            />
            <CommentAvatarFallback>{comment.user.nickname[0]}</CommentAvatarFallback>
          </CommentAvatar>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col">
            <CommentHeader>
              <div className="flex items-center gap-2">
                <CommentAuthor>{comment.user.nickname}</CommentAuthor>
                <CommentTime dateTime={comment.createdAt}>
                  {formatDate(comment.createdAt)}
                </CommentTime>
                {comment.modifiedAt && comment.modifiedAt !== comment.createdAt && (
                  <span className="text-xs text-gray-400">(수정됨)</span>
                )}
              </div>
            </CommentHeader>

            {isEditing ? (
              <CommentArea
                onSubmit={handleEdit}
                onCancel={() => setIsEditing(false)}
                initialContent={comment.content}
                existingUsers={existingUsers}
              />
            ) : (
              <>
                <CommentContent>
                  {renderContent(comment.content)}
                </CommentContent>
                {currentUserId === comment.user.id && (
                  <div className="space-x-2 mt-2">
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
      </div>
    </CommentContainer>
  );
}

export default NestedCommentItem;