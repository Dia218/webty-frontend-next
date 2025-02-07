import { useState, useEffect } from 'react';
import axios from 'axios';
import { CommentResponseDto } from '@/lib/types/reviewComment/CommentResponseDto';
import { PageDto } from '@/lib/types/common/PageDto';

export const useReviewComments = (reviewId: number) => {
  const [comments, setComments] = useState<CommentResponseDto[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedComment, setEditedComment] = useState<string>('');

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<PageDto<CommentResponseDto>>(
          `/api/reviews/${reviewId}/comments`
        );
        setComments(response.data.content);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [reviewId]);

  const handleCreateComment = async () => {
    if (newComment.trim() === '') return;

    try {
      const response = await axios.post<CommentResponseDto>(
        `/api/reviews/${reviewId}/comments`,
        { content: newComment }
      );
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const handleUpdateComment = async (commentId: number) => {
    if (editedComment.trim() === '') return;

    try {
      const response = await axios.put<CommentResponseDto>(
        `/api/reviews/${reviewId}/comments/${commentId}`,
        { content: editedComment }
      );
      setComments(
        comments.map((comment) =>
          comment.commentId === commentId ? response.data : comment
        )
      );
      setEditingCommentId(null);
      setEditedComment('');
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      await axios.delete(`/api/reviews/${reviewId}/comments/${commentId}`);
      setComments(
        comments.filter((comment) => comment.commentId !== commentId)
      );
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return {
    comments,
    newComment,
    setNewComment,
    isLoading,
    editingCommentId,
    setEditingCommentId,
    editedComment,
    setEditedComment,
    handleCreateComment,
    handleUpdateComment,
    handleDeleteComment,
  };
};
