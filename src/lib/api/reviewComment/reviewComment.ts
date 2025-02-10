import { useState, useEffect } from 'react';
import axios from 'axios';
import { CommentResponseDto } from '@/lib/types/reviewComment/CommentResponseDto';
import { PageDto } from '@/lib/types/common/PageDto';
import { CommentRequestDto } from '@/lib/types/reviewComment/CommentRequestDto';
export const API_BASE_URL = 'http://localhost:8080';
export const API_ENDPOINTS = {
  CLIENT_BASE_URL: 'http://localhost:3000'
} as const;

// 리뷰 댓글
export const useReviewComments = (reviewId: number) => {
  const [comments, setComments] = useState<CommentResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedComment, setEditedComment] = useState<string>('');

  useEffect(() => {
    // 리뷰 댓글 조회
    const fetchComments = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get<PageDto<CommentResponseDto>>(
          `${API_BASE_URL}/api/reviews/${reviewId}/comments`,
          {
            withCredentials: true
          }
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

  // 댓글 생성
  const handleCreateComment = async (commentRequestDto: CommentRequestDto) => {
    if (!commentRequestDto.content.trim()) return;

    try {
      const response = await axios.post<CommentResponseDto>(
        `${API_BASE_URL}/api/reviews/${reviewId}/comments`,
        { commentRequestDto },
        {
          withCredentials: true
        }
      );
      setComments([...comments, response.data]);
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  // 댓글 수정
  const handleUpdateComment = async (commentId: number,commentRequestDto: CommentResponseDto) => {
    if (editedComment.trim() === '') return;

    try {
      const response = await axios.put<CommentResponseDto>(
        `${API_BASE_URL}/api/reviews/${reviewId}/comments/${commentId}`,
        { content: editedComment },
        {
          withCredentials: true
        }
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

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/api/reviews/${reviewId}/comments/${commentId}`, {
        withCredentials: true
      });
      setComments(
        comments.filter((comment) => comment.commentId !== commentId)
      );
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return {
    comments,
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