'use client';

import {
  GhostTabs,
  GhostTabsList,
  GhostTabsTrigger,
  GhostTabsContent,
} from '@/components/common/GhostTabs/GhostTabs';
import { useEffect, useState } from 'react';
import { getFavoriteWebtoonList } from '@/lib/api/webtoon/favorite';
import { WebtoonDetailDto } from '@/lib/types/webtoon/WebtoonDetailDto';
import WebtoonList from '@/components/common/WebtoonList/WebtoonList';
import RecommendedReviewBox from '../../common/RecommendedReviewBox/RecommendedReviewBox';

const UserDrawerTaps = ({ loginId }: { loginId: number }) => {
  const [favoriteWebtoons, setFavoriteWebtoons] = useState<WebtoonDetailDto[]>(
    []
  );

  useEffect(() => {
    const fetchFavorites = async () => {
      const data = await getFavoriteWebtoonList();
      setFavoriteWebtoons(data);
    };

    fetchFavorites();
  }, []);

  return (
    <GhostTabs defaultValue="firstTap">
      <GhostTabsList>
        <GhostTabsTrigger value="firstTap">관심 웹툰 목록</GhostTabsTrigger>
        <GhostTabsTrigger value="secondTap">게시글 보기</GhostTabsTrigger>
        <GhostTabsTrigger value="thirdTap">추천내역</GhostTabsTrigger>
      </GhostTabsList>

      <GhostTabsContent value="firstTap">
        <WebtoonList webtoons={favoriteWebtoons} isHorizontal={true} />
      </GhostTabsContent>
      <GhostTabsContent value="secondTap">
        <p>게시글 보기 component가 여기에 들어갑니다.</p>
      </GhostTabsContent>
      <GhostTabsContent value="thirdTap">
        <RecommendedReviewBox userId={loginId} />
      </GhostTabsContent>
    </GhostTabs>
  );
};

export default UserDrawerTaps;
