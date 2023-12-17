import { Pagination } from '@src/common/module/pagination/pagination';
import { PaginationMeta } from '@src/common/module/pagination/pagination.interface';

interface PaginationOptions<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  [key: string]: any; // For any other option.
}

/**
 * Create a pagination object.
 * @param {PaginationOptions<T>} options - Options to create the pagination object.
 * @returns {Pagination<T>} The pagination object.
 */
export function createPagination<T>({
  data,
  total,
  page = 1,
  per_page = 10,
  ...rest
}: PaginationOptions<T>): Pagination<T> {
  if (page < 1 || per_page < 1) {
    throw new Error('Page and per_page values must be positive.');
  }

  const totalPages = Math.ceil(total / per_page);

  const meta: PaginationMeta = {
    total,
    current_page: page,
    per_page,
    total_pages: totalPages,
    first: page > 1 ? 1 : null,
    previous: page > 1 ? page - 1 : null,
    next: page < totalPages ? page + 1 : null,
    last: page < totalPages ? totalPages : null,
    has_more: page < totalPages,
    has_previous: page > 1,
    ...rest,
  };

  return new Pagination<T>(meta, data);
}
