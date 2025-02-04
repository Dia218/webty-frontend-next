'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import {
  addFavoriteWebtoon,
  checkFavoriteWebtoon,
  deleteFavoriteWebtoon,
} from '@/lib/api/webtoon/favorite';

interface WebtoonDTO {
  webtoonId: string;
  webtoonName: string;
  platform: string;
  webtoonLink: string;
  thumbnailUrl: string;
  authors: string;
  finished: boolean;
}

interface WebtoonDetailProps {
  webtoon: WebtoonDTO; // 단일 웹툰 객체를 props로 전달
}

export default function WebtoonDetail({ webtoon }: WebtoonDetailProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  // 관심 웹툰 여부 확인
  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      const isFav = await checkFavoriteWebtoon(webtoon.webtoonId);
      setIsFavorite(isFav);
    };

    fetchFavoriteStatus();
  }, [webtoon.webtoonId]);

  // 관심 웹툰 추가/삭제
  const handleFavoriteToggle = async () => {
    if (loading) return; // 중복 클릭 방지
    setLoading(true);

    try {
      let success = false;
      if (isFavorite) {
        success = await deleteFavoriteWebtoon(webtoon.webtoonId);
      } else {
        success = await addFavoriteWebtoon(webtoon.webtoonId);
      }

      if (success) {
        setIsFavorite((prev) => !prev);
      }
    } catch (error) {
      console.error('관심 웹툰 추가/삭제 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-6xl p-6">
      <CardContent className="flex items-center gap-10">
        {/* 썸네일 */}
        <div className="relative">
          <img
            src={webtoon.thumbnailUrl}
            alt={`${webtoon.webtoonName} Thumbnail`}
            className="w-[300px] h-[400px] object-cover rounded-lg shadow-lg"
          />
          {/* 관심 웹툰 하트 버튼 */}
          <button
            onClick={handleFavoriteToggle}
            disabled={loading}
            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md"
          >
            <Heart
              size={28}
              className={`transition-all duration-300 ${
                isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'
              }`}
            />
          </button>
        </div>

        {/* 상세 정보 */}
        <div className="flex flex-col justify-between h-[400px]">
          <h1 className="text-4xl font-bold mb-4">{webtoon.webtoonName}</h1>
          <p className="text-3xl font-bold mb-4">작가: {webtoon.authors}</p>
          <Badge
            variant={webtoon.finished ? 'default' : 'outline'}
            className="inline-flex items-center justify-center text-base px-4 py-2 mb-2"
          >
            {webtoon.finished ? '연재 완료' : '연재 중'}
          </Badge>
          <p className="text-3xl font-bold mb-4">플랫폼: {webtoon.platform}</p>
          <Button asChild className="px-6 py-3 text-base">
            <a
              href={webtoon.webtoonLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              웹툰 바로가기
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
