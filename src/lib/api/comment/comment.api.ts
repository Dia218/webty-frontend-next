import { useState, useCallback } from 'react';
import { CommentDTO, CommentRequestDTO } from '../../types/dto/comment';
import { API_BASE_URL } from '../../constants';

export function useComments(reviewId: number) {
  const [comments, setComments] = useState<CommentDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}/comments`);
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

  const createComment = useCallback(async (request: CommentRequestDTO) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews/${request.reviewId}/comments`, {
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
      const newComment = await response.json();
      await fetchComments();
      return newComment;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchComments]);

  const updateComment = useCallback(async (commentId: number, request: CommentRequestDTO) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews/${request.reviewId}/comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to update comment');
      }
      const updatedComment = await response.json();
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
      const response = await fetch(`${API_BASE_URL}/api/comments/${commentId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }
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