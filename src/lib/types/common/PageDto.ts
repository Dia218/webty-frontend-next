export interface PageDto<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
  }