// CommentItem.stories.tsx
import { Meta, StoryFn } from '@storybook/react'; // Story -> StoryFn으로 변경
import CommentItem, { CommentItemProps } from './CommentItem';
import { CommentResponseDto } from '@/lib/types/reviewComment/CommentResponseDto';

export default {
  title: 'Components/CommentItem',
  component: CommentItem,
} as Meta;

const Template: StoryFn<CommentItemProps> = (args) => <CommentItem {...args} />; // Story -> StoryFn으로 변경

const sampleComment: CommentResponseDto = {
  commentId: 1,
  content: 'This is a comment.',
  user: {
    // 'author' 대신 'user'로 수정
    id: 1, // id나 다른 필요한 필드를 넣어주세요
    nickname: 'User1',
    profileImage: 'user1@example.com', // 예시로 추가한 필드
  },
  createdAt: '2025-02-10T00:00:00Z',
  modifiedAt: '2025-02-10T00:00:00Z',
  depth: 0,
  mentions: [],
  childComments: [
    {
      commentId: 2,
      content: 'This is a reply.',
      user: {
        // 'author' 대신 'user'로 수정
        id: 2,
        nickname: 'User2',
        profileImage: 'user2@example.com', // 예시로 추가한 필드
      },
      createdAt: '2025-02-10T00:00:00Z',
      modifiedAt: '2025-02-10T00:00:00Z',
      depth: 1,
      mentions: [],
      childComments: [],
    },
  ],
};

export const Default = Template.bind({});
Default.args = {
  comment: sampleComment,
};
