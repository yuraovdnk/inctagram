import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmEmailDto {
  @ApiProperty({
    description: 'confirm code',
    required: true,
    type: 'string',
  })
  @IsUUID()
  code: string;
}
