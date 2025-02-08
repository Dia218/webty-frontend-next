'use client';

import { useState } from 'react';
import { CommentAvatar, CommentAvatarFallback, CommentAvatarImage } from '@/components/ui/comment-avatar';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils/formatDate';
import CommentArea from './CommentArea';
import NestedCommentItem from './NestedCommentItem';
import { UserDataResponseDto } from '@/lib/types/user/UserDataResponseDto';
import { CommentResponseDto } from '@/lib/types/reviewComment/CommentResponseDto';
import { CommentContainer, CommentNestedContainer } from '@/components/ui/comment-container';
import { CommentHeader, CommentAuthor, CommentTime } from '@/components/ui/comment-header';
import { CommentContent, CommentMention } from '@/components/ui/comment-content';

interface CommentItemProps {
  comment: CommentResponseDto;
  currentUserId: number;
  existingUsers?: UserDataResponseDto[];
  onEdit: (commentId: number, content: string) => void;
  onDelete: (commentId: number) => void;
  onReply?: (content: string, parentId: number) => void;
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

  const renderContent = (content: string = '') => {
    if (!content) return null;
    
    const parts = content.split(/(@[^\s]+(?:\s+[^\s]+)*\u200B)/g);
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        const nickname = part.slice(1).replace('\u200B', '').trim();
        const isMentioned = safeComment.mentions?.includes(nickname);
        
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
    onEdit(safeComment.commentId, newContent);
    setIsEditing(false);
  };

  const handleReply = (content: string) => {
    if (onReply) {
      onReply(content, safeComment.commentId);
      setIsReplying(false);
    }
  };

  // 날짜 포맷팅
  const formattedDate = formatDate(safeComment.createdAt);
  const isModified = safeComment.modifiedAt && safeComment.modifiedAt !== safeComment.createdAt;
  const modifiedDate = isModified ? formatDate(safeComment.modifiedAt) : null;

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
              <CommentHeader>
                <div className="flex items-center gap-2">
                  <CommentAuthor>{user.nickname}</CommentAuthor>
                  <CommentTime dateTime={safeComment.createdAt}>{formattedDate}</CommentTime>
                  {isModified && (
                    <span className="text-xs text-gray-400">(수정됨)</span>
                  )}
                </div>
              </CommentHeader>

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
                    {renderContent(safeComment.content)}
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
        <CommentNestedContainer>
          <CommentArea
            onSubmit={handleReply}
            onCancel={() => setIsReplying(false)}
            placeholder="답글을 입력하세요..."
            existingUsers={existingUsers}
          />
        </CommentNestedContainer>
      )}

      {safeComment.childComments && safeComment.childComments.length > 0 && (
        <CommentNestedContainer>
          {safeComment.childComments.map((reply) => (
            <NestedCommentItem
              key={reply.commentId}
              comment={reply}
              currentUserId={currentUserId}
              existingUsers={existingUsers}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </CommentNestedContainer>
      )}
    </div>
  );
};

export default CommentItem;