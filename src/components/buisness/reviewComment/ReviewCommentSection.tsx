import { useReviewComments } from '@/lib/api/reviewComment/reviewComment';
import { useAuth } from '@/lib/api/security/useAuth';
import CommentList from '@/components/common/CommentList/CommentList';
import { CommentContainer } from '@/components/ui/comment-container';
import { CommentAvatar, CommentAvatarImage, CommentAvatarFallback } from '@/components/ui/comment-avatar';
import CommentArea from '@/components/common/CommentList/CommentArea';

interface ReviewCommentSectionProps {
  reviewId: number;
}

const ReviewCommentSection = ({ reviewId }: ReviewCommentSectionProps) => {
  const { isLoggedIn, loginId, nickname, profileImage } = useAuth();
  const {
    comments,
    isLoading: isCommentsLoading,
    handleCreateComment,
    handleUpdateComment,
    handleDeleteComment,
    error
  } = useReviewComments(reviewId);

  return (
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
        isLoggedIn={isLoggedIn ?? false}
      />
    </div>
  );
};

export default ReviewCommentSection; 