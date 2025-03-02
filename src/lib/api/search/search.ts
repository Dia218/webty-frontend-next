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
    const params = {
      keyword,
      page,
      size,
      searchType,
      sortBy,
      filter
    };
    
    console.log('🔍 검색 API 요청 URL:', `${API_BASE_URL}/search`);
    console.log('🔍 검색 API 요청 파라미터:', JSON.stringify(params, null, 2));
    console.log('🔍 정렬 매개변수 확인:', { sortBy, filter, searchType });
    
    const response = await axios.get<SearchResponseDto>(`${API_BASE_URL}/search`, {
      params,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      // 타임아웃 설정
      timeout: 10000
    });
    
    console.log('✅ 검색 API 응답 상태:', response.status);
    console.log('✅ 검색 API 응답 데이터:', JSON.stringify(response.data, null, 2));
    console.log('✅ 정렬 결과 확인:', { 
      요청정렬: sortBy, 
      결과개수: response.data?.results?.length || 0,
      필터: filter,
      검색유형: searchType
    });
    
    // 정렬 결과 검증 - 첫 5개 항목의 정렬 관련 필드 확인
    if (response.data?.results?.length > 0) {
      const sortFields = {
        recommend: 'recommendCount',
        viewCount: 'viewCount',
        recent: 'reviewId'  // createdAt이 없어 reviewId로 대체
      };
      
      const field = sortFields[sortBy as keyof typeof sortFields] || 'recommendCount';
      const sampleItems = response.data.results.slice(0, 5).map(item => ({
        reviewId: item.reviewId,
        [field]: item[field as keyof typeof item]
      }));
      
      console.log(`✅ ${sortBy} 정렬 검증:`, sampleItems);
    }
    
    // 데이터 유효성 검사
    if (!response.data) {
      console.warn('⚠️ 응답 데이터가 없습니다.');
      return null;
    }
    
    if (!response.data.results) {
      console.warn('⚠️ 검색 결과가 없거나 잘못된 형식입니다:', response.data);
      // 빈 결과 배열로 초기화하여 결과 없음을 올바르게 표시
      response.data.results = [];
      return response.data;
    }
    
    return response.data;
  } catch (error: any) {
    console.error('❌ 검색 API 호출 중 오류 발생:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
      params: error.config?.params,
      headers: error.config?.headers,
      stack: error.stack
    });
    
    // 특정 에러에 대한 추가 로깅
    if (error.response?.status === 401) {
      console.log('401 에러 상세 분석:', {
        headers: error.response.headers,
        data: error.response.data
      });
    }
    
    if (error.message === 'Network Error') {
      console.log('네트워크 오류 발생: 백엔드 서버가 실행 중인지 확인하세요.');
    }
    
    // 백엔드 연결 실패 시 기본 응답 제공
    return {
      keyword: keyword,
      results: [],
      currentPage: 0,
      totalPages: 0,
      totalElements: 0
    };
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