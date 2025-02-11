// // CommentItem.stories.tsx
// import { Meta, StoryObj } from '@storybook/react'
// import C

// import { CommentResponseDto } from '@/lib/types/reviewComment/CommentResponseDto';


// // 스토리북 메타 정보

// const meta: Meta<typeof CommentList> = {
//     title: 'Components/RootCommentItem',
//     component: CommentItem,
//     tags: ['autodocs'],
// }

// export default meta;

// type Story = StoryObj<typeof CommentList>

// // 더미 데이터 생성
// const mockComment: CommentResponseDto = {
//   commentId: 1,
//   content: '이것은 댓글입니다.',
//   createdAt: '2025-02-10T21:30:00.000Z',
//   user: {
//     id:1,
//     nickname: '홍길동',
//     profileImage: 'https://via.placeholder.com/40',
//   },
//   childComments: [
//     {
//       commentId: 2,
//       content: '이것은 대댓글입니다.',
//       createdAt: '2025-02-10T21:35:00.000Z',
//       modifiedAt : '2025-02-10T21:35:00.000Z',
//       depth : 1,
//       user: {
//         id: 2 ,
//         nickname: '김철수',
//         profileImage: 'https://via.placeholder.com/40',
//       },
//       mentions :[],
//       childComments: [],
//     },
//   ],
// }

// export const Default: Story = {
//   args: {
//     comment: mockComment,
//   },
// }