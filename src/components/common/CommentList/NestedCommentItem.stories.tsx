import type { Meta, StoryObj } from '@storybook/react';
import NestedCommentItem from './NestedCommentItem';
import { mockUsers, baseNestedComment, secondNestedComment } from './TestDataForStorybook';

const meta = {
  title: 'Components/CommentList/NestedCommentItem',
  component: NestedCommentItem,
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
      description: '대댓글 데이터'
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
    }
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-3xl p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof NestedCommentItem>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultHandlers = {
  onEdit: (commentId: number, content: string) => {
    console.log('Edit nested comment:', commentId, content);
  },
  onDelete: (commentId: number) => {
    console.log('Delete nested comment:', commentId);
  }
};

export const Default: Story = {
  args: {
    comment: baseNestedComment,
    currentUserId: mockUsers[1].id,
    existingUsers: mockUsers,
    ...defaultHandlers
  },
  parameters: {
    docs: {
      description: {
        story: '기본 대댓글 컴포넌트입니다.'
      }
    }
  }
};

export const SecondNestedComment: Story = {
  args: {
    comment: secondNestedComment,
    currentUserId: mockUsers[2].id,
    existingUsers: mockUsers,
    ...defaultHandlers
  },
  parameters: {
    docs: {
      description: {
        story: '두 번째 대댓글 컴포넌트입니다.'
      }
    }
  }
}; 