'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/api/security/useAuth';
import CommentList from '@/components/common/CommentList/CommentList';
import { CommentContainer } from '@/components/ui/comment-container';
import { CommentHeader } from '@/components/ui/comment-header';
import { CommentContent } from '@/components/ui/comment-content';
import { CommentAvatar, CommentAvatarImage, CommentAvatarFallback } from '@/components/ui/comment-avatar';
import useReviews from '@/lib/api/review/review';
import { useReviewComments } from '@/lib/api/reviewComment/reviewComment';
import { ReviewDetailResponseDto } from '@/lib/types/review/ReviewDetailResponseDto';
import CommentArea from '@/components/common/CommentList/CommentArea';

export default function ReviewCommentsPage() {
  const { id: reviewId } = useParams();
  const [isEnabled, setIsEnabled] = useState(true);
  const { isLoggedIn } = useAuth();
  // const { nickname, profileImage, refetchUserInfo } = useAuth();
  const [review, setReview] = useState<ReviewDetailResponseDto | null>(null);
  const [isReviewLoading, setIsReviewLoading] = useState(true);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number>(0);
  
  const { fetchReviewById } = useReviews();
  const {
    comments,
    isLoading: isCommentsLoading,
    handleCreateComment,
    handleUpdateComment,
    handleDeleteComment
  } = useReviewComments(Number(reviewId));

  // useEffect(() => {
  //   if (isLoggedIn) {
  //     refetchUserInfo();
  //     fetch('http://localhost:8080/user/info', {
  //       credentials: 'include'
  //     })
  //     .then(response => response.json())
  //     .then(data => {
  //       setCurrentUserId(data.id);
  //     })
  //     .catch(error => {
  //       console.error('사용자 ID 조회 실패:', error);
  //       setCurrentUserId(0);
  //     });
  //   } else {
  //     setCurrentUserId(0);
  //   }
  // }, [isLoggedIn]);

  useEffect(() => {
    const loadReview = async () => {
      try {
        const data = await fetchReviewById(Number(reviewId));
        if (data) {
          setReview(data);
          setReviewError(null);
        } else {
          setReviewError('리뷰를 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('리뷰 데이터를 불러오는데 실패했습니다:', error);
        setReviewError('리뷰를 불러오는데 실패했습니다.');
      } finally {
        setIsReviewLoading(false);
      }
    };

    if (reviewId) {
      loadReview();
    }
  }, [reviewId]);

  if (isReviewLoading) {
    return <div className="container mx-auto p-4">로딩 중...</div>;
  }

  if (reviewError) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center text-red-500 p-4 rounded-lg bg-red-50">
          {reviewError}
        </div>
      </div>
    );
  }

  if (!review) {
    return <div className="container mx-auto p-4">리뷰를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">COMMENT OF REVIEW</h1>
        <label className="flex items-center space-x-2">
          <span>댓글 기능 활성화</span>
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(e) => setIsEnabled(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
        </label>
      </div>
      
      {isEnabled && (
        <div className="space-y-6">
          <CommentContainer>
            <div className="flex flex-col gap-4">
              <div className="text-sm text-gray-500 mb-2">
                REVIW
              </div>
              <div className="flex items-start gap-3">
                <CommentAvatar>
                  {review.userDataResponse.profileImage ? (
                    <CommentAvatarImage src={review.userDataResponse.profileImage} alt={review.userDataResponse.nickname} />
                  ) : (
                    <CommentAvatarFallback>
                      {review.userDataResponse.nickname[0]}
                    </CommentAvatarFallback>
                  )}
                </CommentAvatar>
                <div className="flex-1">
                  <CommentHeader
                    author={review.userDataResponse.nickname}
                    timestamp={new Date(review.createdAt)}
                  />
                  <CommentContent>
                    {review.content}
                  </CommentContent>
                </div>
              </div>
            </div>
          </CommentContainer>

          {/* 댓글 작성 영역 */}
          <CommentContainer>
            <div className="flex flex-col gap-4">
              <div className="text-sm text-gray-500">
                댓글 작성
              </div>
              <div className="flex gap-3">
                <CommentAvatar>
                  {review.userDataResponse.profileImage ? (
                    <CommentAvatarImage src={review.userDataResponse.profileImage} alt={review.userDataResponse.nickname} />
                  ) : (
                    <CommentAvatarFallback>
                      {review.userDataResponse.nickname[0]}
                    </CommentAvatarFallback>
                  )}
                </CommentAvatar>
                <div className="flex-1">
                  <div className="mb-2 font-medium text-sm">
                    {review.userDataResponse.nickname || '로그인이 필요합니다'}
                  </div>
                  <CommentArea
                    onSubmit={handleCreateComment}
                    placeholder={isLoggedIn ? "댓글을 입력하세요... (@를 입력하여 사용자 멘션)" : "댓글을 작성하려면 로그인이 필요합니다"}
                    existingUsers={comments.map(comment => comment.user)}
                    reviewId={Number(reviewId)}
                  />
                </div>
              </div>
            </div>
          </CommentContainer>

          <CommentList
            reviewId={Number(reviewId)}
            currentUser={{ id: currentUserId, nickname: review.userDataResponse.nickname || '', profileImage: review.userDataResponse.profileImage }}
            isEnabled={isEnabled}
            comments={comments}
            currentUserId={currentUserId}
            onEdit={handleUpdateComment}
            onDelete={handleDeleteComment}
            onReply={handleCreateComment}
            isLoading={isCommentsLoading}
            existingUsers={comments.map(comment => comment.user)}
          />
        </div>
      )}
      
      {!isEnabled && (
        <div className="rounded-lg border p-4 text-center text-gray-500">
          댓글 기능이 비활성화되어 있습니다.
        </div>
      )}
    </div>
  );
}
