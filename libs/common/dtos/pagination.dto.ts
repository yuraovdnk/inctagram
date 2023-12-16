import { BaseFindOptionsDto } from './base-find-options.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PageDto<T> {
  @ApiProperty()
  pagesCount: number;
  @ApiProperty()
  page: number;
  @ApiProperty()
  pageSize: number;
  @ApiProperty()
  totalCount: number;
  @ApiProperty()
  items: T[];
  constructor(
    items: any,
    queryParams: BaseFindOptionsDto,
    totalCount?: number,
  ) {
    const calculatedPages = Math.ceil(totalCount / queryParams.pageSize);
    this.pagesCount = !Number.isFinite(calculatedPages) ? 0 : calculatedPages;
    this.page = queryParams.pageNumber;
    this.totalCount = totalCount;
    this.pageSize = queryParams.pageSize;
    this.items = items;
  }
}
