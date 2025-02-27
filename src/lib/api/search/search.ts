import axios from 'axios';
import { SearchResponseDto } from '@/lib/types/search/SearchResponseDto';

// SearchSuggestionDto 인터페이스 정의
interface SearchSuggestionDto {
  suggestions: string[];
  searchUrl: string;
}

const API_BASE_URL = 'http://localhost:8080';

/**
 * 검색 API를 호출하는 함수
 * @param keyword 검색어
 * @param page 페이지 번호 (0부터 시작)
 * @param size 페이지 크기
 * @param searchType 검색 타입 (webtoonName, nickname, reviewContent, null)
 * @param sortBy 정렬 방식 (recommend, recent, viewCount)
 * @param filter 필터 (all, webtoon, user, review)
 * @returns 검색 결과
 */
export const search = async (
  keyword: string,
  page: number = 0,
  size: number = 10,
  searchType?: string,
  sortBy: string = 'recommend',
  filter: string = 'all'
): Promise<SearchResponseDto | null> => {
  try {
    const response = await axios.get<SearchResponseDto>(`${API_BASE_URL}/search`, {
      params: {
        keyword,
        page,
        size,
        searchType,
        sortBy,
        filter
      }
    });
    return response.data;
  } catch (error) {
    console.error('검색 API 호출 중 오류 발생:', error);
    return null;
  }
};

/**
 * 추천수 기준으로 정렬된 검색을 수행하는 함수
 */
export const searchByRecommendations = async (
  keyword: string,
  page: number = 0,
  size: number = 10,
  searchType?: string,
  filter: string = 'all'
): Promise<SearchResponseDto | null> => {
  return search(keyword, page, size, searchType, 'recommend', filter);
};

/**
 * 자동완성 제안을 가져오는 함수
 */
export const getSearchSuggestions = async (
  prefix: string,
  suggestionType?: string,
  sortBy: string = 'recommend'
): Promise<SearchSuggestionDto | null> => {
  try {
    const response = await axios.get<SearchSuggestionDto>(`${API_BASE_URL}/search/suggestions`, {
      params: {
        prefix,
        suggestionType,
        sortBy
      }
    });
    return response.data;
  } catch (error) {
    console.error('자동완성 API 호출 중 오류 발생:', error);
    return null;
  }
};

/**
 * 인기 검색어 목록을 가져오는 함수
 */
export const getPopularSearchTerms = async (): Promise<SearchSuggestionDto | null> => {
  try {
    const response = await axios.get<SearchSuggestionDto>(`${API_BASE_URL}/search/popular`);
    return response.data;
  } catch (error) {
    console.error('인기 검색어 API 호출 중 오류 발생:', error);
    return null;
  }
};

export const useSearch = () => {
  return {
    search,
    searchByRecommendations,
    getSearchSuggestions,
    getPopularSearchTerms
  };
};

export default useSearch; 