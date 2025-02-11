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
    className="border border-gray-300 rounded-lg p-4"
   >
     {/*최상단 : 세로로 배치 >> 상단-중간-하단 */ }
     <div className="flex-col" >

       {/* 상단부분 : 유저정보, 작성일+수정일 */}
        <div className="flex justify-between">
             {/* 유저- 이미지, 닉네임*/}
             <div className="flex items-center">
                <img
                 src={comment.user.profileImage}
                 className="w-[28px] h-[28px] bg-black rounded-full "
                />
                <div className="mx-2 text-[15px] text-gray-500 ">{comment.user.nickname}</div>
            </div>
            <div>
                {/* 작성일, 수정일 */}
                <div className="mx-2 mb-0.5 text-[10px] text-gray-500"> 작성일: {comment.createdAt} </div>
                <div className="mx-2 mb-1 text-[10px] text-gray-500"> 수정일: {comment.modifiedAt} </div>
            </div>
        </div>

        {/* 중간부분 : 댓글 내용 */}
        <div className="flex-col my-2 pr-6 text-sm text-gray-600">
            {comment.content}
        </div>

        {/* 하단부분 :수정+삭제 버튼 */}
        <div className="flex justify-end ">
            <button className="p-1 bg-gray-300 m-1 text-[12px] rounded-sm">수정</button>
            <button className="p-1 bg-black m-1 text-[12px] text-white rounded-sm">삭제</button>
        </div>
              
    </div> 
  </Card>
  );
};

export default RootCommentItem;
