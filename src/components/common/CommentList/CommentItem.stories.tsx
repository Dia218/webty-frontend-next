import type { Meta, StoryObj } from '@storybook/react';
import { CommentItems } from './CommentItem';

const meta: Meta<typeof CommentItems> = {
  title: 'Comments/CommentItems',
  component: CommentItems,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof CommentItems>;

const mockComment = {
  commentId: 1,
  content: '테스트 댓글입니다.',
  createdAt: new Date().toISOString(),
  user: {
    userId: 1,
    nickname: '테스트 사용자',
    profileImageUrl: '/default-profile.png',
    email: 'test@example.com',
    role: 'USER',
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString()
  },
  mentionedUsernames: []
};

export const Default: Story = {
  args: {
    comment: mockComment,
    currentUserId: 1,
    onEdit: (id, content) => console.log('Edit:', id, content),
    onDelete: (id) => console.log('Delete:', id),
  },
};

export const WithMention: Story = {
  args: {
    comment: {
      ...mockComment,
      content: '@사용자 안녕하세요!',
      mentionedUsernames: ['사용자']
    },
    currentUserId: 1,
    onEdit: (id, content) => console.log('Edit:', id, content),
    onDelete: (id) => console.log('Delete:', id),
  },
};