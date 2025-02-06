'use client';

import { useState, useEffect } from 'react';
import { Comment } from '@/lib/types/comment';
import { useAuth } from '@/lib/api/user/user';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import { getComments, createComment, updateComment, deleteComment } from '@/lib/api/comment/comment';
import { generateRandomNickname, getNextTestNickname, getTestNicknames } from '@/lib/utils/nickname';

interface CommentSectionProps {
  reviewId: number;
  isTestMode?: boolean;
}

export default function CommentSection({ reviewId, isTestMode = false }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [replyTo, setReplyTo] = useState<number | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [currentNickname, setCurrentNickname] = useState<string>('');
  const { isLoggedIn, nickname, profileImage } = useAuth();

  useEffect(() => {
    if (isTestMode) {
      setCurrentNickname(getNextTestNickname());
      setComments([]);
    } else if (isLoggedIn && nickname) {
      setCurrentNickname(nickname);
      fetchComments();
    }
  }, [isTestMode, isLoggedIn, nickname]);

  useEffect(() => {
    if (!isTestMode) {
      fetchComments();
    }
  }, [reviewId, isTestMode]);

  const fetchComments = async () => {
    if (isTestMode) {
      return; // 테스트 모드에서는 API 호출하지 않음
    }
    try {
      const fetchedComments = await getComments(reviewId, isTestMode);
      setComments(fetchedComments);
    } catch (err) {
      setError('댓글을 불러오는데 실패했습니다.');
      console.error(err);
    }
  };

  const getAllNicknames = (): string[] => {
    if (isTestMode) {
      return getTestNicknames();
    }
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
    
    // 멘션은 CommentForm에서 선택된 것만 유효하게 처리
    const mentionMatches = content.match(/@[^\s]+/g) || [];
    mentionMatches.forEach(match => {
      const mentionedText = match.slice(1);
      if (existingNicknames.includes(mentionedText)) {
        mentions.add(mentionedText);
      }
    });
    
    return Array.from(mentions);
  };

  const handleCreateComment = async (content: string) => {
    if (!isTestMode && !isLoggedIn) {
      setError('댓글을 작성하려면 로그인이 필요합니다.');
      return;
    }

    try {
      const mentions = extractMentions(content);
      
      if (isTestMode) {
        const request = {
          comment: content,
          reviewId,
          mentions,
          nickname: currentNickname
        };
        const newComment = await createComment(request, true);
        setComments(prevComments => [...prevComments, newComment]);
        setCurrentNickname(getNextTestNickname());
      } else {
        const request = {
          comment: content,
          reviewId,
          mentions
        };
        const newComment = await createComment(request, false);
        if (mentions.length > 0) {
          try {
            await fetch('/api/notifications/mentions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                commentId: newComment.commentId,
                mentions,
                reviewId,
              }),
              credentials: 'include',
            });
          } catch (error) {
            console.error('멘션 알림 전송 실패:', error);
          }
        }
        await fetchComments();
      }
    } catch (err) {
      setError('댓글 작성에 실패했습니다.');
      console.error(err);
    }
  };

  const handleSubmitReply = async (content: string, parentId: number) => {
    if (!isTestMode && !isLoggedIn) {
      setError('답글을 작성하려면 로그인이 필요합니다.');
      return;
    }

    try {
      const mentions = extractMentions(content);
      
      if (isTestMode) {
        // 테스트 모드에서는 로컬 상태만 업데이트
        const now = new Date().toISOString();
        const newReply: Comment = {
          commentId: Math.floor(Math.random() * 10000), // 임시 ID 생성
          user: { nickname: currentNickname },
          comment: content,
          createdAt: now,
          modifiedAt: now,
          depth: 1,
          parentId: parentId,
          childComments: [],
          mentions: mentions,
          reviewId: reviewId
        };

        setComments(prevComments => {
          return prevComments.map(comment => {
            if (comment.commentId === parentId) {
              return {
                ...comment,
                childComments: [...comment.childComments, newReply]
              };
            }
            return comment;
          });
        });
        setCurrentNickname(getNextTestNickname());
      } else {
        const request = {
          comment: content,
          reviewId,
          parentCommentId: parentId,
          mentions
        };
        await createComment(request, false);
        await fetchComments();
      }
    } catch (err) {
      setError('답글 작성에 실패했습니다.');
      console.error(err);
    }
  };

  const handleEditComment = async (commentId: number, content: string) => {
    try {
      const mentions = extractMentions(content);
      const request = {
        comment: content,
        reviewId,
        mentions
      };

      let updatedComment;
      if (isTestMode) {
        updatedComment = await updateComment(commentId, request, true);
        if (!updatedComment) {
          throw new Error('댓글을 찾을 수 없습니다.');
        }
      } else {
        updatedComment = await updateComment(commentId, request, false);
      }

      setComments(prevComments => 
        prevComments.map(comment => {
          // 최상위 댓글인 경우
          if (comment.commentId === commentId) {
            return {
              ...comment,
              comment: content,
              mentions: mentions,
              modifiedAt: new Date().toISOString()
            };
          }
          // 답글인 경우
          if (comment.childComments) {
            const updatedChildComments = comment.childComments.map(childComment => 
              childComment.commentId === commentId ? {
                ...childComment,
                comment: content,
                mentions: mentions,
                modifiedAt: new Date().toISOString()
              } : childComment
            );
            return {
              ...comment,
              childComments: updatedChildComments
            };
          }
          return comment;
        })
      );
    } catch (error) {
      console.error('댓글 수정 중 오류 발생:', error);
      setError('댓글을 수정하는 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!isTestMode && !isLoggedIn) {
      setError('댓글을 삭제하려면 로그인이 필요합니다.');
      return;
    }

    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;
    
    try {
      if (isTestMode) {
        // 테스트 모드에서는 로컬 상태에서만 댓글 제거
        setComments(prevComments => {
          const newComments = prevComments.filter(comment => {
            if (comment.commentId === commentId) {
              return false;
            }
            if (comment.childComments) {
              comment.childComments = comment.childComments.filter(
                childComment => childComment.commentId !== commentId
              );
            }
            return true;
          });
          return newComments;
        });
      } else {
        // 실제 모드에서는 API 호출
        await deleteComment(commentId, isTestMode);
        await fetchComments();
      }
    } catch (err) {
      setError('댓글 삭제에 실패했습니다.');
      console.error(err);
    }
  };

  const existingNicknames = getAllNicknames();

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-500">
          {error}
        </div>
      )}

      {isTestMode ? (
        <div className="mb-4 rounded-lg bg-blue-50 p-4 text-sm text-blue-600">
          <p>현재 닉네임: {currentNickname}</p>
          <p className="mt-1">
            다른 사용자를 멘션하려면 @를 입력하고 닉네임을 선택하세요.
          </p>
          <p className="mt-1 text-xs">
            사용 가능한 닉네임: {getTestNicknames().join(', ')}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            * 댓글 작성 시마다 닉네임이 자동으로 변경됩니다.
          </p>
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

      <div className="space-y-2">
        {comments.map((comment) => (
          <CommentItem
            key={comment.commentId}
            comment={comment}
            onReply={setReplyTo}
            onEdit={handleEditComment}
            onDelete={handleDeleteComment}
            onSubmitReply={handleSubmitReply}
            currentNickname={currentNickname}
            existingNicknames={existingNicknames}
            isTestMode={isTestMode}
          />
        ))}
      </div>
    </div>
  );
} 