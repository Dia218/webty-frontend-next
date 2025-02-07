export interface PageDto<T> {
  content: T[];           // 리스트 형식의 콘텐츠
  currentPage: number;    // 현재 페이지 번호
  totalPages: number;     // 전체 페이지 수
  totalElements: number;  // 전체 요소의 수
  hasNext: boolean;       // 다음 페이지가 있는지 여부
  hasPrevious: boolean;   // 이전 페이지가 있는지 여부
  isLast: boolean;        // 마지막 페이지인지 여부
}