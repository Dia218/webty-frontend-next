'use client';

import {
  GhostTabs,
  GhostTabsList,
  GhostTabsTrigger,
  GhostTabsContent,
} from '@/components/common/GhostTabs/GhostTabs';

const WebtoonDrawerTaps = () => {
  return (
    <GhostTabs defaultValue="firstTap">
      <GhostTabsList>
        <GhostTabsTrigger value="firstTap">투표 현황</GhostTabsTrigger>
        <GhostTabsTrigger value="secondTap">게시글 보기</GhostTabsTrigger>
      </GhostTabsList>

      <GhostTabsContent value="firstTap">
        <p>투표 현황 component가 여기에 들어갑니다.</p>
      </GhostTabsContent>
      <GhostTabsContent value="secondTap">
        <p>게시글 보기 component가 여기에 들어갑니다.</p>
      </GhostTabsContent>
    </GhostTabs>
  );
};

export default WebtoonDrawerTaps;
