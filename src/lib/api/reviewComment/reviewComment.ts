import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface CommentRequest {
  content: string;
}

interface CommentResponse {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

interface PageDto<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

const useReviewComments = (
  reviewId: number,
  page: number = 0,
  size: number = 10
) => {
  const [comments, setComments] = useState<CommentResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/reviews/${reviewId}/comments`, {
        params: { page, size },
      });
      setComments(response.data.content);
    } catch (err) {
      setError('Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  }, [reviewId, page, size]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const createComment = async (request: CommentRequest) => {
    try {
      const response = await axios.post(
        `/api/reviews/${reviewId}/comments`,
        request
      );
      setComments((prevComments) => [
        ...prevComments,
        {
          id: response.data,
          content: request.content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      setError('Failed to create comment');
    }
  };

  const updateComment = async (commentId: number, request: CommentRequest) => {
    try {
      const response = await axios.put(
        `/api/reviews/comments/${commentId}`,
        request
      );
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? { ...comment, content: request.content }
            : comment
        )
      );
    } catch (err) {
      setError('Failed to update comment');
    }
  };

  const deleteComment = async (commentId: number) => {
    try {
      await axios.delete(`/api/reviews/comments/${commentId}`);
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );
    } catch (err) {
      setError('Failed to delete comment');
    }
  };

  return {
    comments,
    loading,
    error,
    fetchComments,
    createComment,
    updateComment,
    deleteComment,
  };
};

export default useReviewComments;
