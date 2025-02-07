'use client';

import { useState } from 'react';
import { CommentDTO } from '@/lib/types/dto/comment';
import { useAuth } from '@/lib/api/user/user';
import { useTestMode } from '@/lib/hooks/test/useTestMode';
import { useComments } from '@/lib/api/comment/comment.api';
import { useTestComments } from '@/lib/api/test/comment.test.api';
import { TestModeProps } from '@/lib/types/test/comment';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

interface CommentSectionProps extends TestModeProps {
  reviewId: number;
}

export default function CommentSection({ reviewId, isTestMode = false }: CommentSectionProps) {
  const { isLoggedIn } = useAuth();
  const { currentNickname } = useTestMode(isTestMode);
  const realComments = useComments(reviewId);
  const testComments = useTestComments(reviewId);
  
  const {
    comments,
    isLoading,
    error,
    createComment,
    updateComment,
    deleteComment
  } = isTestMode ? testComments : realComments;

  const getAllNicknames = (): string[] => {
    const nicknames = new Set<string>();
    comments.forEach(comment => {
      nicknames.add(comment.user.nickname);
      comment.childComments?.forEach(childComment => {
        nicknames.add(childComment.user.nickname);
      });
    });
    return Array.from(nicknames);
  };

  const extractMentions = (content: string): string[] => {
    const existingNicknames = getAllNicknames();
    const mentions = new Set<string>();
    
    // 공백이 포함된 닉네임도 처리할 수 있도록 정규식 수정
    const mentionRegex = /@([^\s]+(?:\s+[^\s]+)*)\u200B/g;
    let match;
    
    while ((match = mentionRegex.exec(content)) !== null) {
      const mentionedText = match[1]; // @ 기호를 제외한 닉네임
      if (existingNicknames.includes(mentionedText)) {
        mentions.add(mentionedText);
      }
    }
    
    return Array.from(mentions);
  };

  const handleCreateComment = async (content: string) => {
    if (!isTestMode && !isLoggedIn) {
      alert('댓글을 작성하려면 로그인이 필요합니다.');
      return;
    }

    try {
      const mentionedUsernames = extractMentions(content);
      const requestData = {
        reviewId,
        comment: content,
        parentId: null,
        mentionedUsernames
      };

      if (isTestMode) {
        console.group('댓글 생성 요청');
        console.log('요청 데이터:', requestData);
      }

      const result = await createComment(requestData);

      if (isTestMode) {
        console.log('응답 결과:', result);
        console.groupEnd();
      }
    } catch (err) {
      console.error('댓글 작성 실패:', err);
    }
  };

  const handleSubmitReply = async (content: string, parentId: number) => {
    if (!isTestMode && !isLoggedIn) {
      alert('답글을 작성하려면 로그인이 필요합니다.');
      return;
    }

    try {
      const mentionedUsernames = extractMentions(content);
      const requestData = {
        reviewId,
        comment: content,
        parentId,
        mentionedUsernames
      };

      if (isTestMode) {
        console.group('답글 생성 요청');
        console.log('요청 데이터:', requestData);
      }

      const result = await createComment(requestData);

      if (isTestMode) {
        console.log('응답 결과:', result);
        console.groupEnd();
      }
    } catch (err) {
      console.error('답글 작성 실패:', err);
    }
  };

  const handleEditComment = async (commentId: number, content: string) => {
    try {
      const mentionedUsernames = extractMentions(content);
      const requestData = {
        reviewId,
        comment: content,
        parentId: null,
        mentionedUsernames
      };

      if (isTestMode) {
        console.group('댓글 수정 요청');
        console.log('댓글 ID:', commentId);
        console.log('요청 데이터:', requestData);
      }

      const result = await updateComment(commentId, requestData);

      if (isTestMode) {
        console.log('응답 결과:', result);
        console.groupEnd();
      }
    } catch (err) {
      console.error('댓글 수정 실패:', err);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;
    
    try {
      if (isTestMode) {
        console.group('댓글 삭제 요청');
        console.log('삭제할 댓글 ID:', commentId);
      }

      await deleteComment(commentId);

      if (isTestMode) {
        console.log('삭제 완료');
        console.groupEnd();
      }
    } catch (err) {
      console.error('댓글 삭제 실패:', err);
    }
  };

  const existingNicknames = getAllNicknames();

  if (error) {
    return <div className="text-red-500">댓글을 불러오는 중 오류가 발생했습니다.</div>;
  }

  return (
    <div className="space-y-6">
      {isTestMode ? (
        <div className="mb-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-600">
          <p>테스트 모드입니다. {isLoggedIn ? `현재 사용자: ${currentNickname}` : '로그인하지 않은 상태입니다.'}</p>
          <p className="mt-1">다른 사용자를 멘션하려면 @를 입력하고 닉네임을 선택하세요.</p>
          <p className="mt-1 text-xs">멘션 가능한 닉네임: {existingNicknames.join(', ')}</p>
        </div>
      ) : !isLoggedIn ? (
        <div className="mb-4 rounded-lg bg-yellow-50 p-4 text-sm text-yellow-600">
          <p>댓글을 작성하려면 로그인이 필요합니다.</p>
        </div>
      ) : null}

      {(isTestMode || isLoggedIn) && (
        <CommentForm
          onSubmit={handleCreateComment}
          placeholder="댓글을 입력하세요..."
          existingNicknames={existingNicknames}
        />
      )}

      {isLoading ? (
        <div className="text-center text-gray-500">댓글을 불러오는 중...</div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentItem
              key={comment.commentId}
              comment={comment}
              onReply={handleSubmitReply}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
              currentNickname={currentNickname}
              existingNicknames={existingNicknames}
              isTestMode={isTestMode}
            />
          ))}
          {comments.length === 0 && (
            <div className="text-center text-gray-500">
              아직 댓글이 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
} 