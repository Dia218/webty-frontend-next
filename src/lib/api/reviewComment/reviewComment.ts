/*
여기에 있는 테스트 관련 코드 싹 지울 것!!!!!!!!!!!
*/
import { useState, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:8080';

// 테스트 모드를 위한 메모리 저장소
class TestModeStorage {
  private static instance: TestModeStorage;
  private comments: CommentDTO[] = [];
  private commentIdCounter: number = 1;

  private constructor() {}

  public static getInstance(): TestModeStorage {
    if (!TestModeStorage.instance) {
      TestModeStorage.instance = new TestModeStorage();
    }
    return TestModeStorage.instance;
  }

  public getComments(reviewId: number): CommentDTO[] {
    return this.comments.filter((comment) => comment.reviewId === reviewId);
  }

  public addComment(comment: CommentDTO): void {
    comment.commentId = this.getNextCommentId();
    const now = new Date().toISOString();
    comment.createdAt = now;
    comment.modifiedAt = now;
    comment.childComments = [];

    if (comment.parentId) {
      const parentComment = this.findComment(comment.parentId);
      if (parentComment) {
        comment.depth = 1;
        parentComment.childComments.push(comment);
      }
    } else {
      comment.depth = 0;
      this.comments.push(comment);
    }
  }

  public updateComment(
    commentId: number,
    content: string,
    mentions: string[]
  ): CommentDTO | undefined {
    let targetComment: CommentDTO | undefined;

    // 먼저 최상위 댓글에서 찾기
    targetComment = this.comments.find(
      (comment) => comment.commentId === commentId
    );

    // 답글에서 찾기
    if (!targetComment) {
      for (const comment of this.comments) {
        const childComment = comment.childComments?.find(
          (c) => c.commentId === commentId
        );
        if (childComment) {
          targetComment = childComment;
          break;
        }
      }
    }

    if (!targetComment) {
      console.error(`댓글을 찾을 수 없습니다. ID: ${commentId}`);
      return undefined;
    }

    const now = new Date().toISOString();

    // 새로운 객체 생성하여 반환
    const updatedComment = {
      ...targetComment,
      comment: content,
      mentions: mentions,
      modifiedAt: now,
    };

    // 원본 객체도 업데이트
    targetComment.comment = content;
    targetComment.mentions = mentions;
    targetComment.modifiedAt = now;

    return updatedComment;
  }

  public deleteComment(commentId: number): void {
    const commentIndex = this.comments.findIndex(
      (c) => c.commentId === commentId
    );
    if (commentIndex !== -1) {
      this.comments.splice(commentIndex, 1);
    } else {
      for (const comment of this.comments) {
        const childIndex = comment.childComments.findIndex(
          (c) => c.commentId === commentId
        );
        if (childIndex !== -1) {
          comment.childComments.splice(childIndex, 1);
          break;
        }
      }
    }
  }

  public getNextCommentId(): number {
    return this.commentIdCounter++;
  }

  private findComment(commentId: number): CommentDTO | undefined {
    // 먼저 최상위 댓글에서 찾기
    for (const comment of this.comments) {
      if (comment.commentId === commentId) {
        return comment;
      }
      // 답글에서 찾기
      if (comment.childComments) {
        const childComment = comment.childComments.find(
          (c) => c.commentId === commentId
        );
        if (childComment) {
          return childComment;
        }
      }
    }
    return undefined;
  }
}

export function useComments(reviewId: number) {
  const [comments, setComments] = useState<CommentDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/reviews/${reviewId}/comments`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();
      setComments(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, [reviewId]);

  const createComment = useCallback(
    async (request: CommentRequestDTO) => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/reviews/${request.reviewId}/comments`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
            credentials: 'include',
          }
        );
        if (!response.ok) {
          throw new Error('Failed to create comment');
        }
        const newComment = await response.json();
        await fetchComments(); // 댓글 목록 새로고침
        return newComment;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchComments]
  );

  const updateComment = useCallback(
    async (commentId: number, request: CommentRequestDTO) => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/reviews/${request.reviewId}/comments/${commentId}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
            credentials: 'include',
          }
        );
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || '댓글 수정에 실패했습니다.');
        }
        const updatedComment = await response.json();
        await fetchComments(); // 댓글 목록 새로고침
        return updatedComment;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchComments]
  );

  const deleteComment = useCallback(
    async (commentId: number) => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/api/comments/${commentId}`,
          {
            method: 'DELETE',
            credentials: 'include',
          }
        );
        if (!response.ok) {
          throw new Error('Failed to delete comment');
        }
        await fetchComments(); // 댓글 목록 새로고침
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [fetchComments]
  );

  return {
    comments,
    isLoading,
    error,
    fetchComments,
    createComment,
    updateComment,
    deleteComment,
  };
}

export const getComments = async (
  reviewId: number,
  isTestMode = false
): Promise<CommentDTO[]> => {
  if (isTestMode) {
    return TestModeStorage.getInstance().getComments(reviewId);
  }

  try {
    const response = await fetch(`/api/reviews/${reviewId}/comments`);
    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
};

export const createComment = async (
  request: CommentRequestDTO,
  isTestMode = false
): Promise<CommentDTO> => {
  if (isTestMode) {
    const storage = TestModeStorage.getInstance();
    const now = new Date().toISOString();
    const newComment: CommentDTO = {
      commentId: 0, // 실제 ID는 addComment에서 할당됨
      user: { nickname: request.nickname || 'Anonymous' },
      comment: request.comment,
      createdAt: now,
      modifiedAt: now,
      depth: request.parentCommentId ? 1 : 0,
      parentId: request.parentCommentId || null,
      childComments: [],
      mentions: request.mentions,
      reviewId: request.reviewId,
    };

    storage.addComment(newComment);
    return newComment;
  }

  try {
    const response = await fetch(`/api/reviews/${request.reviewId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to create comment');
    }
    return response.json();
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
};

export const updateComment = async (
  commentId: number,
  request: CommentRequestDTO,
  isTestMode = false
): Promise<CommentDTO> => {
  if (isTestMode) {
    const storage = TestModeStorage.getInstance();
    const updatedComment = storage.updateComment(
      commentId,
      request.comment,
      request.mentions || []
    );
    if (!updatedComment) {
      throw new Error('댓글을 찾을 수 없습니다.');
    }
    return {
      ...updatedComment,
      modifiedAt: new Date().toISOString(),
    };
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/reviews/${request.reviewId}/comments/${commentId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          comment: request.comment,
          mentions: request.mentions || [],
        }),
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || '댓글 수정에 실패했습니다.');
    }

    return response.json();
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
};

export const deleteComment = async (
  commentId: number,
  isTestMode = false
): Promise<void> => {
  if (isTestMode) {
    TestModeStorage.getInstance().deleteComment(commentId);
    return;
  }

  try {
    const response = await fetch(`/api/comments/${commentId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to delete comment');
    }
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
};
