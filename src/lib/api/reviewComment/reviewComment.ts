import { useState, useEffect } from 'react';
import axios from 'axios';
import { CommentResponseDto } from '@/lib/types/reviewComment/CommentResponseDto';
import { PageDto } from '@/lib/types/common/PageDto';

export const API_BASE_URL = 'http://localhost:8080';
export const API_ENDPOINTS = {
  KAKAO_LOGIN: `${API_BASE_URL}/oauth2/authorization/kakao`,
  LOGOUT: `${API_BASE_URL}/logout`,
  USER_INFO: `${API_BASE_URL}/user/info`,
  CLIENT_BASE_URL: 'http://localhost:3000'
} as const;

// 사용자 정보를 위한 새로운 hook
export const useCommentUser = () => {
  const [nickname, setNickname] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.USER_INFO, {
        method: 'GET',
        credentials: 'include',
      });
      
      if (response.ok) {
        const data = await response.json();
        setNickname(data.nickname);
        setProfileImage(data.profileImage);
      } else {
        setNickname(null);
        setProfileImage(null);
      }
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error);
      setNickname(null);
      setProfileImage(null);
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return { nickname, profileImage, refetchUserInfo: fetchUserInfo };
};

export const useReviewComments = (reviewId: number) => {
  const [comments, setComments] = useState<CommentResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedComment, setEditedComment] = useState<string>('');

  useEffect(() => {
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

  const handleCreateComment = async (content: string) => {
    if (!content.trim()) return;

    try {
      const response = await axios.post<CommentResponseDto>(
        `${API_BASE_URL}/api/reviews/${reviewId}/comments`,
        { content },
        {
          withCredentials: true
        }
      );
      setComments([...comments, response.data]);
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const handleUpdateComment = async (commentId: number) => {
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