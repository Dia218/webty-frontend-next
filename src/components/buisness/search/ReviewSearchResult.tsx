'use client';

import { useState, useEffect } from 'react';
import { ReviewItemResponseDto } from '@/lib/types/review/ReviewItemResponseDto';
import { Button } from '@/components/ui/button';
import { SmallReviewList } from '@/components/common/SmallReviewList/SmallReviewList';
import useSearch from '@/lib/api/search/search';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ReviewPageProps {
  searchQuery: string;
  searchType?: string;
}

const ReviewPage: React.FC<ReviewPageProps> = ({ searchQuery, searchType = 'all' }) => {
  const [reviews, setReviews] = useState<ReviewItemResponseDto[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('recommend');
  const { search } = useSearch();

  useEffect(() => {
    if (!searchQuery.trim()) {
      setReviews([]);
      return;
    }

    const fetchSearchResults = async () => {
      setIsLoading(true);
      console.log('🔍 검색 API 요청:', { searchQuery, currentPage, searchType, sortBy });

      try {
        // 리뷰 타입이 아닌 경우에도 리뷰 결과를 보여주되, 검색 타입에 맞게 필터링
        const searchTypeParam = 
          searchType === 'review' ? 'reviewContent' : 
          searchType === 'user' ? 'nickname' : 
          searchType === 'webtoon' ? 'webtoonName' : 
          undefined; // 'all'인 경우 undefined로 설정하여 백엔드에서 전체 검색 수행
        
        const data = await search(searchQuery, currentPage, 10, searchTypeParam, sortBy, searchType);
        if (data) {
          console.log('✅ 검색 API 응답 데이터:', data);
          setReviews(data.results || []);
          // 백엔드에서 페이지 정보를 제공하지 않으므로 임시로 설정
          // 실제로는 백엔드에서 페이지 정보를 받아와야 함
          setTotalPages(Math.ceil(data.results.length / 10) || 1);
        } else {
          console.warn('⚠️ 검색 API 응답이 예상과 다름:', data);
          setReviews([]);
        }
      } catch (error) {
        console.error('❌ 검색 API 요청 실패:', error);
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery, currentPage, searchType, sortBy]);

  const goToNextPage = () => {
    setCurrentPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  };

  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    setCurrentPage(0); // 정렬 변경 시 첫 페이지로 이동
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
