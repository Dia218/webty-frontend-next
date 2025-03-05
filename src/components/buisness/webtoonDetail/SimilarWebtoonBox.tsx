import { useEffect, useState } from 'react';
import { getSimilarList } from '@/lib/api/similar/similar';
import { SimilarWebtoonDto } from '@/lib/types/similar/SimilarWebtoonDto';
import { PageDto } from '@/lib/types/common/PageDto';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/api/security/useAuth';
import {
  AgreeButton,
  DisagreeButton,
} from '@/components/common/RecommendButton/RecommendButton';
import { cancelVote, vote } from '@/lib/api/voting/vote';

interface SimilarWebtoonListProps {
  targetWebtoonId: number;
}

export const SimilarWebtoonBox = ({
  targetWebtoonId,
}: SimilarWebtoonListProps) => {
  const { isLoggedIn } = useAuth();
  const [similarList, setSimilarList] = useState<SimilarWebtoonDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 페이지네이션을 위한 상태
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    fetchSimilarWebtoons(currentPage);
  }, [isLoggedIn, currentPage]);

  const fetchSimilarWebtoons = async (page: number) => {
    setLoading(true);
    const data: PageDto<SimilarWebtoonDto> | null = await getSimilarList(
      targetWebtoonId,
      page
    );
    if (data) {
      setSimilarList(data.content);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
    }
    setLoading(false);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="p-4 max-w-9xl mx-auto max-h-[500px] overflow-y-auto">
      <h2 className="text-lg font-bold mb-2">유사 웹툰 목록</h2>

      {loading ? (
        <p className="text-center">로딩 중...</p>
      ) : similarList.length > 0 ? (
        <>
          <div className="h-[370px] overflow-y-auto border rounded-lg p-2">
            {similarList.map((webtoon) => {
              const totalVotes = webtoon.agreeCount + webtoon.disagreeCount;
              const agreeRate =
                totalVotes > 0 ? (webtoon.agreeCount / totalVotes) * 100 : 0;
              const disagreeRate = 100 - agreeRate;

              return (
                <div
                  key={webtoon.similarId}
                  className="flex gap-4 mb-4 p-4 border rounded-lg items-center"
                >
                  <img
                    src={webtoon.similarThumbnailUrl}
                    alt="웹툰 썸네일"
                    width={100}
                    height={100}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex flex-col flex-1">
                    <p className="text-sm font-semibold mb-2">
                      {webtoon.similarWebtoonName}
                    </p>

                    {/* Progress Bar Section */}
                    <div className="w-full h-6 bg-gray-200 rounded-lg relative overflow-hidden">
                      {/* 동의 수: 왼쪽 정렬 */}
                      <div
                        className="absolute top-0 left-0 h-full bg-green-500 flex items-center pl-2 text-sm text-white"
                        style={{ width: `${agreeRate}%` }}
                      >
                        {webtoon.agreeCount > 0 && (
                          <span className="ml-1">{webtoon.agreeCount}</span>
                        )}
                      </div>

                      {/* 비동의 수: 오른쪽 정렬 */}
                      <div
                        className="absolute top-0 right-0 h-full bg-red-500 flex items-center justify-end pr-2 text-sm text-white"
                        style={{ width: `${disagreeRate}%` }}
                      >
                        {webtoon.disagreeCount > 0 && (
                          <span className="mr-1">{webtoon.disagreeCount}</span>
                        )}
                      </div>
                    </div>

                    {/* 버튼 간격 조절 - 양쪽 마진 추가 */}
                    <div className="mt-2 flex justify-between px-6">
                      <AgreeButton
                        isLoggedIn={isLoggedIn ?? false}
                        onActivate={() => vote(webtoon.similarId, 'AGREE')}
                        onDeactivate={() => cancelVote(webtoon.similarId)}
                      />
                      <DisagreeButton
                        isLoggedIn={isLoggedIn ?? false}
                        onActivate={() => vote(webtoon.similarId, 'DISAGREE')}
                        onDeactivate={() => cancelVote(webtoon.similarId)}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 페이지네이션 버튼 */}
          <div className="flex justify-between mt-4">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              variant="outline"
            >
              이전
            </Button>
            <span className="text-sm">
              {currentPage + 1} / {totalPages}
            </span>
            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              variant="outline"
            >
              다음
            </Button>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-500">유사 웹툰이 없습니다.</p>
      )}
    </div>
  );
};
