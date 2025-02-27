'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { fetchWebtoons } from '@/lib/api/webtoon/webtoon';
import WebtoonList from '@/components/common/WebtoonList/WebtoonList';
import useSearch from '@/lib/api/search/search';
import { WebtoonDetailDto } from '@/lib/types/webtoon/WebtoonDetailDto';

interface WebtoonPageProps {
  searchQuery: string;
  searchType?: string;
}

const WebtoonPage: React.FC<WebtoonPageProps> = ({ searchQuery, searchType = 'all' }) => {
  const [webtoons, setWebtoons] = useState<WebtoonDetailDto[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { search } = useSearch();

  useEffect(() => {
    if (!searchQuery.trim()) {
      setWebtoons([]);
      return;
    }

    const fetchSearchResults = async () => {
      setIsLoading(true);
      console.log('🔍 웹툰 검색 시작:', { searchQuery, currentPage, searchType });

      try {
        // 검색 타입에 관계없이 항상 웹툰 검색 결과를 표시
        // 검색 타입이 'webtoon'인 경우 searchType 파라미터를 'webtoonName'으로 설정
        const searchTypeParam = 
          searchType === 'webtoon' || searchType === 'all' ? 'webtoonName' : undefined;
        
        console.log('🔍 검색 API 호출 파라미터:', { 
          keyword: searchQuery, 
          page: currentPage, 
          size: 10, 
          searchType: searchTypeParam, 
          sortBy: 'recommend', 
          filter: searchType 
        });
        
        const data = await search(searchQuery, currentPage, 10, searchTypeParam, 'recommend', searchType);
        console.log('✅ 검색 API 응답 데이터:', data);
        
        if (data && data.results && data.results.length > 0) {
          // 검색 결과에서 웹툰 정보 추출
          const extractedWebtoons = extractWebtoonFromReviews(data.results);
          console.log('🔍 추출된 웹툰 정보:', extractedWebtoons);
          
          if (extractedWebtoons.length > 0) {
            setWebtoons(extractedWebtoons);
            setTotalPages(Math.ceil(extractedWebtoons.length / 10) || 1);
          } else {
            console.warn('⚠️ 추출된 웹툰 정보가 없음, 기존 웹툰 API 사용');
            fallbackToWebtoonApi();
          }
        } else {
          console.warn('⚠️ 검색 API 응답이 없거나 비어있음, 기존 웹툰 API 사용');
          fallbackToWebtoonApi();
        }
      } catch (error) {
        console.error('❌ 웹툰 검색 API 요청 실패:', error);
        fallbackToWebtoonApi();
      } finally {
        setIsLoading(false);
      }
    };

    const fallbackToWebtoonApi = async () => {
      try {
        console.log('🔍 기존 웹툰 API 호출:', { webtoonName: searchQuery });
        const fallbackData = await fetchWebtoons(0, 10, { webtoonName: searchQuery });
        console.log('✅ 기존 웹툰 API 응답:', fallbackData);
        
        if (fallbackData && fallbackData.content) {
          setWebtoons(fallbackData.content);
          setTotalPages(fallbackData.totalPages || 1);
        } else {
          setWebtoons([]);
        }
      } catch (fallbackError) {
        console.error('❌ 기존 웹툰 API 요청 실패:', fallbackError);
        setWebtoons([]);
      }
    };

    fetchSearchResults();
  }, [searchQuery, currentPage, searchType]);

  // 검색 결과에서 웹툰 정보 추출 (중복 제거)
  const extractWebtoonFromReviews = (reviews: any[]): WebtoonDetailDto[] => {
    const uniqueWebtoons = new Map<number, WebtoonDetailDto>();
    
    reviews.forEach(review => {
      console.log('🔍 리뷰 데이터 확인:', review);
      
      if (review.webtoon) {
        const webtoonId = review.webtoon.webtoonId || review.webtoon.id;
        if (webtoonId) {
          console.log('🔍 리뷰에서 웹툰 정보 추출:', review.webtoon);
          
          uniqueWebtoons.set(webtoonId, {
            webtoonId: webtoonId,
            webtoonName: review.webtoon.webtoonName || review.webtoon.title || '',
            platform: review.webtoon.platform || '',
            webtoonLink: review.webtoon.webtoonLink || '#',
            thumbnailUrl: review.webtoon.thumbnailUrl || review.webtoon.imageUrl || '',
            authors: review.webtoon.authors || review.webtoon.author || '',
            finished: review.webtoon.finished || false
          });
        }
      }
    });
    
    return Array.from(uniqueWebtoons.values());
  };

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-xl font-bold mb-4">웹툰 검색 결과</h1>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <p>검색 중...</p>
        </div>
      ) : webtoons.length > 0 ? (
        <>
          <WebtoonList webtoons={webtoons} />
          <div className="flex justify-between mt-4">
            <Button onClick={goToPrevPage} disabled={currentPage === 0} size="sm">
              이전
            </Button>
            <span className="text-sm">
              {currentPage + 1} / {totalPages}
            </span>
            <Button onClick={goToNextPage} disabled={currentPage >= totalPages - 1} size="sm">
              다음
            </Button>
          </div>
        </>
      ) : (
        <p>검색 결과가 없습니다.</p>
      )}
    </div>
  );
};

export default WebtoonPage;
