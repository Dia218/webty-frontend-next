'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import WebtoonItem from '@/components/common/WebtoonList/WebtoonItem';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { fetchWebtoons } from '@/lib/api/search/webtoonSearch';
import { WebtoonDetailDto } from '@/lib/types/webtoon/WebtoonDetailDto';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}
const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [webtoons, setWebtoons] = useState<WebtoonDetailDto[]>([]);
  const [loading, setLoading] = useState(false);
  const handleSearch = async () => {
    if (!searchText.trim()) return;
    setLoading(true);
    const result = await fetchWebtoons(0, { webtoonName: searchText });
    if (result && result.content) {
      setWebtoons(result.content);
    } else {
      setWebtoons([]);
    }
    setLoading(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-6 bg-white rounded-lg shadow-lg">
        <DialogTitle>리뷰 작성</DialogTitle>
        {/* 검색 입력창 */}
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="웹툰 검색"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            검색
          </button>
        </div>
        {/* 검색 결과 표시 */}
        <div className="flex flex-col gap-4">
          {loading ? (
            <p className="text-center text-gray-500">검색 중...</p>
          ) : webtoons.length > 0 ? (
            webtoons.map((webtoon) => (
              <div key={webtoon.webtoonId} className="border p-4 rounded-lg">
                <WebtoonItem webtoon={webtoon} />
                <button
                  className="mt-2 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                  onClick={() =>
                    router.push(
                      `/review?webtoonId=${webtoon.webtoonId}&webtoonName=${encodeURIComponent(
                        webtoon.webtoonName
                      )}`
                    )
                  }
                >
                  리뷰 작성하기
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">검색 결과가 없습니다.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default WriteReviewModal;
