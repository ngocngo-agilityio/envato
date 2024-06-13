export interface PaginationType {
  arrOfCurrButtons: string[];
  currentPage: number;
  limit: number;
}

export interface FormatPaginationParams extends PaginationType {
  totalCount: number;
}

export interface PaginationTableType {
  arrOfCurrButtons: string[];
  currentPage: number;
  totalPage: number;
}
