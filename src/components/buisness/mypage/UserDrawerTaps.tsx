'use client';

import {
  GhostTabs,
  GhostTabsList,
  GhostTabsTrigger,
  GhostTabsContent,
} from '@/components/common/GhostTabs/GhostTabs';

const UserDrawerTaps = () => {
  return (
    <GhostTabs defaultValue="firstTap">
      <GhostTabsList>
        <GhostTabsTrigger value="firstTap">관심 웹툰 목록</GhostTabsTrigger>
        <GhostTabsTrigger value="secondTap">게시글 보기</GhostTabsTrigger>
        <GhostTabsTrigger value="thirdTap">추천내역</GhostTabsTrigger>
      </GhostTabsList>

      <GhostTabsContent value="firstTap">
        <p>관심 웹툰 목록 component가 여기에 들어갑니다.</p>
      </GhostTabsContent>
      <GhostTabsContent value="secondTap">
        <p>게시글 보기 component가 여기에 들어갑니다.</p>
      </GhostTabsContent>
      <GhostTabsContent value="thirdTap">
        <p>추천내역 component가 여기에 들어갑니다.</p>
      </GhostTabsContent>
    </GhostTabs>
  );
};

export default UserDrawerTaps;
