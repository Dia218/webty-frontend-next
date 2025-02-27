import { ReviewItemResponseDto } from '../review/ReviewItemResponseDto';

/**
 * 검색 결과 응답 DTO 인터페이스
 */
export interface SearchResponseDto {
  // 검색어
  keyword: string;
  // 검색 결과(리뷰 목록)
  results: ReviewItemResponseDto[];
} 