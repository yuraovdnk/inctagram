import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConfirmEmailDto {
  @ApiProperty({
    description: 'Code that be sent via Email inside link',
    required: true,
    type: 'uuid',
  })
  @IsUUID()
  code: string;
}
