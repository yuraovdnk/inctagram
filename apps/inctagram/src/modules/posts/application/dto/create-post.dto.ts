import { Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({
    required: false,
    description: 'post description',
    maxLength: 500,
  })
  @Length(0, 500)
  description: string;

  @ApiProperty({
    description:
      'Array of uploaded images (PNG or JPEG format,maximum 10 images allowed, maximum size: 20MB each)',
    type: 'array',
    items: {
      type: 'file',
      items: {
        type: 'string',
        format: 'binary',
      },
    },
  })
  private images: Express.Multer.File[];
}
