import { CommentResponseDto } from '@/lib/types/reviewComment/CommentResponseDto';

interface NestedCommentItemProps {
  comment: Omit<CommentResponseDto, 'childComments'>;
}

const NestedCommentItem = ({ comment }: NestedCommentItemProps) => {
  return <div>구현해주세요</div>;
};

export default NestedCommentItem;
