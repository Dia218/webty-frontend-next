/**
 * 검색 관련 모듈을 내보내는 인덱스 파일
 */

// hooks
export { useSearchLogic } from './hooks/useSearchLogic';
export { useSearchCore } from './hooks/useSearchCore';
export { useSearchSuggestions } from './hooks/useSearchSuggestions';

// api
export {
  search,
  searchByRecommendations,
  searchByRecent,
  searchByViewCount,
  getSearchSuggestions,
  getPopularSearchTerms
} from './api/searchApi';

// utils
export { 
  getSearchParams,
  convertSortParam 
} from './utils/searchMappings';

// types
export type { 
  SearchResult,
  SearchTypeMapping,
  SearchLogicParams,
  FetchResultsParams,
  SearchSuggestionDto
} from './types/searchTypes'; 