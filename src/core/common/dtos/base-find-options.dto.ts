import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';

import { Injectable } from '@nestjs/common';
export enum Order {
  ASC = 'asc',
  DESC = 'desc',
}
@Injectable()
export abstract class BaseFindOptionsDto {
  @Transform(({ value }) => {
    const num = parseInt(value);
    if (isNaN(num)) return 1;
    return num;
  })
  readonly pageNumber = 1;

  @Transform(({ value }) => {
    const num = parseInt(value);
    if (isNaN(num)) return 10;
    return num;
  })
  readonly pageSize = 10;

  readonly sortBy: string

  @IsEnum(Order, { each: true })
  @IsOptional()
  readonly sortDirection: Order = Order.DESC;

  sortByField(listFields: { [key: string]: string }): string {
    return Object.values(listFields).includes(this.sortBy)
      ? this.sortBy
      : 'createdAt';
  }

  get skip(): number {
    return this.pageSize * (this.pageNumber - 1);
  }

  get order(): 'ASC' | 'DESC' {
    return this.sortDirection === Order.ASC ? 'ASC' : 'DESC';
  }
}
