import type { Meta, StoryObj } from '@storybook/react';
import CommentList from './CommentList';
import { useArgs } from '@storybook/preview-api';
import { mockUsers, baseComment, baseNestedComment, secondNestedComment } from './TestDataForStorybook';
import { CommentResponseDto } from '@/lib/types/reviewComment/CommentResponseDto';

const meta = {
  title: 'Components/CommentList',
  component: CommentList,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
    },
  },
  tags: ['autodocs'],
  render: function Render(args) {
    const [{ comments }, updateArgs] = useArgs();

    const handleEdit = (commentId: number, content: string) => {
      const updatedComments = comments.map((comment: CommentResponseDto) => {
        if (comment.commentId === commentId) {
          return {
            ...comment,
            content,
            modifiedAt: new Date().toISOString()
          };
        }
        if (comment.childComments) {
          return {
            ...comment,
            childComments: comment.childComments.map((childComment) => {
              if (childComment.commentId === commentId) {
                return {
                  ...childComment,
                  content,
                  modifiedAt: new Date().toISOString()
                };
              }
              return childComment;
            })
          };
        }
        return comment;
      });
      updateArgs({ comments: updatedComments });
      console.log('Edit comment:', commentId, content);
    };

    const handleDelete = (commentId: number) => {
      const updatedComments = comments.filter((comment: CommentResponseDto) => {
        if (comment.commentId === commentId) {
          return false;
        }
        if (comment.childComments) {
          comment.childComments = comment.childComments.filter(
            (childComment) => childComment.commentId !== commentId
          );
        }
        return true;
      });
      updateArgs({ comments: updatedComments });
      console.log('Delete comment:', commentId);
    };

    const handleReply = (content: string, parentId: number) => {
      const newReply: CommentResponseDto = {
        commentId: Math.max(...comments.flatMap((c: CommentResponseDto) => [c.commentId, ...(c.childComments?.map((cc: CommentResponseDto) => cc.commentId) || [])])) + 1,
        content,
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
        user: mockUsers[2],
        depth: 1,
        mentions: [],
        childComments: []
      };

      const updatedComments = comments.map((comment: CommentResponseDto) => {
        if (comment.commentId === parentId) {
          return {
            ...comment,
            childComments: [...(comment.childComments || []), newReply]
          };
        }
        return comment;
      });
      updateArgs({ comments: updatedComments });
      console.log('Reply to comment:', parentId, content);
    };

    return (
      <div className="w-full max-w-3xl mx-auto">
        <CommentList
          {...args}
          comments={comments}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onReply={handleReply}
        />
      </div>
    );
  },
} satisfies Meta<typeof CommentList>;

export default meta;
type Story = StoryObj<typeof meta>;

// 첫 번째 댓글 스레드
const firstThread = {
  ...baseComment,
  childComments: [baseNestedComment, secondNestedComment]
};

// 두 번째 댓글 스레드
const secondThread = {
  commentId: 4,
  content: '작화가 점점 발전하는 게 눈에 보여요! 초반부터 보고 있었는데 정말 많이 성장하셨네요 👏 특히 이번화 마지막 장면 구도가 영화의 한 장면 같았어요. 앞으로가 더 기대됩니다! 🎬✨',
  createdAt: new Date(Date.now() - 7200000).toISOString(), // 2시간 전
  modifiedAt: new Date(Date.now() - 7200000).toISOString(),
  user: mockUsers[2],
  depth: 0,
  mentions: [],
  childComments: [
    {
      commentId: 5,
      content: '@독자1 맞아요! 초반이랑 비교하면 정말 많이 발전하셨죠. 캐릭터들의 표정 연기도 더 섬세해진 것 같아요 💕',
      createdAt: new Date(Date.now() - 5400000).toISOString(), // 1시간 30분 전
      modifiedAt: new Date(Date.now() - 5400000).toISOString(),
      user: mockUsers[1],
      depth: 1,
      mentions: ['독자1'],
      childComments: []
    }
  ]
};

const mockComments: CommentResponseDto[] = [firstThread, secondThread];

const defaultHandlers = {
  onEdit: (commentId: number, content: string) => {
    console.log('Edit comment:', commentId, content);
  },
  onDelete: (commentId: number) => {
    console.log('Delete comment:', commentId);
  },
  onReply: (content: string, parentId: number) => {
    console.log('Reply to comment:', content, parentId);
  }
};

export const Default: Story = {
  args: {
    comments: mockComments,
    currentUserId: mockUsers[0].id,
    existingUsers: mockUsers,
    ...defaultHandlers
  }
};

export const Empty: Story = {
  args: {
    comments: [],
    currentUserId: 1,
    existingUsers: mockUsers,
    ...defaultHandlers
  }
};