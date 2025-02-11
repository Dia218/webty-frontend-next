import { Meta, StoryObj } from '@storybook/react'
import RootCommentItem from './RootCommentItem'
import { CommentResponseDto } from '@/lib/types/reviewComment/CommentResponseDto'

const meta: Meta<typeof RootCommentItem> = {
  title: 'Components/RootCommentItem',
  component: RootCommentItem,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof RootCommentItem>

const mockComment: CommentResponseDto = {
  user: {
    id:1,
    nickname: '홍길동',
    profileImage: 'https://via.placeholder.com/40', // 더미 이미지
  },
  content: '이것은 테스트 댓글입니다.',
  createdAt: new Date().toISOString(),
}

export const Default: Story = {
  args: {
    comment: mockComment,
  },
}

export const LongComment: Story = {
  args: {
    comment: {
      ...mockComment,
      content:
        '이것은 매우 긴 댓글입니다. 길이가 긴 경우에도 정상적으로 표시되는지 확인하기 위한 테스트용 댓글입니다. 이것은 매우 긴 댓글입니다. 길이가 긴 경우에도 정상적으로 표시되는지 확인하기 위한 테스트용 댓글입니다.',
    },
  },
}