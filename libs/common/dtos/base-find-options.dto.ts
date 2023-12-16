import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export enum Order {
  ASC = 'asc',
  DESC = 'desc',
}

export abstract class BaseFindOptionsDto {
  @Type(() => Number)
  @ApiProperty()
  @IsOptional()
  pageNumber = 1;

  @Type(() => Number)
  @IsOptional()
  pageSize = 10;

  @IsEnum(Order, { each: true })
  @IsOptional()
  sortDirection: Order = Order.DESC;

  get skip(): number {
    return this.pageSize * (this.pageNumber - 1);
  }

  get order(): 'ASC' | 'DESC' {
    return this.sortDirection === Order.ASC ? 'ASC' : 'DESC';
  }
}
