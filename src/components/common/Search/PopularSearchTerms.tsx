'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getPopularSearchTerms } from '@/lib/api/search/api/searchApi';
import { Loader2 } from 'lucide-react';

interface PopularSearchTermsProps {
  onTermClick?: (term: string) => void;
  className?: string;
}

/**
 * 인기 검색어 목록을 표시하는 컴포넌트
 */
const PopularSearchTerms: React.FC<PopularSearchTermsProps> = ({ 
  onTermClick,
  className = ''
}) => {
  const router = useRouter();
  const [popularTerms, setPopularTerms] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPopularTerms = async () => {
      try {
        setIsLoading(true);
        const response = await getPopularSearchTerms();
        
        if (response && response.suggestions.length > 0) {
          setPopularTerms(response.suggestions);
        } else {
          // API에서 결과가 없으면 샘플 데이터 표시
          setPopularTerms(['웹툰', '판타지', '로맨스', '액션', '일상']);
        }
      } catch (err) {
        console.error('인기 검색어 조회 중 오류 발생:', err);
        setError(err instanceof Error ? err : new Error('인기 검색어를 불러오는데 실패했습니다.'));
        // 오류 발생시 샘플 데이터 표시
        setPopularTerms(['웹툰', '판타지', '로맨스', '액션', '일상']);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularTerms();
  }, []);

  const handleTermClick = (term: string) => {
    if (onTermClick) {
      onTermClick(term);
    } else {
      router.push(`/search?query=${encodeURIComponent(term)}&type=all`);
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        <span>인기 검색어 로딩 중...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-red-500 p-4 ${className}`}>
        인기 검색어를 불러오는데 실패했습니다.
      </div>
    );
  }

  if (popularTerms.length === 0) {
    return (
      <div className={`text-gray-500 p-4 ${className}`}>
        인기 검색어가 없습니다.
      </div>
    );
  }

  return (
    <div className={`p-4 ${className}`}>
      <h3 className="font-bold text-lg mb-2">인기 검색어</h3>
      <div className="flex flex-wrap gap-2">
        {popularTerms.map((term, index) => (
          <button
            key={index}
            onClick={() => handleTermClick(term)}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
          >
            {index + 1}. {term}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PopularSearchTerms; 