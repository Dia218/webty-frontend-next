import { useState, useCallback, useEffect } from 'react';
import { CommentDTO, CommentRequestDTO } from '@/lib/types/dto/comment';
import { TestModeStorage } from './comment.test.storage';
import { useAuth } from '@/lib/api/user/user';

export function useTestComments(reviewId: number) {
  const { isLoggedIn, nickname, profileImage } = useAuth();
  const [comments, setComments] = useState<CommentDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = TestModeStorage.getInstance().getComments(reviewId);
      setComments(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [reviewId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const createComment = useCallback(async (request: CommentRequestDTO) => {
    setIsLoading(true);
    try {
      const newComment = await createTestComment(request, {
        nickname: isLoggedIn ? nickname! : '테스트 사용자',
        profileImageUrl: isLoggedIn ? profileImage : '/default-profile.png'
      });
      await fetchComments();
      return newComment;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchComments, isLoggedIn, nickname, profileImage]);

  const updateComment = useCallback(async (commentId: number, request: CommentRequestDTO) => {
    setIsLoading(true);
    try {
      const updatedComment = await updateTestComment(commentId, request);
      await fetchComments();
      return updatedComment;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchComments]);

  const deleteComment = useCallback(async (commentId: number) => {
    setIsLoading(true);
    try {
      await deleteTestComment(commentId);
      await fetchComments();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchComments]);

  return {
    comments,
    isLoading,
    error,
    fetchComments,
    createComment,
    updateComment,
    deleteComment
  };
}

interface TestUserInfo {
  nickname: string;
  profileImageUrl: string;
}

// 테스트 모드용 함수들
export const createTestComment = async (request: CommentRequestDTO, userInfo: TestUserInfo): Promise<CommentDTO> => {
  const storage = TestModeStorage.getInstance();
  const now = new Date().toISOString();
  const newComment: CommentDTO = {
    commentId: 0,
    reviewId: request.reviewId,
    comment: request.comment,
    createdAt: now,
    modifiedAt: now,
    depth: request.parentId ? 1 : 0,
    parentId: request.parentId,
    childComments: [],
    mentionedUsernames: request.mentionedUsernames,
    user: {
      userId: 3,
      nickname: userInfo.nickname,
      email: `test3@example.com`,
      role: "USER",
      createdAt: now,
      modifiedAt: now,
      profileImageUrl: userInfo.profileImageUrl
    }
  };

  storage.addComment(newComment);
  return newComment;
};

export const updateTestComment = async (commentId: number, request: CommentRequestDTO): Promise<CommentDTO> => {
  const storage = TestModeStorage.getInstance();
  const updatedComment = storage.updateComment(commentId, request.comment, request.mentionedUsernames);
  if (!updatedComment) {
    throw new Error('Failed to update comment');
  }
  return updatedComment;
};

export const deleteTestComment = async (commentId: number): Promise<void> => {
  TestModeStorage.getInstance().deleteComment(commentId);
}; 