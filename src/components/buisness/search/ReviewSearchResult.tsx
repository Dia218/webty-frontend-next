'use client';

import { useState, useEffect, useCallback } from 'react';
import { ReviewItemResponseDto } from '@/lib/types/review/ReviewItemResponseDto';
import { Button } from '@/components/ui/button';
import { SmallReviewList } from '@/components/common/SmallReviewList/SmallReviewList';
import useSearch from '@/lib/api/search/search';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ReviewPageProps {
  searchQuery: string;
  searchType?: string;
}

interface SearchResponse {
  results: ReviewItemResponseDto[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
}

const ReviewPage: React.FC<ReviewPageProps> = ({ searchQuery, searchType = 'all' }) => {
  const [reviews, setReviews] = useState<ReviewItemResponseDto[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('recommend');
  const { search } = useSearch();

  const fetchSearchResults = useCallback(async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    try {
      console.log('검색 시작:', {
        searchQuery,
        currentPage,
        sortBy,
        searchType,
        filter: searchType === 'review' ? 'review' : 'all'
      });
      
      // 백엔드 API에 맞게 파라미터 설정
      const searchTypeParam = searchType === 'review' ? 'reviewContent' : undefined;
      const filterParam = searchType === 'review' ? 'review' : 'all';
      
      console.log('검색 API 호출 직전 파라미터:', {
        searchQuery, 
        currentPage, 
        sortBy, 
        searchTypeParam, 
        filterParam
      });
      
      const data = await search(
        searchQuery,
        currentPage,
        10,
        searchTypeParam,
        sortBy,
        filterParam
      );
      
      console.log('검색 결과:', data);
      
      if (data && Array.isArray(data.results)) {
        console.log(`검색 결과 ${data.results.length}건 찾음`);
        setReviews(data.results);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.currentPage || 0);
      } else {
        console.warn('검색 결과가 없거나 잘못된 형식:', data);
        setReviews([]);
        setTotalPages(1);
        setCurrentPage(0);
      }
    } catch (error: any) {
      console.error('검색 중 오류 발생:', error);
      setReviews([]);
      setTotalPages(1);
      setCurrentPage(0);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, currentPage, sortBy, searchType, search]);

  useEffect(() => {
    console.log('검색어 또는 정렬 방식 변경:', { searchQuery, sortBy });
    if (searchQuery) {
      setCurrentPage(0);
      fetchSearchResults();
    }
  }, [searchQuery, sortBy]);

  useEffect(() => {
    console.log('페이지 변경:', currentPage);
    if (searchQuery && currentPage > 0) {
      fetchSearchResults();
    }
  }, [currentPage]);

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(0);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-xl font-bold mb-4">리뷰 검색 결과</h1>
      
      <div className="mb-4">
        <Tabs defaultValue="recommend" value={sortBy} onValueChange={handleSortChange}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="recommend">추천순</TabsTrigger>
            <TabsTrigger value="viewCount">조회순</TabsTrigger>
            <TabsTrigger value="recent">최신순</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <p>검색 중...</p>
        </div>
      ) : reviews.length > 0 ? (
        <>
          <SmallReviewList reviews={reviews} />
          <div className="flex justify-between mt-4">
            <Button onClick={goToPrevPage} disabled={currentPage === 0}>
              이전
            </Button>
            <span className="text-sm">
              {currentPage + 1} / {totalPages}
            </span>
            <Button onClick={goToNextPage} disabled={currentPage >= totalPages - 1}>
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

export default ReviewPage;
