export interface PageResponse<T> {
  content: Array<T>
  pageNumber: number
  pageSize: number;
  totalElements: number;
  totalPages: number;
}