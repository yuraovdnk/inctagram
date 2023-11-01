import { ImageVariants } from '../../apps/files-microservice/src/modules/images/application/types/post-image-types';
import { ApiProperty } from '@nestjs/swagger';
import { ImageVersion } from '../../apps/files-microservice/src/modules/images/domain/entities/image-version.schema';

export class PostImageViewModel {
  id: string;

  @ApiProperty()
  size: number;

  @ApiProperty()
  variant: ImageVariants;

  @ApiProperty()
  url: string;

  constructor(image: ImageVersion) {
    this.size = image.size;
    this.url = image.url;
    this.variant = image.variant;
  }
}
