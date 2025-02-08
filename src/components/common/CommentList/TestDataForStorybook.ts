import { UserDataResponseDto } from '@/lib/types/user/UserDataResponseDto';
import { CommentResponseDto } from '@/lib/types/reviewComment/CommentResponseDto';

export const mockUsers: UserDataResponseDto[] = [
  {
    id: 1,
    nickname: '웹툰러버',
    profileImage: 'https://avatars.githubusercontent.com/u/1?v=4'
  },
  {
    id: 2,
    nickname: '만화광',
    profileImage: 'https://avatars.githubusercontent.com/u/2?v=4'
  },
  {
    id: 3,
    nickname: '독자1',
    profileImage: 'https://avatars.githubusercontent.com/u/3?v=4'
  }
];

// 현재 시간 기준으로 상대적인 시간 생성
const now = new Date();
const oneHourAgo = new Date(now.getTime() - 3600000);
const thirtyMinsAgo = new Date(now.getTime() - 1800000);
const tenMinsAgo = new Date(now.getTime() - 600000);

export const baseComment: CommentResponseDto = {
  commentId: 1,
  content: '이번 에피소드 정말 감동적이었어요... 주인공이 과거를 회상하는 장면에서 눈물이 났습니다 😢 작가님의 섬세한 감정 표현이 돋보이는 회차였어요! ❤️',
  createdAt: oneHourAgo.toISOString(),
  modifiedAt: oneHourAgo.toISOString(),
  user: mockUsers[0],
  depth: 0,
  mentions: [],
  childComments: []
};

export const editedComment: CommentResponseDto = {
  ...baseComment,
  content: '와... 진짜 이번화 대박이었어요! 😭 특히 주인공이 과거의 트라우마를 극복하는 장면에서 눈물 찔끔 났네요... 작가님의 섬세한 감정 표현과 연출이 정말 인상적이에요. 다음 화가 기다려지네요! ❤️✨',
  modifiedAt: thirtyMinsAgo.toISOString()
};

export const baseNestedComment: CommentResponseDto = {
  commentId: 2,
  content: '@웹툰러버 맞아요!! 저도 그 장면에서 울컥했어요 ㅠㅠ 특히 회상 장면에서 흑백 톤으로 전환되는 연출이 너무 좋았어요.',
  createdAt: thirtyMinsAgo.toISOString(),
  modifiedAt: thirtyMinsAgo.toISOString(),
  user: mockUsers[1],
  depth: 1,
  mentions: ['웹툰러버'],
  childComments: []
};

export const secondNestedComment: CommentResponseDto = {
  commentId: 3,
  content: '@웹툰러버 @만화광 저도 완전 공감이에요! 거기에 배경음악까지 너무 잘 어울려서 몰입감 최고였습니다 👍',
  createdAt: tenMinsAgo.toISOString(),
  modifiedAt: tenMinsAgo.toISOString(),
  user: mockUsers[2],
  depth: 1,
  mentions: ['웹툰러버', '만화광'],
  childComments: []
}; 