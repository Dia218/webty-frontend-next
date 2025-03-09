/**
 * 검색어 자동완성 응답 DTO 인터페이스
 * 백엔드 DTO와 일치하도록 업데이트됨
 */
export interface SearchSuggestionDto {
  // 자동완성 목록
  suggestions: string[];
  // 검색 URL(정렬 방식 정보 포함)
  searchUrl: string;
}