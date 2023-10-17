import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class EditPostDto {
  @ApiProperty({
    required: false,
    description: 'post description',
    maxLength: 500,
  })
  @Length(0, 500)
  description: string;
}
