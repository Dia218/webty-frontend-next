import React from 'react'; 
import { Meta, StoryObj } from '@storybook/react';
import ReviewDetailBackground from '@/components/buisness/review/ReviewDetailBackground';
import ReviewDetailContent from '@/components/buisness/review/ReviewDetailContent';
import { ReviewDetailResponseDto } from '@/lib/types/review/ReviewDetailResponseDto';

const meta = {
  title: 'Components/ReviewDetailBackground',
  component: ReviewDetailBackground,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'light',
    },
  },
  // 스토리가 차지할 수 있는 최대 공간과 상대 위치를 가진 컨테이너
  decorators: [
    (Story) => (
      <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ReviewDetailBackground>;

export default meta;
type Story = StoryObj<typeof ReviewDetailBackground>;

export const Default: Story = {
  args: {
    data: {
      reviewId: 1,
      userDataResponse: {
        id: 1,
        nickname: "사용자",
        profileImage: "https://example.com/profile.jpg",
      },
      content: "리뷰 내용입니다.",
      title: "리뷰 제목",
      viewCount: 100,
      spoilerStatus: 'FALSE',
      thumbnailUrl: "https://example.com/thumbnail.jpg",
      imageUrls: ["https://example.com/image1.jpg"],
      commentResponses: {
        content: [],
        currentPage: 1,
        totalPages: 1,
        totalElements: 0,
        hasNext: false,
        hasPrevious: false,
        last: true,
      },
      createdAt: "2024-02-10T12:00:00",
      updatedAt: null,
      recommendCount: {
        hates: 0,
        likes: 10,
      },
    } as ReviewDetailResponseDto,
  },
  render: (args) => (
    // 상위 컨테이너는 이미 상대 위치를 가진 decorator에서 처리하고 있으므로, 그대로 배경과 컨텐츠를 렌더링
    <>
      <ReviewDetailBackground data={args.data as ReviewDetailResponseDto} />
      <ReviewDetailContent />
    </>
  ),
};
