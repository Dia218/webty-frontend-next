'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { fetchWebtoons } from '@/lib/api/webtoon/webtoon';
import WebtoonList from '@/components/common/WebtoonList/WebtoonList';
import { WebtoonDetailDto } from '@/lib/types/webtoon/WebtoonDetailDto';

interface WebtoonPageProps {
  searchQuery: string;
  searchType?: string;
  limit?: number;
}

const WebtoonPage: React.FC<WebtoonPageProps> = ({ 
  searchQuery, 
  searchType = 'webtoonName',
  limit
}) => {
  const [webtoons, setWebtoons] = useState<WebtoonDetailDto[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  // 반복 호출 방지를 위한 참조 변수
  const isInitialLoadComplete = useRef(false);
  const lastSearchQuery = useRef('');

  const loadWebtoons = useCallback(async (isLoadingMore = false) => {
    // 이미 로딩 중이거나 검색어가 없는 경우 스킵
    if (!searchQuery.trim() || isLoading) return;
    
    // 초기 로드가 완료되었고 동일한 검색어에 대해 다시 초기 로드하려는 시도인 경우 스킵
    if (!isLoadingMore && 
        isInitialLoadComplete.current && 
        lastSearchQuery.current === searchQuery && 
        webtoons.length > 0) {
      return;
    }
    
    setIsLoading(true);
    setLoadError(null);
    
    try {
      // 검색어가 변경되었으면 페이지를 0으로 설정
      const pageToLoad = isLoadingMore ? currentPage + 1 : 0;
      
      console.log('웹툰 검색 API 호출:', {
        query: searchQuery,
        searchType: searchType,
        page: pageToLoad,
        isLoadingMore,
        isInitialLoadComplete: isInitialLoadComplete.current
      });
      
      // API 호출 시 limit 파라미터 추가
      const response = await fetchWebtoons({
        query: searchQuery,
        searchType: searchType,
        page: pageToLoad,
        size: limit || 10 // limit이 제공되면 사용하고, 아니면 기본값 10 사용
      });
      
      if (response) {
        if (isLoadingMore) {
          // 중복 데이터 방지를 위한 검사
          const existingIds = new Set(webtoons.map(item => item.webtoonId));
          const newItems = response.content.filter(item => !existingIds.has(item.webtoonId));
          
          // 기존 데이터에 새 데이터 추가
          setWebtoons(prev => [...prev, ...newItems]);
        } else {
          // 새로운 검색어의 경우 결과 초기화
          setWebtoons(response.content);
        }
        
        setCurrentPage(pageToLoad);
        setTotalPages(response.totalPages || 1);
        setHasMore(pageToLoad < (response.totalPages - 1));
        
        // 검색 완료 표시
        isInitialLoadComplete.current = true;
        lastSearchQuery.current = searchQuery;
      } else {
        setLoadError('검색 결과를 불러오는데 실패했습니다.');
        if (!isLoadingMore) {
          setWebtoons([]);
        }
      }
    } catch (error) {
      console.error('웹툰 검색 중 오류 발생:', error);
      setLoadError('검색 중 오류가 발생했습니다. 다시 시도해 주세요.');
      if (!isLoadingMore) {
        setWebtoons([]);
      }
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, searchType, currentPage, isLoading, fetchWebtoons]);

  // 검색어 변경 시 데이터 초기화 및 첫 페이지 로드
  useEffect(() => {
    // 검색어가 변경된 경우에만 초기화 및 로드
    if (lastSearchQuery.current !== searchQuery) {
      isInitialLoadComplete.current = false;
      
      // 상태 업데이트를 한 번에 처리
      const resetState = () => {
        setCurrentPage(0);
        setWebtoons([]);
        setHasMore(true);
        setLoadError(null);
      };
      
      resetState();
      
      if (searchQuery) {
        // setTimeout을 사용하여 상태 업데이트 후 loadWebtoons 호출
        setTimeout(() => {
          loadWebtoons(false);
        }, 0);
      } else {
        isInitialLoadComplete.current = true;
        lastSearchQuery.current = '';
      }
    }
  }, [searchQuery, loadWebtoons]); // loadWebtoons를 의존성 배열에 추가

  // 더 보기 버튼 클릭 시 호출되는 함수
  const handleLoadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      console.log('더 보기 버튼 클릭:', { currentPage, nextPage: currentPage + 1 });
      loadWebtoons(true);
    }
  }, [isLoading, hasMore, currentPage, loadWebtoons]);

  // 이미지 에러 핸들링 함수 추가
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/placeholder-image.png';  // 에러 발생 시 기본 이미지로 대체
  };

  return (
    <div className="w-full">
      {loadError && (
        <div className="bg-red-50 text-red-500 p-3 rounded mb-4">
          {loadError}
        </div>
      )}
      
      {webtoons.length > 0 ? (
        <>
          <WebtoonList 
            webtoons={limit ? webtoons.slice(0, limit) : webtoons} 
            onImageError={handleImageError} 
          />
          
          {/* 더 보기 버튼 - limit이 설정된 경우 표시하지 않음 */}
          {!limit && (
            <div className="flex justify-center mt-6">
              {isLoading ? (
                <div className="flex flex-col items-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 mb-2"></div>
                  <p className="text-gray-500 text-sm">로딩 중...</p>
                </div>
              ) : hasMore ? (
                <Button 
                  onClick={handleLoadMore} 
                  className="px-6 py-2"
                  variant="outline"
                >
                  더 보기 ({currentPage + 1}/{totalPages})
                </Button>
              ) : (
                <div className="text-center py-2 text-sm text-gray-500">
                  <div className="w-full max-w-sm mx-auto border-t border-gray-200 pt-4">
                    모든 웹툰 검색 결과를 불러왔습니다.
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      ) : isLoading ? (
        <div className="flex justify-center items-center h-60">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900 mb-2"></div>
            <p className="text-gray-500">검색 중...</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10">
          <p className="text-gray-500 my-6">검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default WebtoonPage;