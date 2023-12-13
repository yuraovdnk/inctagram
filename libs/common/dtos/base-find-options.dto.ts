import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Order {
  ASC = 'asc',
  DESC = 'desc',
}

export abstract class BaseFindOptionsDto {
  @IsInt()
  @ApiProperty()
  @IsOptional()
  pageNumber = 1;

  @IsInt()
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
