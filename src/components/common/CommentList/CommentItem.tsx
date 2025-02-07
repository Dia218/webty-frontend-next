'use client';

import { useState, useEffect } from 'react';
import CommentForm from './CommentArea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CommentResponseDto } from '@/lib/types/reviewComment/CommentResponseDto';

interface CommentItemProps {
  comment: CommentResponseDto;
  onReply: (parentId: number) => void;
  onEdit: (commentId: number, content: string) => void;
  onDelete: (commentId: number) => void;
  onSubmitReply: (content: string, parentId: number) => void;
  currentNickname: string;
  existingNicknames: string[];
  isTestMode?: boolean;
}

export default function CommentItem({
  comment,
  onReply,
  onEdit,
  onDelete,
  onSubmitReply,
  currentNickname,
  existingNicknames,
  isTestMode = false,
}: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isReplying, setIsReplying] = useState(false);
  const [formattedCreatedAt, setFormattedCreatedAt] = useState('');
  const [formattedModifiedAt, setFormattedModifiedAt] = useState('');

  useEffect(() => {
    setEditContent(comment.content);
  }, [comment.content]);

  const isAuthor = comment.user.nickname === currentNickname;

  useEffect(() => {
    // 클라이언트 사이드에서만 날짜 포맷팅 실행
    setFormattedCreatedAt(formatDate(comment.createdAt));
    if (comment.modifiedAt) {
      setFormattedModifiedAt(formatDate(comment.modifiedAt));
    }
  }, [comment.createdAt, comment.modifiedAt]);

  const handleEdit = () => {
    if (!isAuthor) {
      alert('자신이 작성한 댓글만 수정할 수 있습니다.');
      return;
    }
    if (!editContent.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }
    onEdit(comment.commentId, editContent);
    setIsEditing(false);
  };

  const handleReply = () => {
    setIsReplying(!isReplying);
    if (!isReplying) {
      onReply(comment.commentId);
    }
  };

  const handleSubmitReply = (content: string) => {
    onSubmitReply(content, comment.commentId);
    setIsReplying(false);
  };

  const handleDelete = () => {
    if (!isAuthor) {
      alert('자신이 작성한 댓글만 삭제할 수 있습니다.');
      return;
    }
    onDelete(comment.commentId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderContent = (text: string) => {
    const parts = text.split(/(@[가-힣\s]+)/g);

    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        const mentionedNickname = part.slice(1).trim();
        return (
          <span
            key={index}
            className={
              existingNicknames.includes(mentionedNickname)
                ? 'text-blue-600 font-semibold'
                : 'text-gray-500'
            }
          >
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  const isModified = comment.createdAt !== comment.modifiedAt;

  return (
    <div className="relative">
      <div
        className={`mb-1 rounded-lg bg-gray-50 p-4 ${
          comment.depth === 0 ? 'ml-16 border-l-2 border-gray-200' : ''
        }`}
      >
        <div className="mb-4">
          <div className="flex items-start gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage
                src={comment.user.profileImage || '/default-profile.png'}
                alt={comment.user.nickname}
              />
              <AvatarFallback className="text-lg">
                {comment.user.nickname[0]}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <span className="text-lg font-semibold">
                  {comment.user.nickname}
                </span>
                <div className="text-right text-sm text-gray-500">
                  <div>작성: {formattedCreatedAt}</div>
                  {isModified && <div>수정: {formattedModifiedAt}</div>}
                </div>
              </div>
              {isEditing ? (
                <div className="mt-2 space-y-2">
                  <CommentForm
                    onSubmit={handleEdit}
                    onCancel={() => setIsEditing(false)}
                    initialValue={editContent}
                    placeholder="댓글을 수정하세요..."
                    existingNicknames={existingNicknames}
                  />
                </div>
              ) : (
                <>
                  <div className="mt-2 text-base">
                    {renderContent(comment.content)}
                    {isModified && (
                      <span className="ml-2 text-gray-500">(수정됨)</span>
                    )}
                  </div>
                  {comment.mentions.length > 0 && (
                    <div className="mt-2 text-sm text-gray-500">
                      멘션된 사용자: {comment.mentions.join(', ')}
                    </div>
                  )}
                  <div className="mt-3 flex gap-2 text-sm text-gray-500">
                    {comment.depth === 0 && (
                      <button
                        onClick={handleReply}
                        className="hover:text-blue-500"
                      >
                        답글
                      </button>
                    )}
                    {isAuthor && (
                      <>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="hover:text-blue-500"
                        >
                          수정
                        </button>
                        <button
                          onClick={handleDelete}
                          className="hover:text-red-500"
                        >
                          삭제
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {isReplying && (
        <div className="mb-1 ml-16">
          <CommentForm
            onSubmit={handleSubmitReply}
            onCancel={() => setIsReplying(false)}
            placeholder="답글을 입력하세요..."
            isReply
            existingNicknames={existingNicknames}
          />
        </div>
      )}

      {comment.childComments?.map((childComments: CommentResponseDto) => (
        <CommentItem
          key={childComments.commentId}
          comment={childComments}
          onReply={onReply}
          onEdit={onEdit}
          onDelete={onDelete}
          onSubmitReply={onSubmitReply}
          currentNickname={currentNickname}
          existingNicknames={existingNicknames}
          isTestMode={isTestMode}
        />
      ))}
    </div>
  );
}
