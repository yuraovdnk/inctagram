import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmEmailDto {
  @ApiProperty({
    description: 'confirm code',
    required: true,
    type: 'string',
  })
  @IsNotEmpty({ message: 'code is required' })
  code: string;
}
