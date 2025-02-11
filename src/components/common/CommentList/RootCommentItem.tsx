'use client'

import { CommentResponseDto } from '@/lib/types/reviewComment/CommentResponseDto';
import React from 'react'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';


interface RootCommentItemProps {
  comment: CommentResponseDto;
}

const RootCommentItem = ({ comment }: RootCommentItemProps) => {
  return (
    <Card
    className="flex border border-gray-300 rounded-lg p-4"
   >
     {/*최상단 : 세로로 배치 >> 상단-중간-하단 */ }
     <div className="flex-col" >

       {/* 상단부분 : 유저정보, 작성일+수정일 */}
        <div className="flex border border-gray-300 justify-between">
             {/* 유저- 이미지, 닉네임*/}
             <div className="flex border border-gray-300 items-center">
                <img
                 src={comment.user.profileImage}
                className="w-[28px] h-[28px] bg-black rounded-full border-gray-600"
                />
                <div className="mx-2 text-[15px] text-gray-500 ">{comment.user.nickname}</div>
            </div>
            <div>
                {/* 작성일, 수정일 */}
                <div className="mx-2 mt-1 text-[10px] text-gray-500"> 작성일: 2222.22.22</div>
                <div className="mx-2 mb-1 text-[10px] text-gray-500"> 수정일: 2000.0.0 </div>
            </div>
        </div>

        {/* 중간부분 : 댓글 내용 */}
        <div className="flex-col border border-gray-300 text-sm text-gray-600">
            댓글내용 ddddddd ddfeafasdfaefgqgfqf trwerwqerads dafa dsfsa ffasfd af dafas dfasfd fsdf sfs dsa ddae feeeeee eafeer wras
             f f ds aa de w fsd fds fa sdfas
        </div>

        {/* 하단부분 :수정+삭제 버튼 */}
        <div className="flex justify-end border border-gray-300">
            <button className="p-1 bg-gray-300 m-1 text-[12px] rounded-sm">수정</button>
            <button className="p-1 bg-black m-1 text-[12px] text-white rounded-sm">삭제</button>
        </div>
      

        
    </div> 
  </Card>
  );
};

export default RootCommentItem;
