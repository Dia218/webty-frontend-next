'use client';

import React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import NavigationBar from '@/components/common/NavigationBar/NavigationBar';
import useReviews from '@/lib/api/review/review';
import ReviewDetail from '@/components/buisness/review/ReviewDetail';
import { getRecommendationStatus } from '@/lib/api/review/recommend';
import { useAuth } from '@/lib/api/security/useAuth';
import { useReviewComments } from '@/lib/api/reviewComment/reviewComment';
import CommentList from '@/components/common/CommentList/CommentList';
import { CommentContainer } from '@/components/ui/comment-container';
import { CommentHeader } from '@/components/ui/comment-header';
import { CommentContent } from '@/components/ui/comment-content';
import { CommentAvatar, CommentAvatarImage, CommentAvatarFallback } from '@/components/ui/comment-avatar';
import CommentArea from '@/components/common/CommentList/CommentArea';

export default function Page() {
  const params = useParams();
  const id = params?.id;
  const { fetchReviewById } = useReviews();
  const { isLoggedIn, loginId, nickname, profileImage } = useAuth();
  const reviewId = Number(id);

  const [review, setReview] = useState<any>(null);
  const [recommendationStatus, setRecommendationStatus] = useState<{
    likes: boolean;
    hates: boolean;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef<boolean>(false);

  const {
    comments,
    isLoading: isCommentsLoading,
    handleCreateComment,
    handleUpdateComment,
    handleDeleteComment
  } = useReviewComments(reviewId);

  useEffect(() => {
    if (isLoggedIn === null) return;
    if (hasFetched.current) return;
    hasFetched.current = true;
    
    const fetchData = async () => {
      try {
        const reviewData = await fetchReviewById(reviewId);
        setReview(reviewData);
        if (isLoggedIn) {
          const recommendationData = await getRecommendationStatus(reviewId);
          setRecommendationStatus(recommendationData);
        } else {
          setRecommendationStatus({ likes: false, hates: false });
        }
      } catch (err) {
        setError('리뷰 데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reviewId, isLoggedIn]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div>
      <NavigationBar />
      <div className="h-5" />
      <div className="container mx-auto px-4">
        <ReviewDetail
          review={review}
          recommendationStatus={recommendationStatus}
          isLoggedIn={isLoggedIn ?? false}
          id={loginId}
        />
        
        {/* 댓글 섹션 */}
        <div className="mt-8 space-y-6">
          {/* 댓글 작성 영역 */}
          {isLoggedIn && (
            <CommentContainer>
              <div className="flex flex-col gap-4">
                <div className="text-sm text-gray-500">
                  댓글 작성
                </div>
                <div className="flex gap-3">
                  <CommentAvatar>
                    {profileImage ? (
                      <CommentAvatarImage src={profileImage} alt={nickname || ''} />
                    ) : (
                      <CommentAvatarFallback>
                        {nickname?.[0] || '?'}
                      </CommentAvatarFallback>
                    )}
                  </CommentAvatar>
                  <div className="flex-1">
                    <div className="mb-2 font-medium text-sm">
                      {nickname || '로그인이 필요합니다'}
                    </div>
                    <CommentArea
                      onSubmit={handleCreateComment}
                      placeholder={isLoggedIn ? "댓글을 입력하세요(@를 입력하여 사용자 멘션)" : "댓글을 작성하려면 로그인이 필요합니다"}
                      existingUsers={comments.map(comment => comment.user)}
                    />
                  </div>
                </div>
              </div>
            </CommentContainer>
          )}

          {/* 댓글 목록 컴포넌트 */}
          <CommentList
            comments={comments}
            currentUserId={loginId || 0}
            onEdit={handleUpdateComment}
            onDelete={handleDeleteComment}
            onReply={handleCreateComment}
            isLoading={isCommentsLoading}
            existingUsers={comments.map(comment => comment.user)}
            error={error}
          />
        </div>
      </div>
    </div>
  );
}