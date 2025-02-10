'use client';

import { useEffect, useState } from 'react';
import {
  GhostTabs,
  GhostTabsList,
  GhostTabsTrigger,
  GhostTabsContent,
} from '@/components/common/GhostTabs/GhostTabs';
import { getFavoriteWebtoonList } from '@/lib/api/webtoon/favorite';
import { fetchRecommendedReviews } from '@/lib/api/review/recommend';
import { WebtoonDetailDto } from '@/lib/types/webtoon/WebtoonDetailDto';
import { PageDto } from '@/lib/types/common/PageDto';
import { ReviewItemResponseDto } from '@/lib/types/review/ReviewItemResponseDto';
import WebtoonList from '@/components/common/WebtoonList/WebtoonList';
import WideReviewBox from '../../common/WideReviewBox/WideReviewBox';

const UserDrawerTaps = ({ loginId }: { loginId: number }) => {
  const [favoriteWebtoons, setFavoriteWebtoons] = useState<WebtoonDetailDto[]>(
    []
  );
  const [recommendedReviews, setRecommendedReviews] = useState<
    PageDto<ReviewItemResponseDto>
  >({
    content: [],
    currentPage: 0,
    totalPages: 1,
    totalElements: 0,
    hasNext: false,
    hasPrevious: false,
    isLast: true,
  });
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    const fetchFavorites = async () => {
      const data = await getFavoriteWebtoonList();
      setFavoriteWebtoons(data);
    };

    fetchFavorites();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await fetchRecommendedReviews(loginId, currentPage);
        setRecommendedReviews(data);
      } catch (error) {
        console.error('Failed to fetch recommended reviews:', error);
      }
    };

    fetchReviews();
  }, [loginId, currentPage]);

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
        <WideReviewBox
          pageData={recommendedReviews}
          onPageChange={setCurrentPage}
        />
      </GhostTabsContent>
    </GhostTabs>
  );
};

export default UserDrawerTaps;
