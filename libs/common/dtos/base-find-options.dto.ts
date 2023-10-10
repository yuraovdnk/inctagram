import { IsEnum, IsInt, IsOptional } from 'class-validator';

import { Injectable } from '@nestjs/common';

export enum Order {
  ASC = 'asc',
  DESC = 'desc',
}
@Injectable()
export abstract class BaseFindOptionsDto {
  @IsInt()
  @IsOptional()
  pageNumber = 1;

  @IsInt()
  @IsOptional()
  pageSize = 10;

  @IsEnum(Order, { each: true })
  @IsOptional()
  readonly sortDirection: Order = Order.DESC;

  get skip(): number {
    return this.pageSize * (this.pageNumber - 1);
  }

  get order(): 'ASC' | 'DESC' {
    return this.sortDirection === Order.ASC ? 'ASC' : 'DESC';
  }
}
