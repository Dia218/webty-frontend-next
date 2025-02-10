// CommentItem List

const renderCommentWithReplies = (comment: CommentResponseDto) => {
  return (
    <div key={comment.commentId} className="space-y-2">
      <CommentItem
        comment={comment}
        currentUserId={currentUserId}
        onEdit={onEdit}
        onDelete={onDelete}
        onReply={onReply}
        existingUsers={existingUsers}
      />
      {comment.childComments && comment.childComments.length > 0 && (
        <div className="ml-12 space-y-2">
          {comment.childComments.map((reply) => (
            <NestedCommentItem
              key={reply.commentId}
              comment={reply}
              currentUserId={currentUserId}
              onEdit={onEdit}
              onDelete={onDelete}
              existingUsers={existingUsers}
            />
          ))}
        </div>
      )}
    </div>
  );
};

return (
  <div className="space-y-4">
    {comments.map((comment) => renderCommentWithReplies(comment))}
  </div>
);
