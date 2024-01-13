import { OrderByDirection } from 'objection';

export interface PaginationOptions<T> {
  /**
   * the page that is requested
   */
  page?: number;
  /**
   * the amount of items to be requested per page
   */
  per_page?: number;
  /**
   * sort by field
   */
  sort?: keyof T | string;
  /**
   * sort order
   */
  order?: OrderByDirection;
}

export interface PaginationMeta {
  /**
   * the amount of items on this specific page
   */
  total: number;
  /**
   * the total amount of items
   */
  per_page: number;
  /**
   * the current page this paginator "points" to
   */
  current_page: number;
  /**
   * the total amount of pages in this paginator
   */
  total_pages: number;
  /**
   * a link to the "first" page
   */
  first: number | null;
  /**
   * a link to the "previous" page
   */
  previous: number | null;
  /**
   * a link to the "next" page
   */
  next: number | null;
  /**
   * a link to the "last" page
   */
  last: number | null;
  /**
   * whether there are more pages
   */
  has_more: boolean;
  /**
   * whether there are previous pages
   */
  has_previous: boolean;
  /**
   * whether the current page is empty
   */
  is_empty: boolean;
  /**
   * first page url
   */
  first_page_url?: string;
  /**
   * last page url ex: ?page=1&per_page=10
   */
  last_page_url?: string;
  /**
   * current page url
   */
  next_page_url?: string;
  /**
   * previous page url
   */
  previous_page_url?: string;
  /**
   * any other meta information
   */
  [key: string]: any;
}
