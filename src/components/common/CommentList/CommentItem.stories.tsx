import { Meta, StoryObj } from '@storybook/react';
import CommentItem from './CommentItem';
import { CommentResponseDto } from '@/lib/types/reviewComment/CommentResponseDto';
import { userEvent, within } from '@storybook/test';

const meta: Meta<typeof CommentItem> = {
  title: 'Components/CommentItem',
  component: CommentItem,
  argTypes: {
    onReply: { action: 'onReply' },
    onEdit: { action: 'onEdit' },
    onDelete: { action: 'onDelete' },
    onSubmitReply: { action: 'onSubmitReply' },
  },
};

export default meta;
type Story = StoryObj<typeof CommentItem>;

const sampleComment: CommentResponseDto = {
  commentId: 1,
  content: '이것은 예제 댓글입니다.',
  createdAt: new Date().toISOString(),
  modifiedAt: new Date().toISOString(),
  user: {
    nickname: '테스터',
    profileImage: '',
    id: 0,
  },
  mentions: [],
  depth: 0,
  childComments: [],
};

export const Default: Story = {
  args: {
    comment: sampleComment,
    currentNickname: '테스터',
    existingNicknames: ['테스터'],
  },
};

export const WithMentions: Story = {
  args: {
    comment: {
      ...sampleComment,
      content: '@다른유저 이것은 멘션이 포함된 댓글입니다.',
    },
    currentNickname: '테스터',
    existingNicknames: ['테스터', '다른유저'],
  },
};

export const Editing: Story = {
  args: {
    comment: sampleComment,
    currentNickname: '테스터',
    existingNicknames: ['테스터'],
    isTestMode: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('수정'));
  },
};

export const Replying: Story = {
  args: {
    comment: sampleComment,
    currentNickname: '테스터',
    existingNicknames: ['테스터'],
    isTestMode: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByText('답글'));
  },
};
