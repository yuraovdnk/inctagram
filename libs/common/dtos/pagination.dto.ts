import { BaseFindOptionsDto } from './base-find-options.dto';

export class PageDto<T> {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T[];
  constructor(
    items: any,
    queryParams: BaseFindOptionsDto,
    totalCount?: number,
  ) {
    this.pagesCount = Math.ceil(totalCount / queryParams.pageSize);
    this.page = queryParams.pageNumber;
    this.totalCount = totalCount;
    this.pageSize = queryParams.pageSize;
    this.items = items;
  }
}
