'use client';

import { useState } from 'react';
import { CommentDTO } from '@/lib/types/dto/comment';
import { TestModeProps } from '@/lib/types/test/comment';
import { formatDate } from '../../../lib/utils/date';
import CommentForm from './CommentForm';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface CommentItemProps extends TestModeProps {
  comment: CommentDTO;
  onReply: (content: string, parentId: number) => void;
  onEdit: (commentId: number, content: string) => void;
  onDelete: (commentId: number) => void;
  currentNickname: string;
  existingNicknames: string[];
}

export default function CommentItem({
  comment,
  onReply,
  onEdit,
  onDelete,
  currentNickname,
  existingNicknames,
  isTestMode = false
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isReplying, setIsReplying] = useState(false);

  const handleEditSubmit = (content: string) => {
    onEdit(comment.commentId, content);
    setIsEditing(false);
  };

  const handleReplySubmit = (content: string) => {
    onReply(content, comment.commentId);
    setIsReplying(false);
  };

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

  const isOwnComment = comment.user.nickname === currentNickname;

  return (
    <div className={`p-4 rounded-lg ${comment.parentId ? 'ml-8 bg-gray-50' : 'bg-white border'}`}>
      <div className="flex items-start gap-4">
        <Avatar className="h-20 w-20 shrink-0">
          <AvatarImage 
            src={comment.user.profileImageUrl || "/default-profile.png"} 
            alt={comment.user.nickname} 
          />
          <AvatarFallback>{comment.user.nickname[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{comment.user.nickname}</span>
            </div>
            <div className="flex flex-col items-end gap-1 text-sm text-gray-500">
              <span>
                <span className="text-gray-400">작성: </span>
                {formatDate(comment.createdAt)}
              </span>
              {comment.modifiedAt && comment.modifiedAt !== comment.createdAt && (
                <span>
                  <span className="text-gray-400">수정: </span>
                  {formatDate(comment.modifiedAt)}
                </span>
              )}
            </div>
          </div>
          
          {isEditing ? (
            <CommentForm
              onSubmit={handleEditSubmit}
              initialContent={comment.comment}
              existingNicknames={existingNicknames}
              onCancel={() => setIsEditing(false)}
            />
          ) : (
            <p className="whitespace-pre-wrap">{renderContent(comment.comment)}</p>
          )}

          {!isEditing && (
            <div className="mt-2 space-x-2 text-sm">
              {!comment.parentId && (
                <button
                  onClick={() => setIsReplying(!isReplying)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  답글
                </button>
              )}
              {isOwnComment && (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    수정
                  </button>
                  <button
                    onClick={() => onDelete(comment.commentId)}
                    className="text-red-500 hover:text-red-700"
                  >
                    삭제
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {isReplying && (
        <div className="mt-4 ml-14">
          <CommentForm
            onSubmit={handleReplySubmit}
            placeholder="답글을 입력하세요..."
            existingNicknames={existingNicknames}
            onCancel={() => setIsReplying(false)}
          />
        </div>
      )}

      {comment.childComments && comment.childComments.length > 0 && (
        <div className="mt-4 space-y-4">
          {comment.childComments.map((reply) => (
            <CommentItem
              key={reply.commentId}
              comment={reply}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              currentNickname={currentNickname}
              existingNicknames={existingNicknames}
              isTestMode={isTestMode}
            />
          ))}
        </div>
      )}
    </div>
  );
} 