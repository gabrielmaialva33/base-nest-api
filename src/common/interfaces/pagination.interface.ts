export interface PaginationMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
  first_page: number;
  first_page_url: string;
  last_page_url: string;
  next_page_url: string;
  previous_page_url: string;
  sorted_by: string;
  direction: string;
}

export interface PaginationOptions {
  page?: number;
  per_page?: number;
  search?: string;
  sort?: string;
  direction?: string;
}

export interface Pagination<Model> {
  meta: PaginationMeta;
  data: Model[];
}
