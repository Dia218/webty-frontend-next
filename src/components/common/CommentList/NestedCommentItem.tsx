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
import { CommentRequestDto } from '@/lib/types/reviewComment/CommentRequestDto';

interface NestedCommentItemProps {
  comment: CommentResponseDto;
  currentUserId: number;
  existingUsers?: UserDataResponseDto[];
  onEdit: (commentId: number, commentRequestDto: CommentRequestDto) => Promise<void>;
  onDelete: (commentId: number) => Promise<void>;
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

  const handleEdit = async (commentRequestDto: CommentRequestDto) => {
    try {
      // 멘션된 사용자들의 닉네임 추출
      const mentionedUsers = extractMentionsFromContent(commentRequestDto.content);
      
      await onEdit(comment.commentId, {
        content: commentRequestDto.content,
        parentCommentId: comment.parentId || 0,
        mentions: mentionedUsers
      });
      setIsEditing(false);
    } catch (error) {
      console.error('댓글 수정 중 오류 발생:', error);
    }
  };

  // 멘션된 사용자 추출 함수
  const extractMentionsFromContent = (content: string): string[] => {
    const mentions = content.match(/@(\S+)/g) || [];
    return mentions.map(mention => mention.slice(1));
  };

  // 날짜 포맷팅
  const formattedDate = formatDate(comment.createdAt);
  const isModified = comment.modifiedAt && comment.modifiedAt !== comment.createdAt;

  return (
    <CommentContainer className="bg-gray-50">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <CommentAvatar className="h-10 w-10">
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
              isModified={isModified || false}
            />

            {isEditing ? (
              <CommentArea
                onSubmit={handleEdit}
                onCancel={() => setIsEditing(false)}
                initialContent={comment.content}
                existingUsers={existingUsers}
                parentCommentId={comment.parentId}
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