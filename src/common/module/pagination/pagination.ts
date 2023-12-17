import { PaginationMeta } from '@src/common/module/pagination/pagination.interface';

/**
 * A helper class to paginate query results.
 */
export class Pagination<PaginationObject> {
  constructor(
    /**
     * associated meta information (e.g., counts)
     */
    public readonly pagination: PaginationMeta,
    /**
     * a list of items to be returned
     */
    public readonly data: PaginationObject[],
  ) {}
}
