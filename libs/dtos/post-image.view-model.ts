import { ImageVariants } from '../../apps/files-microservice/src/modules/images/application/types/post-image-types';
import { ImageVersion } from '../../apps/files-microservice/src/modules/images/domain/entities/post-image.schema';

export class PostImageViewModel {
  size: number;
  variant: ImageVariants;
  url: string;
  id: string;
  constructor(image: ImageVersion) {
    this.size = image.size;
    this.url = image.url;
    this.variant = image.variant;
  }
}
