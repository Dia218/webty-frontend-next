'use client';

import { useState } from 'react';
import { CommentAvatar, CommentAvatarFallback, CommentAvatarImage } from '@/components/ui/comment-avatar';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils/formatDate';
import CommentArea from './CommentArea';
import { UserDataResponseDto } from '@/lib/types/user/UserDataResponseDto';
import { CommentResponseDto } from '@/lib/types/reviewComment/CommentResponseDto';
import { CommentContainer } from '@/components/ui/comment-container';
import { CommentHeader } from '@/components/ui/comment-header';
import { CommentContent } from '@/components/ui/comment-content';

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

  // 기본값 설정
  const defaultUser: UserDataResponseDto = {
    id: 0,
    nickname: '알 수 없음',
    profileImage: '/default-profile.png'
  };

  const user = comment.user || defaultUser;

  const handleEdit = (newContent: string) => {
    onEdit(comment.commentId, newContent);
    setIsEditing(false);
  };

  // 날짜 포맷팅
  const isModified = Boolean(comment.modifiedAt && comment.modifiedAt !== comment.createdAt);

  return (
    <CommentContainer className="bg-gray-50">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <CommentAvatar className="h-8 w-8">
            <CommentAvatarImage 
              src={user.profileImage || "/default-profile.png"} 
              alt={user.nickname} 
              className="object-cover"
            />
            <CommentAvatarFallback>{user.nickname[0]}</CommentAvatarFallback>
          </CommentAvatar>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col">
            <CommentHeader
              author={user.nickname}
              timestamp={new Date(comment.createdAt)}
              isModified={isModified}
            />

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
                  {comment.content}
                </CommentContent>
                {currentUserId === user.id && (
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
