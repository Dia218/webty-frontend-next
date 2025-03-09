import { SearchSuggestionDto } from '@/lib/types/search/SearchSuggestionDto';

/**
 * 검색 결과 및 관련 상태/함수들을 포함하는 인터페이스(타입정의 등..)
 */
export interface SearchResult<T> {
  items: T[];                             // 검색 결과 아이템 배열
  isLoading: boolean;                     // 로딩 상태
  currentPage: number;                    // 현재 페이지
  totalPages: number;                     // 전체 페이지 수
  sortBy: string;                         // 현재 정렬 방식
  goToNextPage: () => void;               // 다음 페이지로 이동
  goToPrevPage: () => void;               // 이전 페이지로 이동
  handleSortChange: (value: string) => void; // 정렬 방식 변경
  hasMore: boolean;                       // 추가 데이터 존재 여부
  loadMore: () => void;                   // 추가 데이터 로드 함수
}

/**
 * 검색 타입과 백엔드 파라미터 매핑
 */
export type SearchTypeMapping = {
  searchTypeParam: string | undefined;
  filterParam: string;
};

/**
 * 검색 로직 훅 파라미터
 */
export interface SearchLogicParams {
  searchQuery: string;
  searchType: string;
  initialSort?: string;
  limit?: number;
}

/**
 * 검색 실행 함수 파라미터
 */
export interface FetchResultsParams {
  searchQuery: string;
  page: number;
  isLoadingMore: boolean;
  searchTypeParam: string | undefined;
  filterParam: string;
  sortBy: string;
  limit: number;
}

// SearchSuggestionDto는 @/lib/types/search/SearchSuggestionDto에서 임포트하여 사용
export type { SearchSuggestionDto }; 