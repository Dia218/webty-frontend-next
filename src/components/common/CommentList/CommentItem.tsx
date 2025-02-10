// 댓글 component

import React, { useState } from 'react';
import CommentArea from '../CommentArea';
import CommentContainer from '../CommentContainer';

const CommentItem = ({ comment, existingUsers }) => {
  const [isReplying, setIsReplying] = useState(false);

  const handleReply = (reply) => {
    // Handle reply submission
  };

  return (
    <div>
      <CommentContainer>
        {/* Comment content rendering */}
      </CommentContainer>

      {isReplying && (
        <div className="ml-12 mt-2">
          <CommentArea
            onSubmit={handleReply}
            onCancel={() => setIsReplying(false)}
            placeholder="답글을 입력하세요..."
            existingUsers={existingUsers}
            isThreadView={true}
          />
        </div>
      )}
    </div>
  );
};

export default CommentItem;
