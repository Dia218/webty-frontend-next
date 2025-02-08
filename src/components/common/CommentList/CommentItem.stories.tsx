import type { Meta, StoryObj } from '@storybook/react';
import CommentItem from './CommentItem';
import { mockUsers, baseComment, editedComment } from './TestDataForStorybook';

const meta = {
  title: 'Components/CommentList/CommentItem',
  component: CommentItem,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    comment: {
      control: 'object',
      description: '댓글 데이터'
    },
    currentUserId: {
      control: 'number',
      description: '현재 로그인한 사용자의 ID'
    },
    existingUsers: {
      control: 'object',
      description: '멘션 가능한 사용자 목록'
    },
    onEdit: {
      action: 'edited'
    },
    onDelete: {
      action: 'deleted'
    },
    onReply: {
      action: 'replied'
    }
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-3xl p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CommentItem>;

export default meta;
type Story = StoryObj<typeof meta>;

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
    comment: baseComment,
    currentUserId: mockUsers[0].id,
    existingUsers: mockUsers,
    ...defaultHandlers
  },
  parameters: {
    docs: {
      description: {
        story: '기본 댓글 컴포넌트입니다.'
      }
    }
  }
};

export const WithEditedComment: Story = {
  args: {
    comment: editedComment,
    currentUserId: mockUsers[0].id,
    existingUsers: mockUsers,
    ...defaultHandlers
  },
  parameters: {
    docs: {
      description: {
        story: '수정된 댓글을 보여주는 컴포넌트입니다.'
      }
    }
  }
};
