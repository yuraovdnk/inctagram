import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmEmailDto {
  @ApiProperty({
    description: 'Code that be sent via Email inside link',
    required: true,
    format: 'uuid',
  })
  @IsUUID()
  code: string;
}
