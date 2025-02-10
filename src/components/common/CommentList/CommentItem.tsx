import { Card, CardContent } from '@/components/ui/card';
import RootCommentItem from './RootCommentItem';
import NestedCommentItem from './NestedCommentItem';
import { CommentResponseDto } from '@/lib/types/reviewComment/CommentResponseDto';

export interface CommentItemProps {
  comment: CommentResponseDto;
}

const CommentItem = ({ comment }: CommentItemProps) => {
  const { childComments, ...nestedCommentData } = comment;

  return (
    <Card className="flex flex-col sm:flex-row w-full min-w-[200px] max-w-[450px] mx-auto cursor-pointer rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <CardContent className="flex flex-1 p-4 flex-col justify-between">
        {/* NestedCommentItem에 데이터 전달 (childComments 제외) */}
        <NestedCommentItem comment={nestedCommentData} />

        {/* childComments 배열을 순회하면서 RootCommentItem 생성 */}
        {childComments?.map((child) => (
          <RootCommentItem key={child.commentId} comment={child} />
        ))}
      </CardContent>
    </Card>
  );
};

export default CommentItem;
