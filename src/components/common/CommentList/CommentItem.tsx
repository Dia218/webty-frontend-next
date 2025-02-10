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
import { useReviewComments } from '@/lib/api/reviewComment/reviewComment';
import { useAuth } from '@/lib/api/security/useAuth';
import { CommentRequestDto } from '@/lib/types/reviewComment/CommentRequestDto';

interface CommentItemProps {
  comment: CommentResponseDto;
  currentUserId: number;
  existingUsers?: UserDataResponseDto[];
  onEdit:(commentId: number, commentRequestDto: CommentRequestDto) => Promise<void>;
  onDelete: (commentId: number) => void;
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

  // 기본값 설정
  const defaultUser: UserDataResponseDto = {
    id: 0,
    nickname: '알 수 없음',
    profileImage: '/default-profile.png'
  };

  const defaultComment: CommentResponseDto = {
    commentId: 0,
    content: '',
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
    user: defaultUser,
    depth: 0,
    mentions: [],
    childComments: []
  };

  // 안전한 comment 객체 생성
  const safeComment = comment || defaultComment;
  const user = safeComment.user || defaultUser;

  const handleEdit = (newContent: string) => {
    onEdit(safeComment.commentId, newContent);
    setIsEditing(false);
  };

  const handleReply = (content: string) => {
    if (onReply) {
        console.log('parent id:', safeComment.commentId)
      onReply(content, safeComment.commentId);
      setIsReplying(false);
    }
  };

  // 날짜 포맷팅
  const formattedDate = formatDate(safeComment.createdAt);
  const isModified = safeComment.modifiedAt && safeComment.modifiedAt !== safeComment.createdAt;

  return (
    <div className="space-y-4">
      <CommentContainer>
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <CommentAvatar className="h-12 w-12">
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
                timestamp={new Date(safeComment.createdAt)}
              />

              {isEditing ? (
                <CommentArea
                  onSubmit={handleEdit}
                  onCancel={() => setIsEditing(false)}
                  initialContent={safeComment.content}
                  existingUsers={existingUsers}
                />
              ) : (
                <>
                  <CommentContent>
                    {safeComment.content}
                  </CommentContent>
                  <div className="space-x-2 mt-2">
                    {onReply && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsReplying(!isReplying)}
                      >
                        답글
                      </Button>
                    )}
                    {currentUserId === user.id && (
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
                          onClick={() => onDelete(safeComment.commentId)}
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
        </div>
      </CommentContainer>

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
    </div>
  );
};

export default CommentItem;